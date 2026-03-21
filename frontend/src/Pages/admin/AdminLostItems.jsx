import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../../Components/admin/AdminShell';

const mockLostItems = [
  { id: 1, name: "Blue HP Laptop", status: "LOST", category: "electronics", location: "Library 2nd Floor", date: "2026-02-14", image: "/images/Img 1.jpg" },
  { id: 3, name: "APSIT ID Card", status: "LOST", category: "id-cards", location: "Lab 402", date: "2026-02-12", image: "/images/Img 3.jpeg" },
  { id: 5, name: "Data Structures Notes", status: "LOST", category: "books", location: "Seminar Hall", date: "2026-02-10", image: "" },
];

const AdminLostItems = () => {
  const [items, setItems] = useState(mockLostItems);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', location: '', date: '', description: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setItems(prev => [...prev, { ...formData, id: Date.now(), status: 'LOST', image: '' }]);
    setShowModal(false);
    setFormData({ name: '', category: '', location: '', date: '', description: '' });
  };

  return (
    <AdminShell pageTitle="Lost Items">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Lost Items ({items.length})</h2>
        <button className="admin-add-btn" onClick={() => setShowModal(true)}>+ Add Item</button>
      </div>

      <div className="admin-item-grid">
        {items.map((item, index) => (
          <div className="theme-card anim-cardReveal" key={item.id} style={{ animationDelay: `${Math.min(index, 5) * 0.08}s` }}>
            <div className="card-image-field">
              {item.image && <img src={item.image} alt={item.name} className="item-img-render" />}
              <span className="status-badge" style={{ background: '#dc3545' }}>{item.status}</span>
            </div>
            <div className="card-info" style={{ background: 'rgba(102,126,234,0.15)' }}>
              <h4 style={{ color: '#120058', marginBottom: '8px' }}>{item.name}</h4>
              <p style={{ color: '#764ba2', fontSize: '14px' }}>📍 {item.location}</p>
              <p style={{ color: '#764ba2', fontSize: '14px' }}>📅 {item.date}</p>
              <Link to={`/item/${item.id}`}><button className="btn-gradient-card" style={{ width: '100%', marginTop: '12px' }}>View Details</button></Link>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">Report Lost Item</h2>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <div><label>Item Name</label><input type="text" name="name" required onChange={handleChange} placeholder="e.g. Blue HP Laptop" /></div>
              <div><label>Category</label><select name="category" required onChange={handleChange}><option value="">Select</option><option value="electronics">Electronics</option><option value="id-cards">ID Cards</option><option value="books">Books</option></select></div>
              <div><label>Location</label><input type="text" name="location" required onChange={handleChange} placeholder="e.g. Library" /></div>
              <div><label>Date</label><input type="date" name="date" required onChange={handleChange} /></div>
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

export default AdminLostItems;
