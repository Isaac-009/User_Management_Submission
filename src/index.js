import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom'
import UserForm from './components/UserForm';
import UserView from './components/UserView';
import './styles/Pagination.css'
import './styles/Navbar.css';
import './styles/UserModal.css'
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>  
    <BrowserRouter>
    <nav className="main__navigation">
  <ul>
    <li><NavLink className='nav__link' to="/add">Add</NavLink></li>
    <li><NavLink className='nav__link' to='/view'>View</NavLink></li>
  </ul>
  </nav>
  <Routes>
    <Route path='/' element={<UserForm/>}/>
    <Route path='/add' element={<UserForm/>}/>
    <Route path='/view' element={<UserView/>}/>
  </Routes>

</BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))

