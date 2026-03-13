// modal popup for adding a new item
import React, { useState } from 'react';
import DynamicForm from './DynamicForm';

const AddItem = ({ inventory, setInventory, fieldDefs}) => { // working, no validations yet though
    //type, description, brand, proprty no., acquisition date, cost, memorandum, district, location
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState("");

	const handleSubmit = async ( e ) => {
		e.preventDefault();

		try {
			// convert all string fields in formData to uppercase
			const upperCaseData = Object.fromEntries(
				Object.entries(formData).map(([key, value]) => [
					key,
					typeof value === "string" ? value.toUpperCase() : value
				])
			);

			const itemId =  await globalThis.electron.generateNextItemId(formData.Type);
			const newItem = {
				...upperCaseData,
				Index_ID: itemId
			};

			await globalThis.electron.addItem( newItem );

			// refresh inventory list
			const updatedInventory = await globalThis.electron.getAllItems();
			setInventory( updatedInventory );

			setMessage( "Item Added Successfully!" );
			setFormData({});
			setTimeout( () => setMessage(""), 2500 );

		} catch ( err ) {
			console.error( "Failed to add item:", err );
		}
	};

	return (
		<div className="modal fade" id="addItemModal" tabIndex="-1">
			<div className="modal-dialog modal-lg">
				<div className="modal-content">

					<div className="modal-header">
						<h5 className="modal-title">Add New Item</h5>
						<button type="button" className="btn-close" data-bs-dismiss="modal" />
					</div>

					<div className="modal-body">
						<form onSubmit={handleSubmit}>
						<DynamicForm formData={formData} setFormData={setFormData} fieldDefs={fieldDefs} />

						{message && <p className="text-success text-center mt-2">{message}</p>}

						<div className="modal-footer">
							<button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
							<button 
								type="submit" 
								className="btn btn-primary"
								disabled={!formData.Type || !formData.Property_Description}
							>
								Add Item
							</button>
						</div>
						</form>
					</div>

				</div>
			</div>
		</div>
	);
};

export default AddItem;