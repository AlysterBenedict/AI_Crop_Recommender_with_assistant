import React from 'react';
import { FaSpinner, FaExclamationTriangle, FaChartBar, FaSeedling, FaTrophy } from 'react-icons/fa';
import Chatbot from './Chatbot'; // <-- IMPORT THE NEW COMPONENT

// --- MODIFICATION: Accept 'inputs' prop ---
const Results = ({ predictions, loading, error, inputs }) => {
  
  // 1. Loading State
  if (loading) {
    return (
      <div className="loading-state" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
        <FaSpinner className="spinner" size={48} color="#10b981" />
        <p style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1rem' }}>
          Analyzing soil conditions...
        </p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Our AI is processing your data
        </p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="error-state">
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}>
          <FaExclamationTriangle size={48} color="#fca5a5" />
          <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1rem', color: '#ffffff' }}>
            Oops! Something went wrong
          </p>
          <p className="error-message" style={{ marginTop: '0.5rem' }}>{error}</p>
        </div>
      </div>
    );
  }

  // 3. Success State (with predictions)
  if (predictions) {
    const topPick = predictions[0];
    const otherPicks = predictions.slice(1);

    // Crop emoji mapping
    const getCropEmoji = (crop) => {
      const emojiMap = {
        'rice': '🌾',
        'wheat': '🌾',
        'maize': '🌽',
        'corn': '🌽',
        'cotton': '🌸',
        'jute': '🌿',
        'coffee': '☕',
        'apple': '🍎',
        'banana': '🍌',
        'mango': '🥭',
        'grapes': '🍇',
        'watermelon': '🍉',
        'orange': '🍊',
        'papaya': '🫒',
        'coconut': '🥥',
        'chickpea': '🫘',
        'kidneybeans': '🫘',
        'pigeonpeas': '🫘',
        'mothbeans': '🫘',
        'mungbean': '🫘',
        'blackgram': '🫘',
        'lentil': '🫘',
        'pomegranate': '🍎',
      };
      return emojiMap[crop.toLowerCase()] || '🌱';
    };

    return (
      <div className="predictions-list">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaSeedling /> Recommendations
        </h2>
        
        {/* Top Recommendation Card */}
        <div className="top-pick">
          <span className="top-label">
            <FaTrophy style={{ marginRight: '0.25rem', fontSize: '0.8rem' }} />
            Best Match
          </span>
          <div style={{ fontSize: '3.5rem', margin: '0.75rem 0' }}>
            {getCropEmoji(topPick.crop)}
          </div>
          <h3>{topPick.crop}</h3>
          <p className="confidence">{topPick.confidence} Confidence</p>
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            ✨ Perfect conditions detected for optimal growth
          </div>
        </div>
        
        {/* Other Recommendations */}
        <h4 className="other-options-title">
          Alternative Options:
        </h4>
        <ul className="other-options-list">
          {otherPicks.map((pick, index) => (
            <li key={pick.crop} className="other-option-item" style={{
              animation: `fadeInUp 0.5s ease-out ${(index + 1) * 0.1}s both`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{getCropEmoji(pick.crop)}</span>
                <span className="crop-name">{pick.crop}</span>
              </div>
              <span className="crop-confidence">{pick.confidence}</span>
            </li>
          ))}
        </ul>
        
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: '1.6',
        }}>
          <strong style={{ color: '#ffffff' }}>💡 Pro Tip:</strong> Consider local market demand 
          and your farming experience when making final decisions.
        </div>

        {/* --- MODIFICATION: ADD THE CHATBOT COMPONENT --- */}
        {/* Pass the context (inputs and predictions) to the chatbot */}
        <Chatbot inputs={inputs} predictions={predictions} />
        {/* --- END OF MODIFICATION --- */}
        
      </div>
    );
  }

  // 4. Initial/Default State
  return (
    <div className="initial-state" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <FaChartBar size={56} color="rgba(255, 255, 255, 0.6)" />
        <p style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', color: '#ffffff' }}>
          Ready to Analyze
        </p>
        <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '280px' }}>
          Fill in your soil and climate parameters to receive personalized crop recommendations
        </p>
      </div>
    </div>
  );
};

export default Results;