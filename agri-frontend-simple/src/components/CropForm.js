import React, { useState } from 'react';

// This component is generic and remains unchanged.
const FormInput = ({ label, value, onChange, placeholder, icon }) => (
  <div className="form-group">
    <label>
      {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      step="0.01"
      required
    />
  </div>
);

// This component is also unchanged.
const UnitToggle = ({ selectedUnit, onUnitChange }) => (
  <div className="unit-toggle-group">
    <button
      type="button"
      className={`unit-toggle-btn ${selectedUnit === 'kg/ha' ? 'active' : ''}`}
      onClick={() => onUnitChange('kg/ha')}
    >
      kg/ha
    </button>
    <button
      type="button"
      className={`unit-toggle-btn ${selectedUnit === 'g/m^2' ? 'active' : ''}`}
      onClick={() => onUnitChange('g/m^2')}
    >
      g/m²
    </button>
  </div>
);


const CropForm = ({ onPredict, loading }) => {
  const [N, setN] = useState('');
  const [P, setP] = useState('');
  const [K, setK] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [ph, setPh] = useState('');
  const [rainfall, setRainfall] = useState('');

  // State for units remains the same
  const [nUnit, setNUnit] = useState('kg/ha');
  const [pUnit, setPUnit] = useState('kg/ha');
  const [kUnit, setKUnit] = useState('kg/ha');
  
  const CONVERSION_FACTOR = 10; // 1 g/m^2 = 10 kg/ha

  // --- NEW: Generic Conversion Handler ---
  /**
   * Handles live unit conversion for an input field.
   * @param {string} newValue - The new unit ('kg/ha' or 'g/m^2')
   * @param {string} currentValue - The current value from state (e.g., N, P, or K)
   * @param {string} currentUnit - The current unit from state (e.g., nUnit, pUnit, kUnit)
   * @param {function} setValue - The state setter for the value (e.g., setN, setP, setK)
   * @param {function} setUnit - The state setter for the unit (e.g., setNUnit, setPUnit, setKUnit)
   */
  const handleUnitChange = (newUnit, currentValue, currentUnit, setValue, setUnit) => {
    // Do nothing if the unit isn't actually changing
    if (newUnit === currentUnit) {
      return;
    }

    // Get the numeric value
    const numericValue = parseFloat(currentValue);

    // If the input is empty or not a valid number,
    // just update the unit and don't try to convert.
    if (isNaN(numericValue) || currentValue.trim() === '') {
      setUnit(newUnit);
      return;
    }

    // Perform conversion
    let convertedValue;
    if (newUnit === 'kg/ha') {
      // We are switching TO kg/ha (so old unit was g/m^2)
      convertedValue = numericValue * CONVERSION_FACTOR;
    } else {
      // We are switching TO g/m^2 (so old unit was kg/ha)
      convertedValue = numericValue / CONVERSION_FACTOR;
    }

    // Update both the value and the unit states
    // Convert the new value back to a string for the input field
    // Use toPrecision to avoid floating point weirdness like 4.500000001
    setValue(String(parseFloat(convertedValue.toPrecision(10))));
    setUnit(newUnit);
  };

  // The submit handler is UNCHANGED.
  // It's still needed for users who don't toggle the unit.
  const handleSubmit = (e) => {
    e.preventDefault();

    const nValue = nUnit === 'g/m^2' ? parseFloat(N) * CONVERSION_FACTOR : parseFloat(N);
    const pValue = pUnit === 'g/m^2' ? parseFloat(P) * CONVERSION_FACTOR : parseFloat(P);
    const kValue = kUnit === 'g/m^2' ? parseFloat(K) * CONVERSION_FACTOR : parseFloat(K);

    const formData = {
      N: parseInt(nValue),
      P: parseInt(pValue),
      K: parseInt(kValue),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall),
    };
    onPredict(formData);
  };

  // No change to this style object
  const formHeaderStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '1.5rem',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 style={formHeaderStyle}>
        <span style={{ fontSize: '1.75rem' }}>🌱</span>
        Enter Soil & Climate Data
      </h2>
      <div className="form-grid">
        
        {/* --- MODIFIED: N, P, K inputs --- */}
        {/* Pass the new handler functions to onUnitChange */}

        {/* Nitrogen (N) */}
        <div className="form-group">
          <label>
            <span style={{ marginRight: '0.5rem' }}>🔬</span>
            Nitrogen (N)
          </label>
          <input
            type="number"
            value={N}
            onChange={(e) => setN(e.target.value)}
            placeholder="e.g., 90"
            step="0.01"
            required
          />
          <UnitToggle
            selectedUnit={nUnit}
            onUnitChange={(newUnit) => handleUnitChange(newUnit, N, nUnit, setN, setNUnit)}
          />
        </div>

        {/* Phosphorous (P) */}
        <div className="form-group">
          <label>
            <span style={{ marginRight: '0.5rem' }}>⚗️</span>
            Phosphorous (P)
          </label>
          <input
            type="number"
            value={P}
            onChange={(e) => setP(e.target.value)}
            placeholder="e.g., 42"
            step="0.01"
            required
          />
          <UnitToggle
            selectedUnit={pUnit}
            onUnitChange={(newUnit) => handleUnitChange(newUnit, P, pUnit, setP, setPUnit)}
          />
        </div>
        
        {/* Potassium (K) */}
        <div className="form-group">
          <label>
            <span style={{ marginRight: '0.5rem' }}>🧪</span>
            Potassium (K)
          </label>
          <input
            type="number"
            value={K}
            onChange={(e) => setK(e.target.value)}
            placeholder="e.g., 43"
            step="0.01"
            required
          />
          <UnitToggle
            selectedUnit={kUnit}
            onUnitChange={(newUnit) => handleUnitChange(newUnit, K, kUnit, setK, setKUnit)}
          />
        </div>

        {/* --- UNMODIFIED: Other inputs still use FormInput --- */}
        <FormInput label="Temperature (°C)" value={temperature} onChange={setTemperature} placeholder="e.g., 20.87" icon="🌡️" />
        <FormInput label="Humidity (%)" value={humidity} onChange={setHumidity} placeholder="e.g., 82.00" icon="💧" />
        <FormInput label="Soil pH" value={ph} onChange={setPh} placeholder="e.g., 6.50" icon="📊" />
        <FormInput label="Rainfall (mm)" value={rainfall} onChange={setRainfall} placeholder="e.g., 202.9" icon="🌧️" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="submit-button"
      >
        {loading ? (
          <>
            <span style={{ marginRight: '0.5rem' }}>⏳</span>
            Analyzing...
          </>
        ) : (
          <>
            <span style={{ marginRight: '0.5rem' }}>🚀</span>
            Get Recommendation
          </>
        )}
      </button>
    </form>
  );
};

export default CropForm;