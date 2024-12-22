import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Navigation from './components/Navigation';
import Staff from './components/Staff';
import Employee from './components/Employee';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigation />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/staff' element={<Staff />} />
          <Route path='/employee' element={<Employee />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
