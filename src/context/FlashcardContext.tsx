import React, { createContext, useContext, useState, useEffect } from 'react';
import { FlashcardCategory, Flashcard } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface FlashcardContextType {
  categories: FlashcardCategory[];
  flashcards: Flashcard[];
  getFlashcardsByCategory: (categoryId: string) => Flashcard[];
  getFlashcardById: (id: string) => Flashcard | undefined;
  getCategoryById: (id: string) => FlashcardCategory | undefined;
  playSound: (soundUrl: string) => void;
  // Settings
  soundEnabled: boolean;
  spellEnabled: boolean;
  cameraDetectionEnabled: boolean;
  toggleSound: () => void;
  toggleSpell: () => void;
  toggleCameraDetection: () => void;
  // Camera detection
  startCameraDetection: () => Promise<void>;
  stopCameraDetection: () => void;
  detectedObjects: string[];
  isDetecting: boolean;
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
  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('flashcard_sound_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [spellEnabled, setSpellEnabled] = useState(() => {
    const saved = localStorage.getItem('flashcard_spell_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [cameraDetectionEnabled, setCameraDetectionEnabled] = useState(() => {
    const saved = localStorage.getItem('flashcard_camera_enabled');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Camera detection state
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('flashcard_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('flashcard_spell_enabled', JSON.stringify(spellEnabled));
  }, [spellEnabled]);

  useEffect(() => {
    localStorage.setItem('flashcard_camera_enabled', JSON.stringify(cameraDetectionEnabled));
  }, [cameraDetectionEnabled]);

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
    if (!soundEnabled) return;
    
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

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    toast.success(`Sound ${!soundEnabled ? 'enabled' : 'disabled'}`);
  };

  const toggleSpell = () => {
    setSpellEnabled(prev => !prev);
    toast.success(`Spelling ${!spellEnabled ? 'enabled' : 'disabled'}`);
  };

  const toggleCameraDetection = () => {
    const newValue = !cameraDetectionEnabled;
    setCameraDetectionEnabled(newValue);
    
    if (!newValue && isDetecting) {
      stopCameraDetection();
    }
    
    toast.success(`Camera detection ${newValue ? 'enabled' : 'disabled'}`);
  };

  // Mock object detection function (simulates AI detection)
  const detectObjects = async (videoElement: HTMLVideoElement): Promise<string[]> => {
    // This is a mock implementation
    // In a real app, you would use TensorFlow.js or similar for actual object detection
    const mockObjects = ['cat', 'dog', 'red', 'blue', 'circle', 'square'];
    const randomObjects = mockObjects.filter(() => Math.random() > 0.8);
    return randomObjects;
  };

  const startCameraDetection = async () => {
    if (!cameraDetectionEnabled) {
      toast.error('Camera detection is disabled. Enable it in settings first.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      
      setVideoStream(stream);
      setIsDetecting(true);
      toast.success('Camera detection started!');

      // Create video element for detection
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Start detection loop
      const interval = setInterval(async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const objects = await detectObjects(video);
          setDetectedObjects(objects);
          
          // Auto-play sounds for detected objects
          if (objects.length > 0 && soundEnabled) {
            objects.forEach(obj => {
              const flashcard = flashcards.find(f => f.title.toLowerCase() === obj.toLowerCase());
              if (flashcard) {
                setTimeout(() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(flashcard.title);
                    utterance.rate = 0.8;
                    utterance.pitch = 1.1;
                    utterance.volume = 0.6;
                    speechSynthesis.speak(utterance);
                  }
                }, Math.random() * 1000);
              }
            });
          }
        }
      }, 2000); // Check every 2 seconds

      setDetectionInterval(interval);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
      setIsDetecting(false);
    }
  };

  const stopCameraDetection = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
    
    setIsDetecting(false);
    setDetectedObjects([]);
    toast.success('Camera detection stopped');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraDetection();
    };
  }, []);

  return (
    <FlashcardContext.Provider
      value={{
        categories,
        flashcards,
        getFlashcardsByCategory,
        getFlashcardById,
        getCategoryById,
        playSound,
        soundEnabled,
        spellEnabled,
        cameraDetectionEnabled,
        toggleSound,
        toggleSpell,
        toggleCameraDetection,
        startCameraDetection,
        stopCameraDetection,
        detectedObjects,
        isDetecting,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};