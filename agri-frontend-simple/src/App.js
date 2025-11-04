import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import our new CSS styles
import Header from './components/Header';
import Footer from './components/Footer';
import CropForm from './components/CropForm';
import Results from './components/Results';

// The URL of your running FastAPI backend
const API_URL = 'http://127.0.0.1:8000/predict';

function App() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- MODIFICATION ---
  // Store the form data to pass to the chatbot
  const [currentInputs, setCurrentInputs] = useState(null); 
  // --- END OF MODIFICATION ---

  /**
   * Function to call the FastAPI backend
   * @param {object} formData - The data from the form
   */
  const getPredictions = async (formData) => {
    setLoading(true);
    setError(null);
    setPredictions(null);

    // --- MODIFICATION ---
    setCurrentInputs(formData); // Save the form data
    // --- END OF MODIFICATION ---

    try {
      // Send a POST request to the backend
      const response = await axios.post(API_URL, formData);
      setPredictions(response.data.top_3_recommended_crops);
    } catch (err) {
      console.error("Error fetching predictions:", err);
      if (err.response) {
        setError(`Error: ${err.response.statusText}`);
      } else if (err.request) {
        setError("Network Error: Could not connect to the backend. Is it running?");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          {/* Page Title & Description */}
          <div className="title-section">
            <h1>Smart Crop Recommendation</h1>
            <p>
              Enter your soil and weather data to get AI-powered crop recommendations.
            </p>
          </div>
          
          {/* Main Content Area */}
          <div className="main-grid">
            {/* Form Section */}
            <div className="card">
              <CropForm onPredict={getPredictions} loading={loading} />
            </div>
            
            {/* Results Section */}
            <div className="card results-card">
              {/* --- MODIFICATION --- */}
              {/* Pass the inputs prop down to Results */}
              <Results 
                predictions={predictions} 
                loading={loading} 
                error={error}
                inputs={currentInputs} 
              />
              {/* --- END OF MODIFICATION --- */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;