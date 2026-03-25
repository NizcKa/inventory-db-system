// search bars for column-based filtering
import React, { useMemo, useEffect, useState} from "react";
import debounce from "lodash/debounce";

const SearchBars = ({ fieldDefs, onSearchChange }) => {
    const [localInputs, setLocalInputs] = useState({}); // input local state

    // debounce function
    const debouncedFilter = useMemo(
        () =>
            debounce((column, value) => {
                onSearchChange(column, value);
            }, 250), // delay of 250ms
        [onSearchChange]
    );

    // cleanup
    useEffect(() => {
        return () => debouncedFilter.cancel(); 
    }, [debouncedFilter]);

    // handle local input change
    const handleLocalChange = (column, value) => {
        setLocalInputs((prev) => ({ ...prev, [column]: value })); // update input immediately
        debouncedFilter(column, value); // debounce filtering
    };

    return (
        <table className="search-row">
            <thead>
                <tr>
                {fieldDefs.map(({ label, key, options, searchable }) => {
                    if (!searchable) return null;

                    return (
                    <th key={key}>
                        <div>{label}</div>

                        {options ? (
                            <select
                                className="form-select form-select-sm mt-1"
                                value={localInputs[key] || ""}
                                onChange={(e) => handleLocalChange(key, e.target.value)}
                            >
                                <option value="">All</option>
                                {options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Search"
                                value={localInputs[key] || ""}
                                onChange={(e) => handleLocalChange(key, e.target.value)}
                            />
                        )}
                    </th>
                    );
                })}
                </tr>
            </thead>
        </table>
    );
};

export default SearchBars;