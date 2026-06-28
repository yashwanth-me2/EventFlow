import React, { useState, useEffect } from 'react';

function Dashboard({ token, setToken, searchQuery }) {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  
  // New Event State
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  // Filter State
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('Any');

  const apiUrl = '';

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
        // Add mock price for UI filtering
        const eventsWithPrice = data.map((ev, i) => ({
           ...ev,
           isFree: i % 2 !== 0
        }));
        setEvents(eventsWithPrice);
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

  const handleBookTicket = async (eventId) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Book Ticket Successful! Check Celery logs for background tasks.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(data.detail || 'Book Ticket failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRandomImage = (id) => `https://picsum.photos/seed/${id}/600/400`;

  // Filtering Logic
  const filteredEvents = events.filter(ev => {
    // Search Query
    const searchLower = (searchQuery || '').toLowerCase();
    const matchesSearch = ev.title.toLowerCase().includes(searchLower) || 
                          ev.description.toLowerCase().includes(searchLower) ||
                          ev.location.toLowerCase().includes(searchLower);
    
    // Category Filter (Mock logic based on title)
    let matchesCategory = true;
    if (categoryFilter === 'Music') {
      matchesCategory = ev.title.toLowerCase().includes('concert') || ev.title.toLowerCase().includes('music') || ev.title.toLowerCase().includes('synthwave');
    } else if (categoryFilter === 'Tech') {
      matchesCategory = ev.title.toLowerCase().includes('tech') || ev.title.toLowerCase().includes('react');
    } else if (categoryFilter === 'Sports') {
      matchesCategory = ev.title.toLowerCase().includes('marathon') || ev.title.toLowerCase().includes('yoga');
    }

    // Price Filter
    let matchesPrice = true;
    if (priceFilter === 'Free') {
      matchesPrice = ev.isFree;
    } else if (priceFilter === 'Paid') {
      matchesPrice = !ev.isFree;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      <div className="hero">
        <div className="hero-shape"></div>
        <div className="hero-content">
          <h1>Discover Amazing Local Events</h1>
          <p>Book tickets, attend exclusive gatherings, and connect with your community. Experience the best moments.</p>
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
              <label className="filter-label">
                <input type="radio" name="cat" checked={categoryFilter === 'All'} onChange={() => setCategoryFilter('All')} /> All Events
              </label>
              <label className="filter-label">
                <input type="radio" name="cat" checked={categoryFilter === 'Music'} onChange={() => setCategoryFilter('Music')} /> Music & Concerts
              </label>
              <label className="filter-label">
                <input type="radio" name="cat" checked={categoryFilter === 'Tech'} onChange={() => setCategoryFilter('Tech')} /> Tech Workshops
              </label>
              <label className="filter-label">
                <input type="radio" name="cat" checked={categoryFilter === 'Sports'} onChange={() => setCategoryFilter('Sports')} /> Sports & Fitness
              </label>
            </div>
          </div>
          
          <div className="sidebar-widget">
            <h3>Price Range</h3>
            <div className="filter-group">
              <label className="filter-label">
                <input type="radio" name="price" checked={priceFilter === 'Any'} onChange={() => setPriceFilter('Any')} /> Any Price
              </label>
              <label className="filter-label">
                <input type="radio" name="price" checked={priceFilter === 'Free'} onChange={() => setPriceFilter('Free')} /> Free (Book Ticket)
              </label>
              <label className="filter-label">
                <input type="radio" name="price" checked={priceFilter === 'Paid'} onChange={() => setPriceFilter('Paid')} /> Under $50
              </label>
            </div>
          </div>
        </aside>

        <section className="event-grid">
          {filteredEvents.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>No events match your criteria.</h3>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const d = new Date(event.date);
              
              return (
                <div className="event-card" key={event.id}>
                  <div className="event-image">
                    <img src={getRandomImage(event.id)} alt={event.title} />
                    <div className="event-badge">{event.isFree ? 'FREE' : '$45.00'}</div>
                  </div>
                  <div className="event-content">
                    <div className="event-date">
                      {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-desc">{event.description}</p>
                    <div className="event-footer">
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>📍 {event.location}</div>
                      <button className="btn btn-primary" onClick={() => handleBookTicket(event.id)}>Book Ticket</button>
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
                <li><a href="#" onClick={e => e.preventDefault()}>Featured Events</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Concerts</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Workshops</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Host</h4>
              <ul>
                <li><a href="#" onClick={e => e.preventDefault()}>Create Event</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Pricing</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Resources</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#" onClick={e => e.preventDefault()}>About Us</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Careers</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Contact</a></li>
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
