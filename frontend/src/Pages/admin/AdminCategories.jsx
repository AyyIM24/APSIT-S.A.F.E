import React, { useState, useEffect } from 'react';
import AdminShell from '../../Components/admin/AdminShell';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await api.post('/categories', { name: newCategory.trim(), icon: '🏷️' });
      setCategories(prev => [...prev, response.data]);
      setNewCategory('');
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    try {
      const response = await api.put(`/categories/${editId}`, { name: editName.trim() });
      setCategories(prev => prev.map(c =>
        c.id === editId ? response.data : c
      ));
      setEditId(null);
      setEditName('');
    } catch (err) {
      console.error("Failed to update category", err);
    }
  };

  if (loading) {
    return <AdminShell pageTitle="Categories"><div>Loading...</div></AdminShell>;
  }

  return (
    <AdminShell pageTitle="Categories">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Item Categories ({categories.length})</h2>
      </div>

      {/* Add Category */}
      <div className="admin-add-category-row">
        <input
          type="text"
          placeholder="Enter new category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className="admin-add-btn" onClick={handleAdd}>+ Add Category</button>
      </div>

      {/* Category List */}
      <div className="admin-category-list">
        {categories.map((cat, index) => (
          <div className="admin-category-item" key={cat.id} style={{ animationDelay: `${index * 0.06}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
              {editId === cat.id ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    style={{ padding: '8px 12px', border: '1px solid #e9d5ff', borderRadius: '8px', fontSize: '14px', color: '#120058' }}
                    autoFocus
                  />
                  <button className="approve-btn" onClick={handleSaveEdit}>Save</button>
                  <button className="reject-btn" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              ) : (
                <span className="admin-category-name">{cat.name}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="admin-category-count">{cat.count} items</span>
              {editId !== cat.id && (
                <div className="admin-category-actions">
                  <button className="admin-icon-btn" onClick={() => handleEdit(cat)} title="Edit">✏️</button>
                  <button className="admin-icon-btn danger" onClick={() => handleDelete(cat.id)} title="Delete">🗑️</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
};

export default AdminCategories;
