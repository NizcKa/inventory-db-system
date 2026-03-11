import React, { useState, useEffect } from 'react';
import * as bootstrap from "bootstrap";

const ItemModal = ( { modalItem, setInventory }) => {

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if ( modalItem ) {
      setFormData(modalItem); // fill form with modalItem data
    }
  }, [modalItem]);

  const handleChange = ( e ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

   const handleSave = async () => {
    try {
      await window.electron.updateItem(formData);
      console.log("Item updated successfully!");

      // refresh table in parent
      const updatedInventory = await window.electron.getAllItems();
      setInventory(updatedInventory);

    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  if ( !modalItem ) return null;

  // fields to render
  const fieldDefs = [
    { label: "Description", key: "Property_Description" },
    { label: "Brand", key: "Brand" },
    { label: "Property Number", key: "Property_Number" },
    { 
      label: "Type", 
      key: "Type", 
      options: ["ICT EQUIPMENT", "OFFICE EQUIPMENT"]  // dropdown options
    },
    { label: "Acquisition Date", key: "Acquisition_Date", type: "date" },
    { label: "Cost", key: "Acquisition_Cost", type: "number" },
    { label: "Memorandum", key: "Memorandum_Receipt" },
    { label: "District", key: "District" },
    { label: "Location", key: "Equipment_Location" },
  ];

  return (
    <div className="modal fade" id="itemModal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Edit Item</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body">
            {fieldDefs.map(({ label, key, type, options }) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{label}</label>

                {options ? ( 
                    <select // dropdown input fields
                    className="form-select"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    >
                    <option value="" disabled hidden>
                        Select {label}
                    </option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                    </select>
                ) : (
                  <input //text/date input fields
                    type={type || "text"}
                    className="form-control"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                  />
                )}

              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItemModal;