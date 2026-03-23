// modal popup for adding a new item
import React, { useState } from 'react';
import DynamicForm from './DynamicForm';
import validateFormData from './validation/FormValidation';

const AddItem = ({ inventory, setInventory, fieldDefs, onAdd}) => { 
    //type, description, brand, proprty no., acquisition date, cost, memorandum, district, location
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);

	// after submit behaviour
	const handleSubmitClick = async ( e ) => {
		e.preventDefault();

		const errors = validateFormData(formData, fieldDefs);
		if (Object.keys(errors).length > 0) { 
			setFormData(prev => {
				const updated = { ...prev };
				Object.keys(errors).forEach(key => {
					updated[`${key}_invalid`] = true;
				});
				return updated;
			});

			setMessage("Please fix validation errors before submitting.");
			setIsError(true);
			return;
		}

		try {
			await onAdd(formData, setFormData); 

			setMessage("Item Added Successfully!");
		    setIsError(false);
			setFormData({});
			setTimeout( () => setMessage(""), 2500 );
		} catch ( err ) {
			console.error(err);
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
						<form onSubmit={handleSubmitClick}>

							<DynamicForm 
								formData={formData} 
								setFormData={setFormData} 
								fieldDefs={fieldDefs} 
							/>

							{message && (
								<p className={`text-center mt-2 ${isError ? "text-danger" : "text-success"}`}>
									{message}
								</p>
							)}

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