import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ token, setToken, searchQuery, categoryFilter, priceFilter }) {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  
  // New Event State
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  
  // Footer Modal State
  const [footerModal, setFooterModal] = useState({ show: false, title: '', content: '' });

  const navigate = useNavigate();
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
        const eventsWithPrice = data.map((ev, i) => ({
           ...ev,
           isFree: i % 2 !== 0
        }));
        setEvents(eventsWithPrice);
      } else {
        throw new Error("API not available");
      }
    } catch (err) {
      console.warn("Backend unavailable, loading Demo Mode data...");
        const demoData = [
        { id: 1, title: "Neon Nights Synthwave Concert", description: "Experience the ultimate retro-futuristic music festival.", location: "Downtown Arena", date: new Date(Date.now() + 86400000 * 2).toISOString(), isFree: false },
        { id: 2, title: "Tech Innovators Summit 2026", description: "Join industry leaders to discuss AI and Web3.", location: "Grand Convention Center", date: "2026-07-04T18:00:00Z", isFree: true },
        { id: 3, title: "Urban Marathon & Food Festival", description: "A 10k marathon followed by a food truck festival.", location: "City Park Plaza", date: "2026-07-05T08:00:00Z", isFree: false },
        { id: 4, title: "React.js Advanced Workshop", description: "A deep dive into advanced React patterns.", location: "TechHub Co-working Space", date: new Date(Date.now() + 86400000 * 1).toISOString(), isFree: true },
        { id: 5, title: "Midnight Comedy Special", description: "Get ready for a night of non-stop laughs.", location: "The Laughing Lounge", date: "2026-07-11T22:00:00Z", isFree: false },
        { id: 6, title: "Sunset Rooftop Yoga", description: "Relax and unwind with a guided Vinyasa flow.", location: "Skyline Hotel Rooftop", date: new Date(Date.now() + 86400000 * 4).toISOString(), isFree: true }
      ];
      setEvents(demoData);
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

  // Filter States
  const [shortcutFilter, setShortcutFilter] = useState('All');

  const getRelevantImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes('neon nights')) {
      return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop";
    }
    if (t.includes('tech innovators')) {
      return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop";
    }
    if (t.includes('music') || t.includes('concert') || t.includes('synthwave')) {
      return "https://images.unsplash.com/photo-1540039155732-6761b54cb11a?q=80&w=600&auto=format&fit=crop";
    }
    if (t.includes('tech') || t.includes('react') || t.includes('code')) {
      return "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop";
    }
    if (t.includes('sports') || t.includes('marathon') || t.includes('run')) {
      return "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=600&auto=format&fit=crop";
    }
    if (t.includes('yoga') || t.includes('sunset')) {
      return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop";
    }
    if (t.includes('comedy') || t.includes('laugh')) {
      return "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=600&auto=format&fit=crop";
    }
    return `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop`;
  };

  const filteredEvents = events.filter(ev => {
    const searchLower = (searchQuery || '').toLowerCase();
    const matchesSearch = ev.title.toLowerCase().includes(searchLower) || 
                          ev.description.toLowerCase().includes(searchLower) ||
                          ev.location.toLowerCase().includes(searchLower);
    
    let matchesCategory = true;
    if (categoryFilter === 'Music') {
      matchesCategory = ev.title.toLowerCase().includes('concert') || ev.title.toLowerCase().includes('music') || ev.title.toLowerCase().includes('synthwave');
    } else if (categoryFilter === 'Tech') {
      matchesCategory = ev.title.toLowerCase().includes('tech') || ev.title.toLowerCase().includes('react') || ev.title.toLowerCase().includes('summit');
    } else if (categoryFilter === 'Sports') {
      matchesCategory = ev.title.toLowerCase().includes('marathon') || ev.title.toLowerCase().includes('yoga') || ev.title.toLowerCase().includes('fitness');
    }

    let matchesPrice = true;
    if (priceFilter === 'Free') {
      matchesPrice = ev.isFree;
    } else if (priceFilter === 'Paid') {
      matchesPrice = !ev.isFree;
    }
    
    let matchesShortcut = true;
    if (shortcutFilter === 'Trending') {
      matchesShortcut = ev.title.toLowerCase().includes('concert') || ev.title.toLowerCase().includes('summit') || ev.title.toLowerCase().includes('comedy');
    } else if (shortcutFilter === 'Weekend') {
      const eventDate = new Date(ev.date);
      // getDay() returns 0 for Sunday and 6 for Saturday
      matchesShortcut = eventDate.getDay() === 0 || eventDate.getDay() === 6;
    } else if (shortcutFilter === 'Near') {
      matchesShortcut = ev.location.toLowerCase().includes('downtown') || ev.location.toLowerCase().includes('plaza');
    } else if (shortcutFilter === 'Free') {
      matchesShortcut = ev.isFree === true;
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesShortcut;
  });

  const openFooterModal = (title) => {
    setFooterModal({
      show: true,
      title: title,
      content: `Welcome to the ${title} page! This feature will be fully rolling out in the upcoming version 2.1 update. Stay tuned for an incredible experience.`
    });
  };

  return (
    <>
      <div className="hero">
        <div className="hero-shape"></div>
        <div className="hero-content">
          <h1>Discover Amazing Local Events</h1>
          <p>Book tickets, attend exclusive gatherings, and connect with your community. Experience the best moments.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-white" onClick={() => window.scrollTo(0, 400)}>Explore Events</button>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }} onClick={() => setShowCreate(true)}>Host an Event</button>
          </div>
        </div>
      </div>
      
      {/* Shortcut Buttons Container */}
      <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
         <button 
           onClick={() => setShortcutFilter(shortcutFilter === 'Trending' ? 'All' : 'Trending')}
           className={`btn ${shortcutFilter === 'Trending' ? 'btn-primary' : 'btn-outline'}`} 
           style={{ borderRadius: '99px', fontSize: '0.9rem', padding: '8px 20px', borderColor: shortcutFilter === 'Trending' ? 'transparent' : 'var(--border)', color: shortcutFilter === 'Trending' ? 'white' : 'var(--text)' }}>
           🔥 Trending Now
         </button>
         <button 
           onClick={() => setShortcutFilter(shortcutFilter === 'Weekend' ? 'All' : 'Weekend')}
           className={`btn ${shortcutFilter === 'Weekend' ? 'btn-primary' : 'btn-outline'}`} 
           style={{ borderRadius: '99px', fontSize: '0.9rem', padding: '8px 20px', borderColor: shortcutFilter === 'Weekend' ? 'transparent' : 'var(--border)', color: shortcutFilter === 'Weekend' ? 'white' : 'var(--text)' }}>
           📅 This Weekend
         </button>
         <button 
           onClick={() => setShortcutFilter(shortcutFilter === 'Near' ? 'All' : 'Near')}
           className={`btn ${shortcutFilter === 'Near' ? 'btn-primary' : 'btn-outline'}`} 
           style={{ borderRadius: '99px', fontSize: '0.9rem', padding: '8px 20px', borderColor: shortcutFilter === 'Near' ? 'transparent' : 'var(--border)', color: shortcutFilter === 'Near' ? 'white' : 'var(--text)' }}>
           📍 Near You
         </button>
         <button 
           onClick={() => setShortcutFilter(shortcutFilter === 'Free' ? 'All' : 'Free')}
           className={`btn ${shortcutFilter === 'Free' ? 'btn-primary' : 'btn-outline'}`} 
           style={{ borderRadius: '99px', fontSize: '0.9rem', padding: '8px 20px', borderColor: shortcutFilter === 'Free' ? 'transparent' : 'var(--border)', color: shortcutFilter === 'Free' ? 'white' : 'var(--text)' }}>
           🎉 Free Events
         </button>
      </div>

      <div className="container shop-layout" style={{ display: 'block' }}>
        {message && (
          <div className="success-message" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 32px' }}>
            {message}
          </div>
        )}

        {showCreate && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2>Host a New Event</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Fill out the details below to publish your event to the community.</p>
              
              <form onSubmit={handleCreateEvent}>
                <div className="form-group">
                  <label>Title</label>
                  <input className="form-control" type="text" required onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows="3" required onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label>Date & Time</label>
                  <input className="form-control" type="datetime-local" required onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input className="form-control" type="text" required onChange={e => setLocation(e.target.value)} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Publish Event</button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                    <img src={getRelevantImage(event.title)} alt={event.title} />
                    <div className="event-badge">{event.isFree ? 'FREE' : '$45.00'}</div>
                  </div>
                  <div className="event-content">
                    <div className="event-date">
                      {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-desc">{event.description}</p>
                    <div className="event-footer">
                      <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {event.location}
                      </div>
                      <button className="btn btn-primary w-full" onClick={() => navigate(`/event/${event.id}`)}>Book Ticket</button>
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
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("Featured Events"); }}>Featured Events</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("Concerts"); }}>Concerts</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("Workshops"); }}>Workshops</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Host</h4>
              <ul>
                <li><a href="#" onClick={e => { e.preventDefault(); setShowCreate(true); }}>Create Event</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("Pricing"); }}>Pricing</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("Host Resources"); }}>Resources</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("About Us"); }}>About Us</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("Careers"); }}>Careers</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); openFooterModal("Contact"); }}>Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 EventFlow Platforms. Built with FastAPI & React.
          </div>
        </div>
      </footer>

      {/* Generic Footer Links Modal */}
      {footerModal.show && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>{footerModal.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', marginTop: '10px' }}>{footerModal.content}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button className="btn btn-primary" onClick={() => setFooterModal({ show: false, title: '', content: '' })}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
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
  width: '500px',
  boxShadow: 'var(--shadow-lg)'
};

export default Dashboard;
