import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "./index.css";

// item components
import { fieldDefs } from './fieldDefs';
import Table from './components/Table';
import EditItem from './components/EditItem';
import AddItem from './components/AddItem';
import SearchBars from "./components/SearchBars";
import DeleteModal from './components/DeleteModal';

import useInventory from "./hooks/useInventory";

import { CSVLink } from "react-csv";

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
	const [showDeleteModal, setShowDeleteModal] = useState(false); // toggle for the delete modal
	const [deleteTargetIds, setDeleteTargetIds] = useState([]); // 

	const { addItem, updateItem, deleteItems } = useInventory(setInventory);

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

	const handleAdd = (formData, setFormData) => addItem(formData, setFormData);

	const handleSave = (formData, setOriginalData) => updateItem(formData, setOriginalData);

	const handleDelete = async (item, confirmed = false) => {
		let ids = itemsPendingDelete;

		if (item !== undefined) { 	//ensures ids are always an array
			ids = Array.isArray(item) ? item : [item];
		}	

		if (!confirmed) { // confirmation check
			// hide edit modal if it's open
			const editModalEl = document.getElementById("editItemModal");
			const editModal = bootstrap.Modal.getInstance(editModalEl);
			if (editModal) editModal.hide();

			// store targets and show delete confirmation modal
			setDeleteTargetIds(ids);
			setShowDeleteModal(true);
			return; 
		}

		await deleteItems(ids);

		// reset state
		setItemsPendingDelete([]);
		setDeleteMode(false);
		setSelectedItem(null);
	};

	// Toggle delete mode
	const handleToggleDeleteMode = () => {
		setDeleteMode((prev) => !prev);
		setItemsPendingDelete([]);
	};

	// toggle a row's selection for deletion
	const handleDeleteSelect = (id) => {
		setItemsPendingDelete(prev =>
			prev.includes(id)
				? prev.filter(i => i !== id) // remove if already selected
				: [...prev, id]             // add if not selected
		);
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
			};
		} else {
			setSortConfig({ key: columnKey, direction: 'asc' });
		};
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
		};

		// for date columns (yyyy-mm-dd)
		if (sortConfig.key === 'Acquisition_Date') {
			return sortConfig.direction === 'asc'
			? aVal.localeCompare(bVal)
			: bVal.localeCompare(aVal);
		};

		// default string comparison for other text fields
		return sortConfig.direction === 'asc'
			? aVal.toString().localeCompare(bVal.toString())
			: bVal.toString().localeCompare(aVal.toString());
	});

	// csv headers from field defs
	const csvHeaders = fieldDefs.map(field => ({
		label: field.label,
		key: field.key
	}));

	// formatting csv data from filteredInventory
	const csvData = filteredInventory.map(item =>
		fieldDefs.reduce((acc, field) => {
			let value = item[field.key];

			if (field.key === "Acquisition_Date" && value) {
				const parts = value.split("-");
				if (parts.length === 3) value = `${parts[1]}-${parts[2]}-${parts[0]}`;  
				else if (parts.length === 2) value = `${parts[1]}-${parts[0]}`;           
				else value = parts[0];                                                     
			}

			if (field.key === "Acquisition_Cost" && value != null || value == 0) {
				value = new Intl.NumberFormat("en-PH", {
					style: "currency",
					currency: "PHP",
					minimumFractionDigits: 2
				}).format(value);
			}

			acc[field.key] = value ?? "N/A";
			return acc;
		}, {})
	);

	return (
		<div className="app container d-flex flex-column align-items-center p-3 pt-3">
			<div className="top-bar sticky-top d-flex flex-column align-items-center w-100 p-2">
				<div className="mb-2">
					<SearchBars
						fieldDefs={fieldDefs}
						searchFilters={searchFilters}
						onSearchChange={handleSearchChange}
					/>
				</div>

				<div className="d-flex flex-wrap gap-2">
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
						className="btn btn-danger"
						onClick={() => handleDelete()}
					>
						Confirm Delete ({itemsPendingDelete.length})
					</button>
					)}

					<CSVLink
						headers={csvHeaders}
						data={csvData}
						filename="inventory.csv"
						className="btn btn-primary"
					>
						Export Current Table as CSV
					</CSVLink>
					
				</div>
			</div>
			
			<div className="d-flex flex-wrap justify-content-center mb-3 gap-2 w-100">
				<Table 
					items = { sortedInventory } //passes the sorted inventory onto the table
					fieldDefs = { fieldDefs }
					selectedItem = { selectedItem } 
					setSelectedItem = { setSelectedItem } 
					onEdit = { handleEdit }
					deleteMode={ deleteMode }
					selectedForDelete={ itemsPendingDelete }
					onToggleSelect={ handleDeleteSelect }
					onSort={ handleSort }      // tells the table how to sort when header clicked
					sortConfig={ sortConfig }  // tells the table which arrow to display
				/>

				<EditItem
					modalItem = { selectedItem }
					setInventory = { setInventory }
					setSelectedItem = { setSelectedItem } 
					fieldDefs = { fieldDefs }
					onDelete={ handleDelete }
					onSave={ handleSave }
				/>

				<AddItem
					inventory = { inventory }
					setInventory = { setInventory }
					fieldDefs = { fieldDefs }
					onAdd = { handleAdd }
				/>

				<DeleteModal
					show={showDeleteModal}
					onClose={() => setShowDeleteModal(false)}
					onConfirm={() => {
						handleDelete(deleteTargetIds, true);
						setShowDeleteModal(false);
					}}
				/>

			</div>
		</div>
	);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);