import React from 'react';
import { Link } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';
import { ArrowLeft, Play } from 'lucide-react';
import './Flashcards.css';

const Flashcards: React.FC = () => {
  const { categories, getFlashcardsByCategory } = useFlashcards();

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
        
        <h1 className="flashcards-title">🌟 Learning Flashcards 🌟</h1>
        <p className="flashcards-subtitle">
          Fun learning for little ones! Click on any category to start exploring.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map(category => {
          const flashcardCount = getFlashcardsByCategory(category.id).length;
          
          return (
            <Link
              key={category.id}
              to={`/flashcards/${category.id}`}
              className="category-card"
              style={{ '--category-color': category.color } as React.CSSProperties}
            >
              <span className="category-icon">{category.icon}</span>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <div className="category-meta">
                <span>{flashcardCount} cards</span>
                <span>{category.ageGroup}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Flashcards;