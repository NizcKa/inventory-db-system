import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "./index.css";

// item components
import { fieldDefs } from './FieldDefs';
import Table from './components/Table';
import EditItem from './components/EditItem';
import AddItem from './components/AddItem';
import ConfirmModal from './components/ConfirmModal';
import SearchBars from "./components/SearchBars";


const App = () => {
	const [inventory, setInventory] = useState([]); // holds the inventory table
	const [selectedItem, setSelectedItem] = useState( null ); //holds the selected row contents
	const [searchFilters, setSearchFilters] = useState({}); // column-based search state

	const [deleteMode, setDeleteMode] = useState(false); // toggle for selection
	const [itemsPendingDelete, setItemsPendingDelete] = useState([]); // array of items pending deletion
	const [sortConfig, setSortConfig] = useState({ //column to be sorted and direction of sorting
  		key: null,       
  		direction: 'asc'  
	});

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
			document.getElementById( "editItemModal" )
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

	// gives the delete popup from the edit form 
	const handleFormDelete = (id) => {
		const itemModal = bootstrap.Modal.getInstance(
			document.getElementById("editItemModal")
		);
		if (itemModal) itemModal.hide();
		promptDelete(id);
	};

	// handles sorting control
	const handleSort = (columnKey) => {
		if (sortConfig.key === columnKey) {
			// asc -> desc -> none
			if (sortConfig.direction === 'asc') {
				setSortConfig({ key: columnKey, direction: 'desc' });
			} else if (sortConfig.direction === 'desc') {
				setSortConfig({ key: null, direction: null }); // back to no sorting
			} else {
				setSortConfig({ key: columnKey, direction: 'asc' });
			}
		} else {
			setSortConfig({ key: columnKey, direction: 'asc' });
		}
	};

	// handles search state for each column in search filters
	const handleSearchChange = (column, value) => {
		setSearchFilters((prev) => ({
			...prev,
			[column]: value
		}));
	};

	// filtered items based on search
	const filteredInventory = inventory.filter(item => {
		return Object.entries(searchFilters).every(([column, value]) => {
			if (!value) return true;

			const cell = item[column];
			if (!cell) return false;

			return cell
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase());
		});
	});

	// sort the inventory based on either date or ascending/descending order
	const sortedInventory = [...filteredInventory].sort((a, b) => {
	if (!sortConfig.key || !sortConfig.direction) return 0; // no sorting

	let aVal = a[sortConfig.key];
	let bVal = b[sortConfig.key];

	// for null values
	if (!aVal) aVal = '';
	if (!bVal) bVal = '';

	// for numeric columns
	if (sortConfig.key === 'Acquisition_Cost') {
		return sortConfig.direction === 'asc'
		? aVal - bVal
		: bVal - aVal;
	}

	// for date columns (yyyy-mm-dd)
	if (sortConfig.key === 'Acquisition_Date') {
		return sortConfig.direction === 'asc'
		? aVal.localeCompare(bVal)
		: bVal.localeCompare(aVal);
	}

	// default string comparison for other text fields
	return sortConfig.direction === 'asc'
		? aVal.toString().localeCompare(bVal.toString())
		: bVal.toString().localeCompare(aVal.toString());
	});

	return (
		<div className="app container d-flex flex-column align-items-center p-3">
			<div className="d-flex flex-wrap justify-content-center mb-3 gap-2 w-100">
				<button
					className="btn btn-success"
					data-bs-toggle="modal"
					data-bs-target="#addItemModal"
				>
					Add Item
				</button>

				<button
					className={`btn ${deleteMode ? "btn-secondary" : "btn-danger"}`}
					onClick={ handleToggleDeleteMode }
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
					onConfirm={ handleDelete }
					message={`Are you sure you want to delete ${itemsPendingDelete.length} item(s)?`}
				/>

				<SearchBars
					fieldDefs={fieldDefs}
					searchFilters={searchFilters}
					onSearchChange={handleSearchChange}
				/>
			</div>
			
			<div className="d-flex flex-wrap justify-content-center mb-3 gap-2 w-100">
				<Table 
					items = { sortedInventory } //passes the sorted inventory onto the table
					selectedItem = { selectedItem } 
					setSelectedItem = { setSelectedItem } 
					onEdit = { handleEdit }
					deleteMode={ deleteMode }
					selectedForDelete={ itemsPendingDelete }
					onToggleSelect={ handleToggleSelect }
					onSort={ handleSort }      // tells the table how to sort when header clicked
					sortConfig={ sortConfig }  // tells the table which arrow to display
				/>

				<EditItem
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
		</div>
	);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);