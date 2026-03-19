// dynamic form generation used for adding and editing items
import React, { useEffect } from 'react';

const DynamicForm = ({ formData, setFormData, fieldDefs }) => {

    // handle form changes
    const handleInputChange = (e) => {
        const { name, value:rawValue } = e.target;

        const fieldDef = fieldDefs.find(f => f.key === name); // find field definition

        let value = rawValue; // we will sanitize this

        if (!fieldDef) return; 

        // validation for partial date inputs
        if (fieldDef.type === "date" && fieldDef.partialDate) {
            const isPartial = formData[`${name}_partial`] ?? false; // follows the partial checkbox
            if (isPartial) {
                value = value.replaceAll(/[^\d-]/g, ""); // remove non-digit/non-dash

                if (value.length > 4 && value[4] !== "-") { // yyyy-mm
                    value = value.slice(0, 4) + "-" + value.slice(4);
                }
                if (value.length > 7) { 
                    value = value.slice(0, 7);
                };
            };
        };

        // validation for number inputs
        if (fieldDef.type === "number") {
            value = value.replaceAll(/[^\d.-]/g, "");       // remove invalid chars
            value = value.replace(/^(-?\d*\.?\d{0,2}).*$/, "$1"); // keep valid number format
        };

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // rerenders form data 
    useEffect(() => { 
        const handleFocus = () => setFormData(prev => ({ ...prev }));
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [setFormData]);

    // for input fields
    const getFieldInput = (field) => {
        const { key, type, options, required, partialDate } = field;

        if (options) {
            return ( // options input
                <select
                    className="form-select"
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

        if (type === "date" && partialDate) {
            const dateValue = formData[key] || "";

            // auto-detect partial only if there’s a value
            const autoDetectedPartial = dateValue ? !/^\d{4}-\d{2}-\d{2}$/.test(dateValue) : false;

            // determine isPartial
            const isPartial = formData[`${key}_partial`] ?? autoDetectedPartial;

            return ( // date input
                <>
                    <input
                        type={isPartial ? "text" : "date"}
                        className="form-control"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleInputChange}
                        placeholder={isPartial ? "YYYY or YYYY-MM" : undefined}
                        required={required}
                    />

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
            <input
            type={"text"}
            className="form-control"
            name={key}
            value={formData[key] || ""}
            onChange={handleInputChange}
            required={required}
            />
        );
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