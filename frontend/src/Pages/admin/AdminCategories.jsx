import React, { useState } from 'react';

const defaultCategories = [
  { id: 1, name: 'Electronics', count: 0 },
  { id: 2, name: 'ID Cards', count: 0 },
  { id: 3, name: 'Books/Notes', count: 0 },
  { id: 4, name: 'Clothing', count: 0 },
  { id: 5, name: 'Accessories', count: 0 },
];

const AdminCategories = ({ items }) => {
  const [categories, setCategories] = useState(() => {
    // Count items per category
    return defaultCategories.map(cat => ({
      ...cat,
      count: items.filter(i =>
        i.category && i.category.toLowerCase() === cat.name.toLowerCase().replace('/', '-').replace(' ', '-')
      ).length
    }));
  });
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCategories(prev => [...prev, {
      id: Date.now(),
      name: newName.trim(),
      count: 0,
    }]);
    setNewName('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = (id) => {
    if (!editName.trim()) return;
    setCategories(prev => prev.map(c =>
      c.id === id ? { ...c, name: editName.trim() } : c
    ));
    setEditingId(null);
    setEditName('');
  };

  return (
    <>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Manage Categories</h2>
      </div>

      {/* Add New Category */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
        <div className="admin-search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <input
            type="text"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <button type="submit" className="admin-add-btn">+ Add Category</button>
      </form>

      {/* Category List */}
      <div className="admin-category-list">
        {categories.map((cat, index) => (
          <div
            className="admin-category-item"
            key={cat.id}
            style={{ animation: `cardReveal 0.4s ${index * 0.06}s ease both` }}
          >
            {editingId === cat.id ? (
              <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    flex: 1, padding: '8px 16px', borderRadius: '10px',
                    border: '1px solid #e9d5ff', outline: 'none', fontSize: '15px'
                  }}
                  autoFocus
                />
                <button className="approve-btn" onClick={() => handleSaveEdit(cat.id)}>Save</button>
                <button className="reject-btn" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="admin-category-name">{cat.name}</span>
                  <span className="admin-category-count">{cat.count} items</span>
                </div>
                <div className="admin-category-actions">
                  <button className="admin-category-edit" onClick={() => handleEdit(cat)} title="Edit">✏️</button>
                  <button className="admin-category-delete" onClick={() => handleDelete(cat.id)} title="Delete">🗑️</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#764ba2', fontWeight: 600 }}>
          No categories yet. Add one above.
        </div>
      )}
    </>
  );
};

export default AdminCategories;
