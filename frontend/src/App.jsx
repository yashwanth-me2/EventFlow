import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

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
            <input type="text" placeholder="Search for events, categories, or hosts..." />
          </div>

          <div className="navbar-actions">
            {!token ? (
               <a href="/" className="btn btn-primary">Sign In</a>
            ) : (
               <>
                 <a href="/dashboard" className="btn btn-outline">My Tickets</a>
                 <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      setToken(null);
                    }} 
                    className="btn btn-secondary">
                    Log Out
                 </button>
               </>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            !token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />
          } />
          <Route path="/dashboard" element={
            token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/" />
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
