import React, { createContext, useContext, useState, useEffect } from 'react';
import { FlashcardCategory, Flashcard } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FlashcardContextType {
  categories: FlashcardCategory[];
  flashcards: Flashcard[];
  getFlashcardsByCategory: (categoryId: string) => Flashcard[];
  getFlashcardById: (id: string) => Flashcard | undefined;
  getCategoryById: (id: string) => FlashcardCategory | undefined;
  playSound: (soundUrl: string) => void;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories] = useState<FlashcardCategory[]>([
    {
      id: 'animals',
      name: 'Animals',
      description: 'Learn about different animals and their sounds',
      color: '#10B981',
      icon: '🐾',
      ageGroup: '3-4 years',
      createdAt: Date.now(),
    },
    {
      id: 'colors',
      name: 'Colors',
      description: 'Discover beautiful colors around us',
      color: '#8B5CF6',
      icon: '🎨',
      ageGroup: '3-4 years',
      createdAt: Date.now(),
    },
    {
      id: 'shapes',
      name: 'Shapes',
      description: 'Learn basic shapes and geometry',
      color: '#F59E0B',
      icon: '🔷',
      ageGroup: '3-4 years',
      createdAt: Date.now(),
    },
    {
      id: 'numbers',
      name: 'Numbers',
      description: 'Count and learn numbers 1-10',
      color: '#EF4444',
      icon: '🔢',
      ageGroup: '3-4 years',
      createdAt: Date.now(),
    },
  ]);

  const [flashcards] = useState<Flashcard[]>([
    // Animals
    {
      id: 'cat',
      categoryId: 'animals',
      title: 'Cat',
      description: 'A cute furry pet that says meow',
      imageUrl: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/cat-meow.mp3',
      pronunciation: 'kat',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'dog',
      categoryId: 'animals',
      title: 'Dog',
      description: 'A loyal friend that says woof',
      imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/dog-bark.mp3',
      pronunciation: 'dawg',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'cow',
      categoryId: 'animals',
      title: 'Cow',
      description: 'A farm animal that says moo',
      imageUrl: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/cow-moo.mp3',
      pronunciation: 'kow',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'duck',
      categoryId: 'animals',
      title: 'Duck',
      description: 'A water bird that says quack',
      imageUrl: 'https://images.pexels.com/photos/133459/pexels-photo-133459.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/duck-quack.mp3',
      pronunciation: 'duhk',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    
    // Colors
    {
      id: 'red',
      categoryId: 'colors',
      title: 'Red',
      description: 'The color of apples and fire trucks',
      imageUrl: 'https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/red.mp3',
      pronunciation: 'red',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'blue',
      categoryId: 'colors',
      title: 'Blue',
      description: 'The color of the sky and ocean',
      imageUrl: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/blue.mp3',
      pronunciation: 'bloo',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'yellow',
      categoryId: 'colors',
      title: 'Yellow',
      description: 'The color of the sun and bananas',
      imageUrl: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/yellow.mp3',
      pronunciation: 'yel-oh',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'green',
      categoryId: 'colors',
      title: 'Green',
      description: 'The color of grass and leaves',
      imageUrl: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/green.mp3',
      pronunciation: 'green',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    
    // Shapes
    {
      id: 'circle',
      categoryId: 'shapes',
      title: 'Circle',
      description: 'A round shape with no corners',
      imageUrl: 'https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/circle.mp3',
      pronunciation: 'sur-kul',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'square',
      categoryId: 'shapes',
      title: 'Square',
      description: 'A shape with four equal sides',
      imageUrl: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/square.mp3',
      pronunciation: 'skwair',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'triangle',
      categoryId: 'shapes',
      title: 'Triangle',
      description: 'A shape with three sides',
      imageUrl: 'https://images.pexels.com/photos/1029624/pexels-photo-1029624.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/triangle.mp3',
      pronunciation: 'try-ang-gul',
      difficulty: 'medium',
      createdAt: Date.now(),
    },
    {
      id: 'star',
      categoryId: 'shapes',
      title: 'Star',
      description: 'A shape with five points',
      imageUrl: 'https://images.pexels.com/photos/1252814/pexels-photo-1252814.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/star.mp3',
      pronunciation: 'star',
      difficulty: 'medium',
      createdAt: Date.now(),
    },
    
    // Numbers
    {
      id: 'one',
      categoryId: 'numbers',
      title: 'One',
      description: 'The number 1',
      imageUrl: 'https://images.pexels.com/photos/1329296/pexels-photo-1329296.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/one.mp3',
      pronunciation: 'wuhn',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'two',
      categoryId: 'numbers',
      title: 'Two',
      description: 'The number 2',
      imageUrl: 'https://images.pexels.com/photos/1329297/pexels-photo-1329297.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/two.mp3',
      pronunciation: 'too',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'three',
      categoryId: 'numbers',
      title: 'Three',
      description: 'The number 3',
      imageUrl: 'https://images.pexels.com/photos/1329298/pexels-photo-1329298.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/three.mp3',
      pronunciation: 'three',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
    {
      id: 'four',
      categoryId: 'numbers',
      title: 'Four',
      description: 'The number 4',
      imageUrl: 'https://images.pexels.com/photos/1329299/pexels-photo-1329299.jpeg?auto=compress&cs=tinysrgb&w=400',
      soundUrl: '/sounds/four.mp3',
      pronunciation: 'for',
      difficulty: 'easy',
      createdAt: Date.now(),
    },
  ]);

  const getFlashcardsByCategory = (categoryId: string) => {
    return flashcards.filter(card => card.categoryId === categoryId);
  };

  const getFlashcardById = (id: string) => {
    return flashcards.find(card => card.id === id);
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const playSound = (soundUrl: string) => {
    try {
      // Create audio element and play sound
      const audio = new Audio(soundUrl);
      audio.volume = 0.7;
      audio.play().catch(error => {
        console.log('Sound playback failed:', error);
        // Audio fallback will be handled by the calling component
      });
    } catch (error) {
      console.log('Audio creation failed:', error);
    }
  };

  return (
    <FlashcardContext.Provider
      value={{
        categories,
        flashcards,
        getFlashcardsByCategory,
        getFlashcardById,
        getCategoryById,
        playSound,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};