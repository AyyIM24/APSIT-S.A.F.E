import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../../Components/admin/AdminShell';
import api, { getImageUrl } from '../../services/api';

const AdminFoundItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', location: '', date: '', description: '', status: 'FOUND',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items?type=found');
        setItems(response.data);
      } catch (err) {
        console.error("Failed to load found items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/items/found', {
        itemName: formData.name,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        description: formData.description
      });
      setItems(prev => [...prev, response.data]);
      setShowModal(false);
      setFormData({ name: '', category: '', location: '', date: '', description: '', status: 'FOUND' });
    } catch (err) {
      console.error("Failed to report found item", err);
      alert("Failed to add item.");
    }
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
              {item.imageUrl ? (
                <img src={getImageUrl(item.imageUrl)} alt={item.itemName} className="item-img-render" />
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
            <div className="card-info" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <h4 style={{ color: '#120058', marginBottom: '8px' }}>{item.itemName}</h4>
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
