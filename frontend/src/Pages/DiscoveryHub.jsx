import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const mockItems = [
  { id: 1, name: "Blue HP Laptop", status: "LOST", category: "electronics", location: "Library 2nd Floor", date: "2026-02-14", type: "lost", image: "/images/Img 1.jpg" },
  { id: 2, name: "iPhone 13", status: "FOUND", category: "electronics", location: "Canteen", date: "2026-02-13", type: "found", image: "/images/Img 2.jpg" },
  { id: 3, name: "APSIT ID Card", status: "LOST", category: "id-cards", location: "Lab 402", date: "2026-02-12", type: "lost", image: "" },
  { id: 4, name: "Blue Umbrella", status: "FOUND", category: "others", location: "Main Gate", date: "2026-02-11", type: "found", image: "" },
  { id: 5, name: "Data Structures Notes", status: "LOST", category: "books", location: "Seminar Hall", date: "2026-02-10", type: "lost", image: "" },
  { id: 6, name: "Calculator", status: "FOUND", category: "electronics", location: "Lab 401", date: "2026-02-09", type: "found", image: "" },
];

const categoryEmoji = {
  electronics: '💻', 'id-cards': '🪪', books: '📚', bags: '🎒',
  accessories: '⌚', keys: '🔑', others: '📦'
};

const DiscoveryHub = ({ isLoggedIn, setIsLoggedIn }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('lost'); // Default to 'lost'

  const filteredItems = mockItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || item.category === category;
    const matchLocation = location === 'all' || item.location === location;
    const matchTab = item.type === activeTab;
    return matchSearch && matchCategory && matchLocation && matchTab;
  });

  return (
    <div className="discovery-theme-root">
      {/* Search Banner */}
      <div className="part-1 anim-fadeScale">
        <h1 className="hub-title">Discovery Hub</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: '24px' }}>Browse lost & found items on campus</p>
        <div className="search-bar-themed">
          <input
            type="text"
            placeholder="🔍 Search items by name, category, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-btn-gradient">Search</button>
        </div>
      </div>

      <div className="container-1">
        {/* Sidebar */}
        <aside className="part-2 anim-slideInLeft">
          <h3 className="filter-title">Filters</h3>

          <div className="filter-group">
            <label className="filter-label" style={{ color: '#a68ada', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Category</label>
            <div className="filter-category-chips" style={{ marginBottom: '24px' }}>
              <button 
                className={`filter-chip ${category === 'all' ? 'active' : ''}`}
                onClick={() => setCategory('all')}
              >
                All Categories
              </button>
              {Object.entries(categoryEmoji).map(([cat, emoji]) => (
                <button
                  key={cat}
                  className={`filter-chip ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  <span className="filter-chip-icon">{emoji}</span>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label" style={{ color: '#a68ada', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Location</label>
            <div className="filter-location-grid" style={{ marginBottom: '24px' }}>
              {['All Locations', 'Library 1st Floor', 'Library 2nd Floor', 'Canteen', 'Lab 401', 'Lab 402', 'Lab 403', 'Seminar Hall', 'Main Gate', 'Reception'].map(loc => {
                const locValue = loc === 'All Locations' ? 'all' : loc;
                return (
                  <button
                    key={loc}
                    className={`filter-loc-btn ${location === locValue ? 'active' : ''}`}
                    onClick={() => setLocation(locValue)}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="filter-reset-btn" onClick={() => { setCategory('all'); setLocation('all'); setSearch(''); setActiveTab('lost'); }}>
            ↺ Reset Filters
          </button>

          <div className="sidebar-item-count" style={{ marginTop: '20px', textAlign: 'center' }}>
            <span className="count-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'white', display: 'block' }}>{filteredItems.length}</span>
            <span className="count-label" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'uppercase' }}>
              {activeTab === 'lost' ? 'Lost Items' : 'Found Items'}
            </span>
          </div>
        </aside>

        {/* Main Content */}
        <div className="main-content-wrapper">
          {/* Toggle Bar — ONLY Lost | Found */}
          <div className="part-3">
            <button
              className={`toggle-btn ${activeTab === 'lost' ? 'active-toggle' : ''}`}
              onClick={() => setActiveTab('lost')}
            >
              📦 Lost Items
            </button>
            <button
              className={`toggle-btn ${activeTab === 'found' ? 'active-toggle' : ''}`}
              onClick={() => setActiveTab('found')}
            >
              🔍 Found Items
            </button>
          </div>

          {/* Items Grid */}
          <div className="part-4">
            {filteredItems.map((item, index) => (
              <Link to={`/item/${item.id}`} key={item.id} className="theme-card-link">
                <div
                  className="theme-card anim-cardReveal"
                  style={{ animationDelay: `${Math.min(index, 8) * 0.08}s` }}
                >
                  <div className="card-image-field">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="item-img-render" />
                    ) : (
                      <div className="card-emoji-placeholder">
                        {categoryEmoji[item.category] || '📦'}
                      </div>
                    )}
                    <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                    <span className={`type-badge ${item.type}`}>{item.type === 'lost' ? '📦 Lost' : '🔍 Found'}</span>
                  </div>
                  <div className="card-info">
                    <h4>{item.name}</h4>
                    <p>📍 {item.location}</p>
                    <p>📅 {item.date}</p>
                    <button className="btn-gradient-card view-btn-card">View Details →</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="no-results">
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>No items found</h3>
              <p>Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryHub;