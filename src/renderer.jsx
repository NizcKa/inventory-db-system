import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

// item components
import { fieldDefs } from './FieldDefs';
import Table from './components/Table';
import EditItem from './components/EditItem';
import AddItem from './components/AddItem';


const App = () => {
	const [inventory, setInventory] = useState([]); // holds the inventory table
	const [selectedItem, setSelectedItem] = useState( null ); //holds the selected row contents
	const [searchQuery, setSearchQuery] = useState(""); // search state

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
		<>

		<div className="d-flex justify-content-between align-items-center mb-2">
		<button
			className="btn btn-success"
			data-bs-toggle="modal"
			data-bs-target="#addItemModal"
		>
			Add Item
		</button>

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
		/>

		<EditItem 
			modalItem = { selectedItem }
			setInventory = { setInventory }
			fieldDefs = { fieldDefs }
		/>

		<AddItem
			inventory = { inventory }
			setInventory = { setInventory }
			fieldDefs = { fieldDefs }
		/>

		</>
	);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);