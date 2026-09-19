import React, { useState, useEffect } from 'react';
import { adminCategoryService } from '../services/api';
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminCategoryService.getCategories();
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminCategoryService.createCategory({
        name: name.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim() || null
      });
      setName('');
      setDescription('');
      setImageUrl('');
      setIsAddOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await adminCategoryService.updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
        image_url: editingCategory.image_url,
        is_active: editingCategory.is_active
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (cat) => {
    if (window.confirm(`Delete category "${cat.name}"?`)) {
      try {
        await adminCategoryService.deleteCategory(cat.id);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Cannot delete category with associated products.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#520612', fontWeight: 700 }}>
            Category Management
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Organize men's jewellery collections (Rings, Chains, Balis, Kadas, Bracelets)
          </p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          <Plus size={15} /> Add Category
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.80rem' }}>
          {error}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', width: '100%', maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#520612' }}>Create Category</h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kada"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Royal Rajputi & Punjabi 1 gram gold-plated kadas"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Products Linked</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <img
                    src={cat.image_url || 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600'}
                    alt={cat.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                  />
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{cat.name}</span>
                  {cat.description && <p style={{ fontSize: '0.72rem', color: '#64748B' }}>{cat.description}</p>}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748B' }}>{cat.slug}</td>
                <td>
                  <span style={{ fontWeight: 600 }}>{cat.total_products || 0}</span> pieces
                </td>
                <td>
                  <span style={{
                    backgroundColor: cat.is_active ? '#DCFCE7' : '#F1F5F9',
                    color: cat.is_active ? '#166534' : '#64748B',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.70rem',
                    fontWeight: 700
                  }}>
                    {cat.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setEditingCategory({ ...cat })}
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '4px', borderRadius: '4px', cursor: 'pointer', color: '#991B1B' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', width: '100%', maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#520612' }}>Edit Category</h3>
              <button onClick={() => setEditingCategory(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Thumbnail URL</label>
                <input
                  type="url"
                  value={editingCategory.image_url || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                  className="form-input"
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(editingCategory.is_active)}
                  onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                />
                Active on Storefront
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setEditingCategory(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
