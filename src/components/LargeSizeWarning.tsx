import React from 'react';
import { UnitMode } from '../types';

interface LargeSizeWarningProps {
  isOpen: boolean;
  width: number;
  height: number;
  unit: UnitMode;
  onCancel: () => void;
  onContinue: () => void;
}

export const LargeSizeWarning: React.FC<LargeSizeWarningProps> = ({
  isOpen,
  width,
  height,
  unit,
  onCancel,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content card-labelit text-white border-secondary border-opacity-50 shadow-lg">
            <div className="modal-header border-secondary border-opacity-25 pb-3">
              <h5 className="modal-title fw-bold text-warning d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                Large Size Warning
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body py-4 text-light fs-6" style={{ lineHeight: '1.6' }}>
              <p className="mb-0">
                You are about to generate a huge label ({width.toFixed(1)} × {height.toFixed(1)} {unit}). Some programs may find this too large. We suggest you click cancel and scale down your measurements by a factor of 10. Generate the PDF. Open it in your program and scale it back up by a factor of 10. If you would like to proceed anyway, please click continue.
              </p>
            </div>
            <div className="modal-footer border-secondary border-opacity-25 pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 text-white"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-emerald px-4"
                onClick={onContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LargeSizeWarning;
