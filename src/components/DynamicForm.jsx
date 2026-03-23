// dynamic form generation used for adding and editing items
import React, { useEffect, useState } from 'react';

const DynamicForm = ({ formData, setFormData, fieldDefs }) => {

    // handle form changes
    const handleInputChange = (e) => {
        const { name, value:rawValue } = e.target;
        const isPartial = formData[`${name}_partial`] ?? false; //partial checkbox for date

        const fieldDef = fieldDefs.find(f => f.key === name); // find field definition

        let value = rawValue; // input to be sanitized
        let isInvalid = false;

        if (!fieldDef) return; 

        // validation for partial date inputs
        if (fieldDef.type === "date" && fieldDef.partialDate && isPartial) { // follows the partial checkbox
            const sanitizedDate = rawValue.replaceAll(/[^\d-]/g, ""); // remove non-digit/non-dash
            isInvalid = sanitizedDate !== rawValue; // trigger if input got altered
            value = sanitizedDate;

            if (value.length > 4 && value[4] !== "-") { // yyyy-mm
                value = value.slice(0, 4) + "-" + value.slice(4);
            }
            if (value.length > 7) { 
                value = value.slice(0, 7);
            };
        };

        // validation for number inputs
        if (fieldDef.type === "number") {
            const sanitizedNumber = value.replaceAll(/[^\d.-]/g, ""); // remove invalid chars
            isInvalid = sanitizedNumber !== rawValue;
            value = sanitizedNumber; 

            value = value.replace(/^(-?\d*\.?\d{0,2}).*$/, "$1"); // keep valid number format
        };

        setFormData(prev => ({
            ...prev,
            [name]: value,
            [`${name}_invalid`]: isInvalid
        }));
    };

    // rerenders form data 
    useEffect(() => { 
        const handleFocus = () => setFormData(prev => ({ ...prev }));
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [setFormData]);

    // form input fields
    const getFieldInput = (field) => {
        const { key, type, options, required, partialDate } = field;
        const isInvalid = formData[`${key}_invalid`] ?? false;

        if (options) {
            return ( // options input
                <select
                    className={`form-select ${isInvalid ? "is-invalid" : ""}`}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                    required={required}
                >
                    <option value="" disabled hidden>
                        Select {field.label}
                    </option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            );
        };

        if (type === "date" && partialDate) { // date input
            const dateValue = formData[key] || "";

            // auto-detect partial only if there’s a value
            const autoDetectedPartial = dateValue ? !/^\d{4}-\d{2}-\d{2}$/.test(dateValue) : false;

            // determine isPartial
            const isPartial = formData[`${key}_partial`] ?? autoDetectedPartial;

            return ( // date input
                <>
                    <input
                        type={isPartial ? "text" : "date"}
                        className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleInputChange}
                        placeholder={isPartial ? "YYYY or YYYY-MM" : undefined}
                        required={required}
                        aria-describedby='errorMessageDate'
                    />

                    <div id="errorMessageDate" className="invalid-feedback">
                        Please follow date formatting YYYY-MM (months are optional)
                    </div>

                    <div className="form-check mt-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name={`${key}_partial`}
                            checked={isPartial}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => ({
                                    ...prev,
                                    [`${key}_partial`]: checked,
                                    [key]: "", // clear value when toggling
                                    [`${key}_invalid`]: false 
                                }));
                            }}
                        />
                        <label className="form-check-label" htmlFor={`${key}_partial`}>
                            Partial Date
                        </label>
                    </div>
                </>
            );
        };

        return ( // default text input
            <>
                <input
                    type={"text"}
                    className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                    required={required}
                    aria-describedby='errorMessageText'
                />

                <div id={`${key}_error`} className="invalid-feedback">
                    {getErrorMessage(type, required)}
                </div>
            </>
        );
    };

    // error message based on field type
    const getErrorMessage = (type, required) => {
        if (type === "number") {
            return required
                ? "Required. Please enter a valid number."
                : "Please enter a valid number.";
        }

        if (required) {
            return "This field is required.";
        }

        return "Invalid input.";
    };

    return (
        <>
            {fieldDefs.map((field) => (
                <div className="mb-3" key={field.key}>

                    <label className="form-label">
                        {field.label} {field.required && <span className="text-danger">*</span>}
                    </label>

                    {getFieldInput(field)} 

                </div>
            ))}

            <p className="text-muted text-center mb-2">
                All entries are automatically converted to uppercase when saved.
            </p>
            
        </>
    );
};

export default DynamicForm;