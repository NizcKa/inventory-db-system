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

    useEffect(() => {
        const handleFocus = () => setFormData(prev => ({ ...prev }));
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [setFormData]);

    return (
        <>
        {fieldDefs.map(({ label, key, type, options, required }) => (
            <div className="mb-3" key={key}>
                <label className="form-label">
                    {label} {required && <span className="text-danger">*</span>}
                </label>

                {options ? (
                    <select
                        className="form-select"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                    	required={required}
                    >
                        <option value="" disabled hidden>
                            Select {label}
                        </option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type || "text"}
                        className="form-control"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                    	required={required}
                    />
                )}

            </div>
        ))}
        <p className="text-muted text-center mb-2">
	        All entries are automatically converted to uppercase when saved.
        </p>
        </>
    );
};

export default DynamicForm;