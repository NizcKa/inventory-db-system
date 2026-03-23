// on submit form validations
const validateFormData = (formData, fieldDefs) => {
  const errors = {};

  fieldDefs.forEach((field) => {
    const value = formData[field.key] ?? "";

    if (field.required && !value.trim()) { // required fields check
      errors[field.key] = "Required";
      return;
    }

    if (field.type === "number") { 
      const value = (formData[field.key] ?? "").trim();

      const numPattern = /^-?\d+(\.\d{1,2})?$/; // accept only digits with optional - or . proceeded by 2 decimals max
      if (value && !numPattern.test(value)) { 
        errors[field.key] = "Invalid number format";
      }
    }

    if (field.type === "date" && field.partialDate && formData[`${field.key}_partial`]) {
      const value = (formData[field.key] ?? "").trim();

      const datePattern = /^\d{4}(-(0?[1-9]|1[0-2]))?$/; // yyyy-mm or yyyy

      if (value && !datePattern.test(value)) {
        errors[field.key] = "Invalid partial date. Must be YYYY or YYYY-MM";
      }
    }
  });

  return errors;
};

export default validateFormData;