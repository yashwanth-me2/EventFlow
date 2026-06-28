import React, { useState, useEffect } from 'react';

function Dashboard({ token, setToken }) {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  
  // New Event State
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0); // Added mock price for UI

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/events/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/v1/events/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title, description, date: new Date(date).toISOString(), location
        })
      });
      if (res.ok) {
        setShowCreate(false);
        fetchEvents();
        setMessage('Event created successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('RSVP Successful! Check Celery logs for background tasks.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(data.detail || 'RSVP failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRandomImage = (id) => `https://picsum.photos/seed/${id}/600/400`;

  return (
    <>
      <div className="hero">
        <div className="hero-shape"></div>
        <div className="hero-content">
          <h1>Discover Amazing Local Events</h1>
          <p>Book tickets, RSVP to exclusive gatherings, and connect with your community. Experience the best moments.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-white" onClick={() => window.scrollTo(0, 500)}>Explore Events</button>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }} onClick={() => setShowCreate(!showCreate)}>Host an Event</button>
          </div>
        </div>
      </div>

      <div className="container shop-layout">
        <aside className="sidebar">
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {showCreate && (
            <div className="sidebar-widget">
              <h3>Create Event</h3>
              <form onSubmit={handleCreateEvent}>
                <div className="form-group">
                  <label>Title</label>
                  <input className="form-control" type="text" required onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input className="form-control" type="text" required onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Date & Time</label>
                  <input className="form-control" type="datetime-local" required onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input className="form-control" type="text" required onChange={e => setLocation(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-full">Create</button>
              </form>
            </div>
          )}

          <div className="sidebar-widget">
            <h3>Categories</h3>
            <div className="filter-group">
              <label className="filter-label"><input type="checkbox" defaultChecked /> All Events</label>
              <label className="filter-label"><input type="checkbox" /> Music & Concerts</label>
              <label className="filter-label"><input type="checkbox" /> Tech Workshops</label>
              <label className="filter-label"><input type="checkbox" /> Sports & Fitness</label>
            </div>
          </div>
          
          <div className="sidebar-widget">
            <h3>Price Range</h3>
            <div className="filter-group">
              <label className="filter-label"><input type="checkbox" defaultChecked /> Any Price</label>
              <label className="filter-label"><input type="checkbox" /> Free (RSVP)</label>
              <label className="filter-label"><input type="checkbox" /> Under $50</label>
            </div>
          </div>
        </aside>

        <section className="event-grid">
          {events.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>No events found. Be the first to host one!</h3>
            </div>
          ) : (
            events.map((event, idx) => {
              const d = new Date(event.date);
              const isFree = idx % 2 !== 0; // Mock price logic for UI variation
              
              return (
                <div className="event-card" key={event.id}>
                  <div className="event-image">
                    <img src={getRandomImage(event.id)} alt={event.title} />
                    <div className="event-badge">{isFree ? 'FREE' : '$45.00'}</div>
                  </div>
                  <div className="event-content">
                    <div className="event-date">
                      {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-desc">{event.description}</p>
                    <div className="event-footer">
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>📍 {event.location}</div>
                      <button className="btn btn-primary" onClick={() => handleRSVP(event.id)}>RSVP</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h2>EventFlow</h2>
              <p>The premium destination for finding and hosting incredible local experiences.</p>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><a href="#">Featured Events</a></li>
                <li><a href="#">Concerts</a></li>
                <li><a href="#">Workshops</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Host</h4>
              <ul>
                <li><a href="#">Create Event</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Resources</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 EventFlow Platforms. Built with FastAPI & React.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Dashboard;
