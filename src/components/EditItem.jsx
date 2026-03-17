// modal popup for editing selected item and saving changes
import React, { useState, useEffect } from 'react';
import DynamicForm from './DynamicForm';

const EditItem = ({ modalItem, setInventory, fieldDefs, onDelete, onSave }) => { // mostly done (just needs cleanup)
	const [formData, setFormData] = useState({});
	const [message, setMessage] = useState("");
	const [originalData, setOriginalData] = useState({});

	useEffect(() => {
		if ( modalItem ) {
			setFormData({ ...modalItem }); // fill form with modalItem data
			setOriginalData({ ...modalItem }); // form baseline before and after edits
		} else {
			setFormData({});
			setOriginalData({});
		}
		setMessage(""); 
	}, [modalItem]);

	// after save behaviour
	const handleSaveClick = async () => {
		try {
			await onSave(formData, setFormData); 

			setOriginalData({ ...formData });
			setMessage("Item Saved Successfully!");

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

					{message && (<p className="text-success text-center mb-2">{message}</p>)}

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