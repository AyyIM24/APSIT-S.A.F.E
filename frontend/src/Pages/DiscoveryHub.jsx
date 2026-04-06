import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl, authService } from '../services/api';

const categoryEmoji = {
  electronics: '💻', 'id-cards': '🪪', books: '📚', bags: '🎒',
  accessories: '⌚', keys: '🔑', others: '📦', other: '👓'
};

const DiscoveryHub = ({ isLoggedIn, setIsLoggedIn }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('lost'); // Default to 'lost'
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleFoundTabClick = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { message: 'Login to see found items' } });
      return;
    }
    setActiveTab('found');
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.itemName?.toLowerCase().includes(search.toLowerCase()) || 
                       (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    // If backend returns category as string "electronics"
    const matchCategory = category === 'all' || item.category === category;
    const matchLocation = location === 'all' || item.location === location;
    // Map backend domain type (LOST, FOUND) to tabs (lost, found)
    const matchTab = item.type?.toLowerCase() === activeTab.toLowerCase();
    return matchSearch && matchCategory && matchLocation && matchTab;
  });

  // Status badge renderer
  const renderStatusBadge = (status) => {
    if (status === 'SECURED') {
      return (
        <span className="status-badge" style={{ 
          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          color: 'white',
          fontSize: '11px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          ⏳ Being Collected
        </span>
      );
    }
    if (status === 'FOUND') {
      return (
        <span className="status-badge" style={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          fontSize: '11px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          🔍 Found
        </span>
      );
    }
    // LOST — default styling from CSS
    return <span className={`status-badge ${status?.toLowerCase()}`}>{status}</span>;
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '2rem' }}>Loading items...</div>;
  }


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
              onClick={handleFoundTabClick}
              style={!isLoggedIn ? { opacity: 0.6 } : {}}
            >
              🔍 Found Items {!isLoggedIn && '🔒'}
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
                    {item.imageUrl ? (
                      <img src={getImageUrl(item.imageUrl)} alt={item.itemName} className="item-img-render" />
                    ) : (
                      <div className="card-emoji-placeholder">
                        {categoryEmoji[item.category] || '📦'}
                      </div>
                    )}
                    {renderStatusBadge(item.status)}
                    <span className={`type-badge ${item.type?.toLowerCase()}`}>{item.type?.toLowerCase() === 'lost' ? '📦 Lost' : '🔍 Found'}</span>
                  </div>
                  <div className="card-info">
                    <h4>{item.itemName}</h4>
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
              <p>
                {activeTab === 'found' && isLoggedIn 
                  ? "You haven't reported any found items yet." 
                  : "Try adjusting your filters or search term."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryHub;