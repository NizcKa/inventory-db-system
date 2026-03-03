import react from 'react'
import { createRoot } from 'react-dom/client';
import Profile from './components/Profile';

const App = () =>{
  return (
    <>
    <Profile></Profile>
    <Profile></Profile>
    <h1> test 2 </h1>
    </>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);