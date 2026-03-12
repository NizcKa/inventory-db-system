// dynamic form generation based on current row state
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
        {fieldDefs.map(({ label, key, type, options }) => (
            <div className="mb-3" key={key}>
                <label className="form-label">{label}</label>

                {options ? (
                    <select
                        className="form-select"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
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
                    />
                )}

            </div>
        ))}
        </>
    );
};

export default DynamicForm;