// modal popup for editing selected item and saving changes
import React, { useState, useEffect } from 'react';
import DynamicForm from './DynamicForm';
import validateFormData from './validation/FormValidation';

const EditItem = ({ modalItem, fieldDefs, onDelete, onSave }) => { // mostly done (just needs cleanup)
	const [formData, setFormData] = useState({});
	const [message, setMessage] = useState("");
	const [originalData, setOriginalData] = useState({});
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (modalItem) {
			const initializedData = { ...modalItem };

			fieldDefs.forEach(field => { // intitialize date for editing
				if (field.type === "date" && field.partialDate) {
					const value = modalItem[field.key] || "";

					// detect partial date (not full YYYY-MM-DD)
					const isPartial = value && !/^\d{4}-\d{2}-\d{2}$/.test(value);

					initializedData[`${field.key}_partial`] = isPartial;
					initializedData[`${field.key}_invalid`] = false;
				}
			});

			setFormData(initializedData);
			setOriginalData(initializedData);
		} else {
			setFormData({});
			setOriginalData({});
		}
		setMessage(""); 
	}, [modalItem]);

	// after save behaviour
	const handleSaveClick = async () => {
		const errors = validateFormData(formData, fieldDefs);
		if (Object.keys(errors).length > 0) { 

			setFormData(prev => {
				const updated = { ...prev };
				Object.keys(errors).forEach(key => {
					updated[`${key}_invalid`] = true;
				});
				return updated;
			});
			setIsError(true);
			setMessage("Please fix errors before saving.");
			return;
		}

		try {
			await onSave(formData, setOriginalData); 

			setOriginalData({ ...formData });
			setMessage("Item Saved Successfully!");
		    setIsError(false);
			setTimeout(() => setMessage(""), 2500);
		} catch (err) {
			console.error(err);
		}
	};

	//check if form data changed (duh)
	const isFormChanged = Object.keys(formData).some(key => {
		const formVal = formData[key];
		const origVal = originalData[key];

		// compare strings case-insensitively
		if (typeof formVal === "string" && typeof origVal === "string") {
			return formVal.toUpperCase() !== origVal.toUpperCase();
		}

		// compare non-strings normally
		return formVal !== origVal;
	});

	if ( !modalItem ) return null;

	return (
		<div className="modal fade" id="editItemModal" tabIndex="-1">
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
						<DynamicForm formData={formData} setFormData={setFormData} fieldDefs={fieldDefs} />
					</div>

					{message && (
						<p className={`text-center mt-2 ${isError ? "text-danger" : "text-success"}`}>
							{message}
						</p>
					)}

					<div className="modal-footer">
						<button
							className="btn btn-outline-danger"
							onClick={() => onDelete(modalItem.Index_ID)}
						>
							Delete Record
						</button>

						<button className="btn btn-secondary" data-bs-dismiss="modal">
							Cancel
						</button>

						<button className="btn btn-primary" onClick={handleSaveClick} disabled={!isFormChanged}>
							Save Changes
						</button>
					</div>

				</div>
			</div>
		</div>
	);
};

export default EditItem;