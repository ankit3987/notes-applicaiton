import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', password: '', isAdmin: false });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (e) { setError('No admin rights or fetch error.'); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (user.id === id) return alert("Admin cannot delete themselves.");
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users', form);
      setForm({ username: '', email: '', password: '', isAdmin: false });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding user');
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 700 }}>
      <h2>Admin Dashboard</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input type="text" required placeholder="Username"
          value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} />
        <input type="email" required placeholder="Email"
          value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        <input type="password" required placeholder="Password" minLength={6}
          value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
        <label style={{fontSize: 13, margin:'4px 0'}}></label>
        <button>Add User</button>
      </form>
      <h4>All Users</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{background:"#e5f1fc"}}>
            <th style={{padding:7}}>Username</th>
            <th style={{padding:7}}>Email</th>
            <th style={{padding:7}}>Admin</th>
            <th style={{padding:7}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{borderBottom:"1px solid #e1f0f8"}}>
              <td style={{padding:6}}>{u.username}</td>
              <td style={{padding:6}}>{u.email}</td>
              <td style={{padding:6}}>{u.isAdmin?'Yes':'No'}</td>
              <td style={{padding:6}}>
                {u._id !== user.id &&
                  <button
                    className="delete-btn"
                    style={{margin:0, padding:".3rem 1.2rem"}} 
                    onClick={()=>window.confirm("Are you sure?")&&handleDelete(u._id)}
                  >Delete</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
