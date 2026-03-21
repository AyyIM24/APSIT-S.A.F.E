import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../../Components/admin/AdminShell';

const mockFoundItems = [
  { id: 2, name: "iPhone 13", status: "FOUND", category: "electronics", location: "Canteen", date: "2026-02-13", image: "/images/Img 2.jpg" },
  { id: 4, name: "Blue Umbrella", status: "FOUND", category: "others", location: "Main Gate", date: "2026-02-11", image: "" },
  { id: 6, name: "Calculator", status: "SECURED", category: "electronics", location: "Lab 401", date: "2026-02-09", image: "" },
];

const AdminFoundItems = () => {
  const [items, setItems] = useState(mockFoundItems);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', location: '', date: '', description: '', status: 'FOUND',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setItems(prev => [...prev, { ...formData, id: Date.now(), image: '' }]);
    setShowModal(false);
    setFormData({ name: '', category: '', location: '', date: '', description: '', status: 'FOUND' });
  };

  return (
    <AdminShell pageTitle="Found Items">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Found Items ({items.length})</h2>
        <button className="admin-add-btn" onClick={() => setShowModal(true)}>+ Add Item</button>
      </div>

      {/* Item Grid matching prototype: cards with "View details" button */}
      <div className="admin-item-grid">
        {items.map((item, index) => (
          <div className="theme-card anim-cardReveal" key={item.id} style={{ animationDelay: `${Math.min(index, 5) * 0.08}s` }}>
            <div className="card-image-field">
              {item.image ? (
                <img src={item.image} alt={item.name} className="item-img-render" />
              ) : (
                <div style={{ 
                  width: '100%', height: '100%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(102,126,234,0.1)', fontSize: '3rem'
                }}>
                  {item.category === 'electronics' ? '💻' : '📦'}
                </div>
              )}
              <span className="status-badge" style={{ background: item.status === 'SECURED' ? '#28a745' : '#667eea' }}>{item.status}</span>
            </div>
            <div className="card-info" style={{ background: 'rgba(102,126,234,0.15)' }}>
              <h4 style={{ color: '#120058', marginBottom: '8px' }}>{item.name}</h4>
              <p style={{ color: '#764ba2', fontSize: '14px' }}>📍 {item.location}</p>
              <p style={{ color: '#764ba2', fontSize: '14px' }}>📅 {item.date}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <Link to={`/item/${item.id}`} style={{ flex: 1 }}>
                  <button className="btn-gradient-card" style={{ width: '100%' }}>View Details</button>
                </Link>
                <Link to={`/admin/item/${item.id}/qr`} style={{ flex: 1 }}>
                  <button className="export-btn" style={{ width: '100%', padding: '10px' }}>🏷️ QR Code</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">Report Found Item</h2>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <div><label>Item Name</label><input type="text" name="name" required onChange={handleChange} placeholder="e.g. iPhone 13" /></div>
              <div><label>Category</label>
                <select name="category" required onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="electronics">Electronics</option>
                  <option value="id-cards">ID Cards</option>
                  <option value="books">Books</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div><label>Location</label><input type="text" name="location" required onChange={handleChange} placeholder="e.g. Canteen" /></div>
              <div><label>Date</label><input type="date" name="date" required onChange={handleChange} /></div>
              <div><label>Status</label>
                <select name="status" onChange={handleChange} value={formData.status}>
                  <option value="FOUND">Found</option>
                  <option value="SECURED">Secured</option>
                </select>
              </div>
              <div><label>Description</label><textarea name="description" rows="3" onChange={handleChange} /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="admin-add-btn" style={{ flex: 1 }}>Submit</button>
                <button type="button" className="export-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminFoundItems;
