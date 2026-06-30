import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import EventDetails from './components/EventDetails'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'Light Mode');
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('Any');
  const [showFilters, setShowFilters] = useState(false);
  
  // New States
  const [showDrawer, setShowDrawer] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === 'Dark Mode') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close menus if clicked outside
  useEffect(() => {
    const handleClick = () => {
      setShowProfileMenu(false);
      setShowFilters(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="app-container">
      {/* Left Drawer (Hamburger Menu) */}
      {showDrawer && (
        <div className="sidebar-overlay" onClick={() => setShowDrawer(false)}></div>
      )}
      <div className={`left-drawer ${showDrawer ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2>Menu</h2>
          <button onClick={() => setShowDrawer(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            Theme Preference
          </label>
          <select className="form-control" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option>Light Mode</option>
            <option>Dark Mode</option>
          </select>
        </div>
        
        <div className="dropdown-divider" style={{ margin: '24px 0' }}></div>
        
        <button className="dropdown-item" onClick={() => { setShowDrawer(false); navigate('/dashboard'); }} style={{ padding: '16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Dashboard
        </button>
        <button className="dropdown-item" onClick={() => { setShowDrawer(false); setShowSettings(true); }} style={{ padding: '16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Global Settings
        </button>
        <button className="dropdown-item" onClick={() => { setShowDrawer(false); setShowAbout(true); }} style={{ padding: '16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          About EventFlow
        </button>
      </div>

      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%', padding: '0 40px' }}>
          {/* Left Side: Hamburger + Logo */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
            {token && (
              <button onClick={() => setShowDrawer(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
            )}
            <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              EventFlow
            </div>
          </div>
          
          {/* Center: Search (Rendered only on dashboard) */}
          {token && location.pathname === '/dashboard' ? (
             <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
               <div className="navbar-search" style={{ width: '100%', maxWidth: '800px', margin: 0, position: 'relative' }}>
                  
                  {/* The Search Bar Container */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%', 
                    background: 'var(--surface-alt)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '99px', 
                    padding: '4px 16px' 
                  }}>
                    {/* Search Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                    
                    {/* Input Field */}
                    <input 
                      type="text" 
                      placeholder="Search events, locations..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        flex: 1, 
                        background: 'transparent', 
                        border: 'none', 
                        padding: '10px 16px', 
                        outline: 'none', 
                        color: 'var(--text)', 
                        fontSize: '1rem' 
                      }}
                    />
                    
                    {/* Filter Button & Popover Wrapper */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <button 
                        className="filter-icon-btn" 
                        style={{ 
                          background: 'transparent', 
                          border: 'none', 
                          cursor: 'pointer', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px 16px',
                          borderRadius: '8px'
                        }} 
                        title="Filter Events"
                        onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
                      >
                        <svg style={{ pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                      </button>

                      {showFilters && (
                        <div className="filter-popover" onClick={(e) => e.stopPropagation()}>
                          <h3 style={{ marginBottom: '16px' }}>Filters</h3>
                          <div className="form-group">
                            <label>Category</label>
                            <select className="form-control" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                              <option value="All">All Events</option>
                              <option value="Music">Music & Concerts</option>
                              <option value="Tech">Tech Workshops</option>
                              <option value="Sports">Sports & Fitness</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Price</label>
                            <select className="form-control" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                              <option value="Any">Any Price</option>
                              <option value="Free">Free</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
               </div>
             </div>
          ) : (
             <div style={{ flex: 2 }}></div>
          )}

          {/* Right Side: Profile Dropdown */}
          <div className="navbar-actions" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            {!token ? (
               <a href="/" className="btn btn-primary">Sign In</a>
            ) : (
               <div style={{ position: 'relative' }}>
                 <button 
                   onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowFilters(false); }} 
                   className="btn btn-outline" 
                   style={{ borderRadius: '50%', padding: '10px' }} 
                   title="Profile Menu">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </button>
                 
                 {showProfileMenu && (
                   <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                     <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                       <strong>My Account</strong>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>user@example.com</div>
                     </div>
                     <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); setShowSettings(true); }}>Profile Settings</button>
                     <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); alert("Tickets feature coming soon!"); }}>My Tickets</button>
                     <div className="dropdown-divider"></div>
                     <button className="dropdown-item" style={{ color: 'var(--secondary)' }} onClick={() => {
                        localStorage.removeItem('token');
                        setToken(null);
                        setShowProfileMenu(false);
                     }}>Log Out</button>
                   </div>
                 )}
               </div>
            )}
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Profile Settings</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Manage your account preferences here.</p>
            
            <div className="form-group">
              <label>Email Notifications</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', color: 'var(--text)' }}>
                <input type="checkbox" defaultChecked /> Receive event reminders
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
              <button className="btn btn-outline" onClick={() => setShowSettings(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => setShowSettings(false)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>About EventFlow</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Version 2.0.0</p>
            <p>EventFlow is the premium destination for finding and hosting incredible local experiences. Built with FastAPI and React.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button className="btn btn-primary" onClick={() => setShowAbout(false)}>Close</button>
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
            token ? <Dashboard token={token} setToken={setToken} searchQuery={searchQuery} categoryFilter={categoryFilter} priceFilter={priceFilter} /> : <Navigate to="/" />
          } />
          <Route path="/event/:id" element={
            token ? <EventDetails token={token} /> : <Navigate to="/" />
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
