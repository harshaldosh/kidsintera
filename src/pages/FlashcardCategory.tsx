import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';
import { ArrowLeft, Play } from 'lucide-react';
import './Flashcards.css';

const FlashcardCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategoryById, getFlashcardsByCategory, playSound } = useFlashcards();
  
  const category = categoryId ? getCategoryById(categoryId) : undefined;
  const flashcards = categoryId ? getFlashcardsByCategory(categoryId) : [];

  if (!category) {
    return (
      <div className="flashcards-page">
        <div className="flashcards-header">
          <Link to="/flashcards" className="back-button">
            <ArrowLeft size={20} />
            Back to Categories
          </Link>
          <h1 className="flashcards-title">Category not found</h1>
        </div>
      </div>
    );
  }

  const handlePlaySound = (soundUrl: string, title: string) => {
    playSound(soundUrl);
    
    // Fallback to speech synthesis if sound file doesn't exist
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(title);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <Link to="/flashcards" className="back-button">
          <ArrowLeft size={20} />
          Back to Categories
        </Link>
        
        <h1 className="flashcards-title">
          {category.icon} {category.name}
        </h1>
        <p className="flashcards-subtitle">{category.description}</p>
      </div>

      <div className="flashcard-grid">
        {flashcards.map(flashcard => (
          <div
            key={flashcard.id}
            className="flashcard"
            style={{ '--category-color': category.color } as React.CSSProperties}
          >
            <Link to={`/flashcards/${categoryId}/${flashcard.id}`}>
              <img
                src={flashcard.imageUrl}
                alt={flashcard.title}
                className="flashcard-image"
                onError={(e) => {
                  // Fallback image if the original fails to load
                  e.currentTarget.src = 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
            </Link>
            
            <h3 className="flashcard-title">{flashcard.title}</h3>
            
            {flashcard.description && (
              <p className="flashcard-description">{flashcard.description}</p>
            )}
            
            {flashcard.pronunciation && (
              <div className="flashcard-pronunciation">
                /{flashcard.pronunciation}/
              </div>
            )}
            
            <button
              className="play-button"
              onClick={() => handlePlaySound(flashcard.soundUrl, flashcard.title)}
              style={{ '--category-color': category.color } as React.CSSProperties}
            >
              <Play size={20} />
              Play Sound
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardCategory;