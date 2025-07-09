import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FlashcardCategory } from '../../types';
import { Plus, Edit, Trash2, Layers, Palette, Users, Globe, Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import './CategoryManagement.css';

const CategoryManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, getFlashcardsByCategory } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FlashcardCategory | null>(null);
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#10B981',
    icon: '🎯',
    ageGroup: '3-4 years',
    modelUrl: '',
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#10B981',
      icon: '🎯',
      ageGroup: '3-4 years',
      modelUrl: '',
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: FlashcardCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      ageGroup: category.ageGroup,
      modelUrl: category.modelUrl || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: formData.icon,
      ageGroup: formData.ageGroup,
      modelUrl: formData.modelUrl || undefined,
    };
    
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const flashcardsCount = getFlashcardsByCategory(categoryId).length;
    const confirmMessage = flashcardsCount > 0 
      ? `Are you sure you want to delete this category? This will also delete ${flashcardsCount} flashcard(s).`
      : 'Are you sure you want to delete this category?';
      
    if (window.confirm(confirmMessage)) {
      deleteCategory(categoryId);
    }
  };

  const handleCopyCategoryUrl = async (category: FlashcardCategory) => {
    const url = `${window.location.origin}/flashcards/${category.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls(prev => new Set(prev).add(category.id));
      toast.success('Category URL copied to clipboard!');
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(category.id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUrls(prev => new Set(prev).add(category.id));
      toast.success('Category URL copied to clipboard!');
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(category.id);
          return newSet;
        });
      }, 2000);
    }
  };

  const handleViewCategory = (category: FlashcardCategory) => {
    const url = `/flashcards/${category.id}`;
    window.open(url, '_blank');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const commonIcons = ['🎯', '🐾', '🎨', '🔷', '🔢', '🌟', '📚', '🎵', '🏠', '🚗', '🍎', '⚽'];
  const commonColors = ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="category-management fade-in">
      <div className="category-management-header">
        <div>
          <h1 className="admin-page-heading">Category Management</h1>
          <p className="admin-subtitle">Manage flashcard categories and their AI models</p>
        </div>
        <button className="add-category-button" onClick={handleAddCategory}>
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => {
          const flashcardsCount = getFlashcardsByCategory(category.id).length;
          
          return (
            <div key={category.id} className="category-card" style={{ '--category-color': category.color } as React.CSSProperties}>
              <div className="category-header">
                <div className="category-icon-large">{category.icon}</div>
                <div className="category-actions">
                  <button
                    className="category-action-button"
                    onClick={() => handleViewCategory(category)}
                    title="View Category"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    className={`category-action-button ${copiedUrls.has(category.id) ? 'copied' : ''}`}
                    onClick={() => handleCopyCategoryUrl(category)}
                    title="Copy Category URL"
                  >
                    {copiedUrls.has(category.id) ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    className="category-action-button"
                    onClick={() => handleEditCategory(category)}
                    title="Edit Category"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="category-action-button delete"
                    onClick={() => handleDeleteCategory(category.id)}
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>

              <div className="category-meta">
                <div className="meta-item">
                  <Users size={14} />
                  <span>{category.ageGroup}</span>
                </div>
                <div className="meta-item">
                  <Layers size={14} />
                  <span>{flashcardsCount} cards</span>
                </div>
              </div>

              {category.modelUrl && (
                <div className="model-info">
                  <Globe size={14} />
                  <span>Custom AI Model</span>
                </div>
              )}

              <div className="category-footer">
                <span className="created-date">Created {formatDate(category.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="category-modal-overlay">
          <div className="category-modal">
            <div className="category-modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Category Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="form-input"
                    placeholder="e.g., Animals, Colors, Shapes"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ageGroup">Age Group</label>
                  <select
                    id="ageGroup"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value }))}
                    className="form-input"
                  >
                    <option value="2-3 years">2-3 years</option>
                    <option value="3-4 years">3-4 years</option>
                    <option value="4-5 years">4-5 years</option>
                    <option value="5-6 years">5-6 years</option>
                    <option value="All ages">All ages</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="form-input"
                  placeholder="Describe what this category teaches..."
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="icon">Icon</label>
                  <div className="icon-selector">
                    <input
                      type="text"
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="form-input icon-input"
                      placeholder="🎯"
                    />
                    <div className="icon-options">
                      {commonIcons.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <div className="color-selector">
                    <input
                      type="color"
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="form-input color-input"
                    />
                    <div className="color-options">
                      {commonColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`color-option ${formData.color === color ? 'selected' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modelUrl">Custom AI Model URL (Optional)</label>
                <input
                  type="url"
                  id="modelUrl"
                  value={formData.modelUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelUrl: e.target.value }))}
                  className="form-input"
                  placeholder="https://example.com/models/animals-model.json"
                />
                <div className="form-help">
                  Provide a URL to a fine-tuned TensorFlow.js model for better detection accuracy in this category.
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;