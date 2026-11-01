import React, { useState } from 'react';
import { DimensionType } from '../types';

interface InputFieldProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (val: number) => void;
  unit: string;
  gifSrc: string;
  gifDescription: string;
  placeholder?: string;
  step?: string;
  min?: number;
  max?: number;
  // Optional mode selector for Top and Bottom fields
  mode?: DimensionType;
  onModeChange?: (mode: DimensionType) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  unit,
  gifSrc,
  gifDescription,
  placeholder = '0',
  step = '0.1',
  min = 0,
  max,
  mode,
  onModeChange,
}) => {
  const [showHelper, setShowHelper] = useState(false);

  return (
    <div className="mb-4">
      {/* Line 1: Header Line (Input's Label and Show Me button) */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <label htmlFor={id} className="form-label-custom mb-0">
          {label}
        </label>

        <button
          type="button"
          className={`btn-show-me flex-shrink-0 ${showHelper ? 'active' : ''}`}
          onClick={() => setShowHelper(!showHelper)}
        >
          {showHelper ? (
            <>
              <i className="bi bi-eye-slash-fill me-1"></i>Hide
            </>
          ) : (
            <>
              <i className="bi bi-eye-fill me-1"></i>Show Me
            </>
          )}
        </button>
      </div>

      {/* Line 2: Mode Selector Pill Toggle */}
      {mode && onModeChange && (
        <div className="mb-2">
          <div className="pill-toggle-group pill-toggle-group-sm">
            <button
              type="button"
              className={`pill-toggle-btn pill-toggle-btn-sm ${mode === 'circumference' ? 'active' : ''}`}
              onClick={() => onModeChange('circumference')}
            >
              Circumference
            </button>
            <button
              type="button"
              className={`pill-toggle-btn pill-toggle-btn-sm ${mode === 'diameter' ? 'active' : ''}`}
              onClick={() => onModeChange('diameter')}
            >
              Diameter
            </button>
          </div>
        </div>
      )}

      {/* Line 3: Input Field with Unit Badge */}
      <div className="input-group input-group-custom">
        <input
          type="number"
          id={id}
          className="form-control"
          value={value === '' ? '' : value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? 0 : parseFloat(val));
          }}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
        />
        <span className="input-group-text">{unit}</span>
      </div>

      {/* Collapsible Helper GIF Card */}
      {showHelper && (
        <div className="gif-helper-card text-center">
          <div className="d-flex justify-content-center mb-2">
            <img
              src={`/images/${gifSrc}`}
              alt={label}
              className="gif-helper-img"
              onError={(e) => {
                console.warn(`Could not load GIF: /images/${gifSrc}`);
              }}
            />
          </div>
          <p className="small text-muted-dark mb-0">
            <i className="bi bi-info-circle me-1 text-success"></i>
            {gifDescription}
          </p>
        </div>
      )}
    </div>
  );
};
