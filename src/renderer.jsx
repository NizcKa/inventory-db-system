import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

// item components
import Profile from './components/Profile';
import Table from './components/Table';
import ItemModal from './components/ItemModal';

const App = () => {
  const [inventory, setInventory] = useState([]); // holds the inventory table
  const [selectedItem, setSelectedItem] = useState( null ); //holds the selected row contents

  // loads the database table into items 
  useEffect(() => { 
    window.electron.getAllItems()
      .then(setInventory)
      .catch(err => console.error('Failed to fetch inventory:', err));
  }, []);

  // when double clicking the selected item
  const handleEdit = ( item ) => {
    console.log("Editing item: ", item);

    const modal = new bootstrap.Modal(
      document.getElementById( "itemModal" )
    );

    modal.show();  
  }

  return (
    <>
    <Profile/>

    <Table 
      items={ inventory }
      selectedItem = { selectedItem } 
      setSelectedItem = { setSelectedItem } 
      onEdit = { handleEdit }
    />

    <ItemModal 
      modalItem = { selectedItem }
      setInventory={setInventory}
    />

    <h1> test 2 </h1>
    </>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);