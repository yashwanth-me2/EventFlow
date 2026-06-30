import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EventDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const apiUrl = '';

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/events/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const ev = data.find(e => e.id.toString() === id);
        if (ev) {
          setEvent({ ...ev, isFree: parseInt(id) % 2 !== 0 });
        }
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
      setEvent(demoData.find(e => e.id.toString() === id) || demoData[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/events/${id}/rsvp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage('Ticket Booked Successfully! A confirmation email is being sent to your inbox.');
        setTimeout(() => navigate('/dashboard'), 4000);
      } else {
        const data = await res.json();
        setMessage(data.detail || 'Booking failed');
      }
    } catch (err) {
      setMessage('Demo Mode: Ticket successfully booked! (Simulated). Redirecting to Dashboard...');
      setTimeout(() => navigate('/dashboard'), 4000);
    }
  };

  const getRelevantImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes('neon nights')) {
      return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop";
    }
    if (t.includes('tech innovators')) {
      return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop";
    }
    if (t.includes('music') || t.includes('concert') || t.includes('synthwave')) {
      return "https://images.unsplash.com/photo-1540039155732-6761b54cb11a?q=80&w=1200&auto=format&fit=crop";
    }
    if (t.includes('tech') || t.includes('react') || t.includes('code')) {
      return "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop";
    }
    if (t.includes('sports') || t.includes('marathon') || t.includes('run')) {
      return "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop";
    }
    if (t.includes('yoga') || t.includes('sunset')) {
      return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop";
    }
    if (t.includes('comedy') || t.includes('laugh')) {
      return "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1200&auto=format&fit=crop";
    }
    return `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop`;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Loading event details...</h2>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Event not found.</h2>
        <button className="btn btn-outline mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const d = new Date(event.date);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1000px' }}>
      
      <button 
        className="btn btn-white mb-4" 
        onClick={() => navigate('/dashboard')}
        style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Dashboard
      </button>

      {message && (
        <div className="success-message" style={{ textAlign: 'center', marginBottom: '24px' }}>
          {message}
        </div>
      )}

      <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        
        {/* Massive Cover Image */}
        <div style={{ height: '400px', width: '100%', position: 'relative' }}>
          <img 
            src={getRelevantImage(event.title)} 
            alt={event.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '99px', fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {event.isFree ? 'FREE ENTRY' : '$45.00'}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '48px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
          
          <div>
            <div style={{ color: '#10B981', fontWeight: '700', fontSize: '1.1rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <h1 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '24px' }}>{event.title}</h1>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>About this event</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '32px' }}>
              {event.description}
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              Join us for an unforgettable experience! This event is designed to bring the community together and offer world-class entertainment and learning. Space is strictly limited, so be sure to secure your ticket early.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--surface-alt)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.3rem' }}>Event Details</h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ color: 'var(--primary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Date & Time</strong>
                <span style={{ color: 'var(--text-muted)' }}>{d.toLocaleDateString()} at {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <div style={{ color: 'var(--primary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Location</strong>
                <span style={{ color: 'var(--text-muted)' }}>{event.location}</span>
                <div style={{ marginTop: '12px', width: '100%', height: '120px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', border: '1px dashed #94a3b8' }}>
                  [ Map Placeholder ]
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '32px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total Price:</span>
              <span>{event.isFree ? '$0.00' : '$45.00'}</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', fontSize: '1.1rem', padding: '16px 0', borderRadius: '12px' }}
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </button>
            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No hidden fees. Secure transaction.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EventDetails;
