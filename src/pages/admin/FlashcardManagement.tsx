import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Flashcard } from '../../types';
import { Plus, Edit, Trash2, BookOpen, Image, Volume2, Eye, Copy, Check, Link as LinkIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import './FlashcardManagement.css';

const FlashcardManagement: React.FC = () => {
  const { flashcards, categories, addFlashcard, updateFlashcard, deleteFlashcard, getCategoryById } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    imageUrl: '',
    soundUrl: '',
    pronunciation: '',
    spelling: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  });

  const filteredFlashcards = selectedCategory === 'all' 
    ? flashcards 
    : flashcards.filter(card => card.categoryId === selectedCategory);

  const handleAddFlashcard = () => {
    setEditingFlashcard(null);
    setFormData({
      categoryId: categories[0]?.id || '',
      title: '',
      description: '',
      imageUrl: '',
      soundUrl: '',
      pronunciation: '',
      spelling: '',
      difficulty: 'easy',
    });
    setShowModal(true);
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setFormData({
      categoryId: flashcard.categoryId,
      title: flashcard.title,
      description: flashcard.description || '',
      imageUrl: flashcard.imageUrl,
      soundUrl: flashcard.soundUrl,
      pronunciation: flashcard.pronunciation || '',
      spelling: flashcard.spelling,
      difficulty: flashcard.difficulty,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const flashcardData = {
      categoryId: formData.categoryId,
      title: formData.title,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl,
      soundUrl: formData.soundUrl,
      pronunciation: formData.pronunciation || undefined,
      spelling: formData.spelling,
      difficulty: formData.difficulty,
    };
    
    if (editingFlashcard) {
      updateFlashcard(editingFlashcard.id, flashcardData);
    } else {
      addFlashcard(flashcardData);
    }
    
    setShowModal(false);
    setEditingFlashcard(null);
  };

  const handleDeleteFlashcard = (flashcardId: string) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      deleteFlashcard(flashcardId);
    }
  };

  const generateSpelling = (word: string) => {
    return word.toLowerCase().split('').join('-');
  };

  const handleCopyFlashcardUrl = async (flashcard: Flashcard) => {
    const url = `${window.location.origin}/flashcards/${flashcard.categoryId}/${flashcard.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls(prev => new Set(prev).add(flashcard.id));
      toast.success('Flashcard URL copied to clipboard!');
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(flashcard.id);
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
      setCopiedUrls(prev => new Set(prev).add(flashcard.id));
      toast.success('Flashcard URL copied to clipboard!');
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(flashcard.id);
          return newSet;
        });
      }, 2000);
    }
  };

  const handleViewFlashcard = (flashcard: Flashcard) => {
    const url = `/flashcards/${flashcard.categoryId}/${flashcard.id}`;
    window.open(url, '_blank');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      spelling: generateSpelling(title),
    }));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="flashcard-management fade-in">
      <div className="flashcard-management-header">
        <div>
          <h1 className="admin-page-heading">Flashcard Management</h1>
          <p className="admin-subtitle">Manage individual flashcards and their content</p>
        </div>
        <div className="header-actions">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <button className="add-flashcard-button" onClick={handleAddFlashcard}>
            <Plus size={18} />
            <span>Add Flashcard</span>
          </button>
        </div>
      </div>

      <div className="flashcards-grid">
        {filteredFlashcards.map(flashcard => {
          const category = getCategoryById(flashcard.categoryId);
          
          return (
            <div key={flashcard.id} className="flashcard-card">
              <div className="flashcard-image-container">
                <img
                  src={flashcard.imageUrl}
                  alt={flashcard.title}
                  className="flashcard-image"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="flashcard-category-badge" style={{ backgroundColor: category?.color }}>
                  {category?.icon} {category?.name}
                </div>
              </div>

              <div className="flashcard-content">
                <h3 className="flashcard-title">{flashcard.title}</h3>
                {flashcard.description && (
                  <p className="flashcard-description">{flashcard.description}</p>
                )}

                <div className="flashcard-meta">
                  <div className="meta-row">
                    <span className="meta-label">Pronunciation:</span>
                    <span className="meta-value">/{flashcard.pronunciation || 'N/A'}/</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Spelling:</span>
                    <span className="meta-value spelling">{flashcard.spelling}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Difficulty:</span>
                    <span className={`difficulty-badge difficulty-${flashcard.difficulty}`}>
                      {flashcard.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flashcard-actions">
                  <button
                    className="flashcard-action-button"
                    onClick={() => handleViewFlashcard(flashcard)}
                    title="View Flashcard"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    className={`flashcard-action-button ${copiedUrls.has(flashcard.id) ? 'copied' : ''}`}
                    onClick={() => handleCopyFlashcardUrl(flashcard)}
                    title="Copy Flashcard URL"
                  >
                    {copiedUrls.has(flashcard.id) ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    className="flashcard-action-button"
                    onClick={() => handleEditFlashcard(flashcard)}
                    title="Edit Flashcard"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="flashcard-action-button delete"
                    onClick={() => handleDeleteFlashcard(flashcard.id)}
                    title="Delete Flashcard"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flashcard-footer">
                <span className="created-date">Created {formatDate(flashcard.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFlashcards.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No flashcards found</h3>
          <p>
            {selectedCategory === 'all' 
              ? 'Start by creating your first flashcard.'
              : 'No flashcards in this category. Create one to get started.'
            }
          </p>
          <button className="button-primary" onClick={handleAddFlashcard}>
            <Plus size={16} />
            Add Flashcard
          </button>
        </div>
      )}

      {showModal && (
        <div className="flashcard-modal-overlay">
          <div className="flashcard-modal">
            <div className="flashcard-modal-header">
              <h2>{editingFlashcard ? 'Edit Flashcard' : 'Add New Flashcard'}</h2>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flashcard-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    required
                    className="form-input"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="form-input"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="form-input"
                  placeholder="e.g., Cat, Red, Circle"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="form-input"
                  placeholder="Describe the flashcard content..."
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="pronunciation">Pronunciation (Optional)</label>
                  <input
                    type="text"
                    id="pronunciation"
                    value={formData.pronunciation}
                    onChange={(e) => setFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
                    className="form-input"
                    placeholder="e.g., kat, red, sur-kul"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="spelling">Spelling</label>
                  <input
                    type="text"
                    id="spelling"
                    value={formData.spelling}
                    onChange={(e) => setFormData(prev => ({ ...prev, spelling: e.target.value }))}
                    required
                    className="form-input"
                    placeholder="e.g., c-a-t, r-e-d"
                  />
                  <div className="form-help">
                    This is how the word will be spelled out when spell mode is enabled.
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  required
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <div className="image-preview">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="soundUrl">Sound URL</label>
                <input
                  type="text"
                  id="soundUrl"
                  value={formData.soundUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, soundUrl: e.target.value }))}
                  required
                  className="form-input"
                  placeholder="/sounds/cat-meow.mp3"
                />
                <div className="form-help">
                  Path to the sound file. If the file doesn't exist, text-to-speech will be used as fallback.
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
                  {editingFlashcard ? 'Update Flashcard' : 'Create Flashcard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardManagement;