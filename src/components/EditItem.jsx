// modal popup for editing selected item
import React, { useState, useEffect } from 'react';
import DynamicForm from './DynamicForm';

const EditItem = ({ modalItem, setInventory, fieldDefs, onDelete }) => { // mostly done (just needs cleanup)
	const [formData, setFormData] = useState({});
	const [message, setMessage] = useState("");
	const [originalData, setOriginalData] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);

	useEffect(() => {
		if ( modalItem ) {
			setFormData({ ...modalItem }); // fill form with modalItem data
			setOriginalData({ ...modalItem }); // form baseline before and after edits
		} else {
			setFormData({});
			setOriginalData({});
		}
		setMessage(""); 
		setConfirmDelete(false);
	}, [modalItem]);

	const handleSave = async () => {
		try {
			await globalThis.electron.updateItem( formData );
			const updatedInventory = await globalThis.electron.getAllItems();
			setInventory(updatedInventory);

			setOriginalData({ ...formData }); // form baseline updated after save
			setMessage("Item Saved Succesfully!");
			setTimeout(() => setMessage(""), 2500);
		} catch (err) {
			console.error("Failed to update item:", err);
		}
	};

	//check if form data changed (duh)
	const isFormChanged = Object.keys(formData).some(
		key => formData[key] !== originalData[key]
	); 

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
						{confirmDelete ? (
							<>
								<span className="text-danger me-2">
									Confirm delete?
								</span>

								<button
									className="btn btn-danger"
									onClick={() => onDelete(modalItem.Index_ID)}
								>
									Yes Delete
								</button>

								<button
									className="btn btn-secondary"
									onClick={() => setConfirmDelete(false)}
								>
									Cancel
								</button>
							</>
						) : (
							<button
								className="btn btn-outline-danger"
								onClick={() => onDelete(modalItem.Index_ID)}
							>
								Delete Record
							</button>
						)}

						<button className="btn btn-secondary" data-bs-dismiss="modal">
							Cancel
						</button>

						<button className="btn btn-primary" onClick={handleSave} disabled={!isFormChanged}>
							Save Changes
						</button>
					</div>

				</div>
			</div>
		</div>
	);
};

export default EditItem;