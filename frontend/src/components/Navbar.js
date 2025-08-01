import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };
  return (
    <div className="app-bar">
      <Link to="/">NotesApp</Link>
      {
        user
          ? (
            <span>
              Hello, {user.username}
              {/* Admin link shown only if user.isAdmin */}
              {user?.isAdmin && (
                <Link to="/admin" style={{ marginLeft: 12, color: "#e5ecff" }}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} style={{ marginLeft: 12 }}>Logout</button>
            </span>
          )
          : (<>
            <Link to="/login">Login</Link>
            <Link style={{ marginLeft: 10 }} to="/register">Register</Link>
          </>)
      }
    </div>
  )
}

