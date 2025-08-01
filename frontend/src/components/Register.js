import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function Register({ setUser }) {
  const [email, setEmail] = useState(''), [username, setUsername] = useState(''), [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { email, username, password });
      localStorage.setItem('token', res.data.token);
      const decoded = jwtDecode(res.data.token);
      setUser(decoded);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };
  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {error && <div style={{color: 'red'}}>{error}</div>}
        <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required minLength={3} />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}