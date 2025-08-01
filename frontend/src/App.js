import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Notes from './components/Notes';
import AdminDashboard from './components/AdminDashboard';
import './styles/main.css';
import {jwtDecode} from 'jwt-decode'; // <-- Add this import

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Decode token and set user from storage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={user ? <Notes /> : <Navigate to="/login" />}/>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/admin" element={user?.isAdmin ? <AdminDashboard user={user}/> : <Navigate to="/login"/> } />
      </Routes>
    </BrowserRouter>
  );
}