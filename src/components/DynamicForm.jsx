// dynamic form generation used for adding and editing items
import React, { useEffect } from 'react';

const DynamicForm = ({ formData, setFormData, fieldDefs }) => {

    // handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => { // rerenders form data 
        const handleFocus = () => setFormData(prev => ({ ...prev }));
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [setFormData]);

     // handles partial date input
    const handlePartialDateInput = (e, key) => {
        let value = e.target.value;
        value = value.replaceAll(/[^\d-]/g, ""); // remove any non-digit and non-dash characters

        if (value.length > 4 && value[4] !== "-") {  // automatically insert a dash after 4 digits (YYYY)
            value = value.slice(0, 4) + "-" + value.slice(4);
        }

        if (value.length > 7) { // trim to max length of 7 (YYYY-MM)
            value = value.slice(0, 7);
        }

        setFormData(prev => ({ // update form data
            ...prev,
            [key]: value
        }));
    };

    // for input fields
    const getFieldInput = (field) => {
        const { key, type, options, required, partialDate } = field;

        if (options) {
            return ( // options input
                <select
                    className="form-select"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
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
                        onChange={(e) => handlePartialDateInput(e, key)}
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
            type={type || "text"}
            className="form-control"
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
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