import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'Light Mode');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (theme === 'Dark Mode') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            EventFlow
          </div>
          
          <div className="navbar-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search for events, locations, or descriptions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="navbar-actions">
            {!token ? (
               <a href="/" className="btn btn-primary">Sign In</a>
            ) : (
               <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                 <button onClick={() => setShowSettings(true)} className="btn btn-outline" style={{ borderRadius: '50%', padding: '10px' }} title="Profile Settings">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </button>
                 <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      setToken(null);
                    }} 
                    className="btn btn-secondary">
                    Log Out
                 </button>
               </div>
            )}
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Profile & Settings</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Manage your account preferences here.</p>
            
            <div className="form-group">
              <label>Theme Preference</label>
              <select className="form-control" value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option>Light Mode</option>
                <option>Dark Mode</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Email Notifications</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', color: 'var(--text)' }}>
                <input type="checkbox" defaultChecked /> Receive event reminders
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
              <button className="btn btn-outline" onClick={() => setShowSettings(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => {
                setShowSettings(false);
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            !token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />
          } />
          <Route path="/dashboard" element={
            token ? <Dashboard token={token} setToken={setToken} searchQuery={searchQuery} /> : <Navigate to="/" />
          } />
        </Routes>
      </main>
    </div>
  )
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: 'var(--surface)',
  color: 'var(--text)',
  padding: '30px',
  borderRadius: '16px',
  width: '400px',
  boxShadow: 'var(--shadow-lg)'
};

export default App
