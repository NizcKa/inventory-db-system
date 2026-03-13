import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

// item components
import { fieldDefs } from './FieldDefs';
import Table from './components/Table';
import ItemForm from './components/ItemForm';
import AddItem from './components/AddItem';
import ConfirmModal from './components/ConfirmModal';


const App = () => {
	const [inventory, setInventory] = useState([]); // holds the inventory table
	const [selectedItem, setSelectedItem] = useState( null ); //holds the selected row contents
	const [searchQuery, setSearchQuery] = useState(""); // search state

	const [deleteMode, setDeleteMode] = useState(false); // toggle for selection
	const [itemsPendingDelete, setItemsPendingDelete] = useState([]); // array of items pending deletion

	// loads the database table into items 
	useEffect(() => { 
		globalThis.electron.getAllItems()
		.then(setInventory)
		.catch(err => console.error('Failed to fetch inventory:', err));
	}, []);

	// when double clicking the selected item
	const handleEdit = ( item ) => {
		console.log("Editing item: ", item);

		const modal = new bootstrap.Modal(
			document.getElementById( "itemFormModal" )
		);

		modal.show();  
	}

	// Toggle delete mode
	const handleToggleDeleteMode = () => {
		setDeleteMode((prev) => !prev);
		setItemsPendingDelete([]);
	};

	// toggle a row's selection for deletion
	const handleToggleSelect = (id) => {
		setItemsPendingDelete((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	// deletes all items pending deletion
	const handleDelete = async () => {
		try {

			for (const id of itemsPendingDelete) {
				await globalThis.electron.deleteItem(id);
			}

			const updatedInventory = await globalThis.electron.getAllItems();
			setInventory(updatedInventory);

			setItemsPendingDelete([]);
			setDeleteMode(false);
			setSelectedItem(null);
			console.log("item deleted");

		} catch (err) {
			console.error("Failed to delete items:", err);
		}
	};

	// triggers the modal
	const promptDelete = (ids) => {
		const targets = Array.isArray(ids) ? ids : [ids]; // ensures that target is always an array

		setItemsPendingDelete(targets);

		const modal = new bootstrap.Modal(
			document.getElementById("confirmDeleteModal")
		);

		modal.show();
	};

	const handleFormDelete = (id) => {

		const itemModal = bootstrap.Modal.getInstance(
			document.getElementById("itemFormModal")
		);

		if (itemModal) itemModal.hide();

		promptDelete(id);

	};

	// filtered items based on search
	const filteredInventory = inventory.filter(item => {
		const query = searchQuery.toLowerCase();
		return (
			item.Index_ID?.toLowerCase().includes(query) ||
			item.Type?.toLowerCase().includes(query) ||
			item.Property_Description?.toLowerCase().includes(query) ||
			item.Brand?.toLowerCase().includes(query) ||
			item.Property_Number?.toLowerCase().includes(query)
		);
	});

	return (
		<div> 
			<div className="d-flex justify-content-between align-items-center mb-2">
				<button
					className="btn btn-success"
					data-bs-toggle="modal"
					data-bs-target="#addItemModal"
				>
					Add Item
				</button>

				<button
					className={`btn ${deleteMode ? "btn-secondary" : "btn-danger"}`}
					onClick={handleToggleDeleteMode}
				>
					{deleteMode ? "Cancel Delete" : "Delete Items"}
				</button>

				{deleteMode && itemsPendingDelete.length > 0 && (
					<button
						className="btn btn-danger ms-2"
						onClick={() => promptDelete(itemsPendingDelete)} // Trigger Bootstrap modal instead of window.confirm
					>
					Confirm Delete ({itemsPendingDelete.length})
					</button>
				)}

				<ConfirmModal
					onConfirm={handleDelete}
					message={`Are you sure you want to delete ${itemsPendingDelete.length} item(s)?`}
				/>

				<input // search bar
					type="text"
					className="form-control w-50"
					placeholder="Search inventory..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			
			<Table 
				items = { filteredInventory }
				selectedItem = { selectedItem } 
				setSelectedItem = { setSelectedItem } 
				onEdit = { handleEdit }
				deleteMode={deleteMode}
				selectedForDelete={itemsPendingDelete}
				onToggleSelect={handleToggleSelect}
			/>

			<ItemForm
				modalItem = { selectedItem }
				setInventory = { setInventory }
				setSelectedItem = { setSelectedItem } 
				fieldDefs = { fieldDefs }
				onDelete={ handleFormDelete }
				
			/>

			<AddItem
				inventory = { inventory }
				setInventory = { setInventory }
				fieldDefs = { fieldDefs }
			/>
		</div>
	);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);