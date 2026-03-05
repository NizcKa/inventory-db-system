import react, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client';
import Profile from './components/Profile';
import Table from './components/Table';

import "bootstrap/dist/css/bootstrap.min.css"

const App = () =>{
  const [items, setItems] = useState([]);

  useEffect(() => { // loads the table into items 
    window.electron.getAllItems()
      .then(setItems)
      .catch(err => console.error('Failed to fetch items:', err));
  }, []);


  return (
    <>
    <Profile></Profile>
    <Table items={items}></Table>
    <h1> test 2 </h1>
    </>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);