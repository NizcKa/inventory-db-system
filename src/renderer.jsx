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

	return (
		<>
		<button
			className="btn btn-success"
			data-bs-toggle="modal"
			data-bs-target="#addItemModal"
		>
			Add Item
		</button>

		<Table 
			items = { inventory }
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