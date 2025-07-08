import React from 'react';
import { Link } from 'react-router-dom';
import { useFlashcards } from '../context/FlashcardContext';
import { ArrowLeft, Play, Settings, Volume2, VolumeX, Type, TypeIcon, Camera, CameraOff, Eye, EyeOff } from 'lucide-react';
import './Flashcards.css';

const Flashcards: React.FC = () => {
  const { 
    categories, 
    getFlashcardsByCategory,
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
    modelLoading
  } = useFlashcards();

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

      <div className="settings-panel">
        <h2 className="settings-title">
          <Settings size={24} />
          Learning Settings
        </h2>
        
        <div className="settings-grid">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon" style={{ backgroundColor: soundEnabled ? '#10b981' : '#d1d5db' }}>
                {soundEnabled ? <Volume2 size={20} color="white" /> : <VolumeX size={20} color="#6b7280" />}
              </div>
              <div className="setting-text">
                <h4>Sound Effects</h4>
                <p>Play sounds when clicking cards</p>
              </div>
            </div>
            <div 
              className={`toggle-switch ${soundEnabled ? 'active' : ''}`}
              onClick={toggleSound}
            />
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon" style={{ backgroundColor: spellEnabled ? '#8b5cf6' : '#d1d5db' }}>
                {spellEnabled ? <Type size={20} color="white" /> : <TypeIcon size={20} color="#6b7280" />}
              </div>
              <div className="setting-text">
                <h4>Show Spelling</h4>
                <p>Display pronunciation guides</p>
              </div>
            </div>
            <div 
              className={`toggle-switch ${spellEnabled ? 'active' : ''}`}
              onClick={toggleSpell}
            />
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon" style={{ backgroundColor: cameraDetectionEnabled ? '#f59e0b' : '#d1d5db' }}>
                {cameraDetectionEnabled ? <Camera size={20} color="white" /> : <CameraOff size={20} color="#6b7280" />}
              </div>
              <div className="setting-text">
                <h4>Object Detection</h4>
                <p>Use camera to detect objects</p>
              </div>
            </div>
            <div 
              className={`toggle-switch ${cameraDetectionEnabled ? 'active' : ''}`}
              onClick={toggleCameraDetection}
            />
          </div>
        </div>
        
        {cameraDetectionEnabled && (
          <div className="camera-section">
            <div className="camera-controls">
              {!isDetecting ? (
                <button 
                  className="camera-button"
                  onClick={startCameraDetection}
                  disabled={modelLoading}
                >
                  <Camera size={20} />
                  {modelLoading ? 'Loading AI Model...' : 'Start Camera Detection'}
                </button>
              ) : (
                <button 
                  className="camera-button stop"
                  onClick={stopCameraDetection}
                >
                  <CameraOff size={20} />
                  Stop Detection
                </button>
              )}
              
              <div className={`detection-status ${isDetecting ? 'detecting' : ''}`}>
                <Eye size={16} />
                {modelLoading ? 'Loading AI model...' : 
                 isDetecting ? 'AI is analyzing camera feed...' : 'Camera detection ready'}
              </div>
            </div>
            
            {detectedObjects.length > 0 && (
              <div className="detected-objects">
                <h4>Detected Objects:</h4>
                <div className="objects-list">
                  {detectedObjects.map((obj, index) => (
                    <span key={index} className="object-tag">
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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