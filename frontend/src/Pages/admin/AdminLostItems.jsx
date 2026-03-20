import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLostItems = ({ items, addItem }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', location: '', date: '', description: '',
    type: 'lost', status: 'LOST', reporter: 'Admin',
    reporterEmail: 'admin@apsit.edu.in',
    image: 'https://via.placeholder.com/300x200'
  });

  const lostItems = items.filter(i => i.type === 'lost');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(formData);
    setShowModal(false);
    setFormData({
      name: '', category: '', location: '', date: '', description: '',
      type: 'lost', status: 'LOST', reporter: 'Admin',
      reporterEmail: 'admin@apsit.edu.in',
      image: 'https://via.placeholder.com/300x200'
    });
  };

  return (
    <>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Lost Items ({lostItems.length})</h2>
        <button className="admin-add-btn" onClick={() => setShowModal(true)}>+ Add Item</button>
      </div>

      <div className="admin-item-grid">
        {lostItems.map((item, index) => (
          <div
            className="theme-card"
            key={item.id}
            style={{ animationDelay: `${Math.min(index, 5) * 0.08}s` }}
          >
            <div className="card-image-field">
              {item.image && <img src={item.image} alt={item.name} className="item-img-render" />}
              <span className="status-badge" style={{ background: '#dc3545' }}>{item.status}</span>
            </div>
            <div className="card-info" style={{ background: 'rgba(102,126,234,0.15)' }}>
              <h4 style={{ color: '#120058', marginBottom: '8px' }}>{item.name}</h4>
              <p style={{ color: '#764ba2', fontSize: '14px' }}>📍 {item.location}</p>
              <p style={{ color: '#764ba2', fontSize: '14px' }}>📅 {item.date}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <Link to={`/item/${item.id}`} style={{ flex: 1 }}>
                  <button className="btn-gradient-card" style={{ width: '100%' }}>View Details</button>
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
            <h2 className="admin-modal-title">Report Lost Item</h2>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <div>
                <label>Item Name</label>
                <input type="text" name="name" required onChange={handleChange} placeholder="e.g. Blue HP Laptop" />
              </div>
              <div>
                <label>Category</label>
                <select name="category" required onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="id-cards">ID Cards</option>
                  <option value="books">Books/Notes</option>
                </select>
              </div>
              <div>
                <label>Location</label>
                <input type="text" name="location" required onChange={handleChange} placeholder="e.g. Library 2nd Floor" />
              </div>
              <div>
                <label>Date</label>
                <input type="date" name="date" required onChange={handleChange} />
              </div>
              <div>
                <label>Description</label>
                <textarea name="description" rows="3" onChange={handleChange} placeholder="Describe the item..." />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="admin-add-btn" style={{ flex: 1 }}>Submit</button>
                <button type="button" className="export-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLostItems;
