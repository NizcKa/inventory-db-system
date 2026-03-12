// Modal popup for editing selected item
import React, { useState, useEffect } from 'react';
import * as bootstrap from "bootstrap";
import DynamicForm from './DynamicForm';

const ItemForm = ({ modalItem, setInventory, fieldDefs }) => { // mostly done (just needs cleanup)
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

	//variable so it updates on every render
	const isFormChanged = Object.keys(formData).some(
		key => formData[key] !== originalData[key]
	); 

	if ( !modalItem ) return null;

	return (
		<div className="modal fade" id="itemFormModal" tabIndex="-1">
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

export default ItemForm;