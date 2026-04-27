// Save and add click validations

// field required check
const isRequiredInvalid = (field, value) => {
    return field.required && !value.trim();
};

// property number duplicate check
const isDuplicatePropertyNumber = (value, items) => {
    const currentValue = (value ?? "").toString().trim();

    return items.some((item) => {
        const existingValue = (item.Property_Number ?? "").toString().trim();
        return existingValue && existingValue === currentValue;
    });
};

// cost number validation
const isInvalidNumber = (value) => {
    const numPattern = /^-?\d+(\.\d{1,2})?$/;
    return value && !numPattern.test(value);
};

// partial date validation
const isInvalidPartialDate = (value) => {
    const datePattern = /^\d{4}(-(0?[1-9]|1[0-2]))?$/;
    return value && !datePattern.test(value);
};

// main validation
const validateFormData = (formData, fieldDefs, items) => {
    const errors = {};

    fieldDefs.forEach((field) => {
        const value = formData[field.key] ?? "";

        if (isRequiredInvalid(field, value)) {
            errors[field.key] = "Required";
            return;
        }

        if (field.key === "Property_Number" && !formData.allowDuplicatePropertyNumber && isDuplicatePropertyNumber(value, items)
        ) {
            errors[field.key] = "Duplicate Property Number already exists";
            return;
        }

        if (field.type === "number" && isInvalidNumber(value.trim())) {
            errors[field.key] = "Invalid number format";
        }

        if (field.type === "date" && field.partialDate && formData[`${field.key}_partial`] && isInvalidPartialDate(value.trim())) {
            errors[field.key] = "Invalid partial date. Must be YYYY or YYYY-MM";
        }
    });

    return errors;
};

export default validateFormData;