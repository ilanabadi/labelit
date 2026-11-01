import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { UnitMode, LabelDimensions } from '../types';
import { calculateLabelGeometry } from '../utils/labelMath';
import { LabelPdfDocument } from './LabelPdfDocument';
import { LargeSizeWarning } from './LargeSizeWarning';

interface PreviewCardProps {
  dimensions: LabelDimensions;
  unit: UnitMode;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ dimensions, unit }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showLargeSizeWarning, setShowLargeSizeWarning] = useState(false);

  // Compute exact mathematical frustum geometry & SVG path string
  const calc = calculateLabelGeometry(dimensions);

  // Handle in-memory PDF generation & instant browser Blob download
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);

      const blob = await pdf(
        <LabelPdfDocument dimensions={dimensions} unit={unit} calc={calc} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Use the actual bounding dimensions of the label for the downloaded PDF file name
      link.download = `LABELIT_CutLine_${calc.labelWidth.toFixed(1)}x${calc.labelHeight.toFixed(1)}_${unit}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up Blob memory
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Check if dimensions exceed the safe threshold before generating PDF
  const handleDownloadClick = () => {
    const maxDimension = unit === 'in' ? 190 : 4826;
    if (calc.labelWidth > maxDimension || calc.labelHeight > maxDimension) {
      setShowLargeSizeWarning(true);
    } else {
      handleDownloadPdf();
    }
  };

  return (
    <div className="card-labelit p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <h2 className="h5 mb-0 text-white fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-aspect-ratio text-success"></i> Cut Line Visualizer
          </h2>
          <span className="badge badge-emerald-subtle">
            Live Preview
          </span>
        </div>

        {/* Real-Time Calculated SVG Viewport */}
        <div className="svg-viewport-card bg-black rounded-3 p-3 text-center mb-4 d-flex align-items-center justify-content-center">
          <svg viewBox={calc.viewBox} width="100%" height="240px" xmlns="http://www.w3.org/2000/svg">
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="-1000" y="-1000" width="2000" height="2000" fill="url(#grid)" />

            {/* Calculated Cut Line Path */}
            <path
              d={calc.svgPathData}
              fill="rgba(19, 164, 56, 0.15)"
              stroke="#13a438"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Quick Specs Summary */}
        <div className="bg-dark bg-opacity-50 p-3 rounded-3 border border-secondary border-opacity-25 mb-4">
          <h6 className="text-success fw-bold mb-2 fs-7 text-uppercase d-flex align-items-center justify-content-between">
            <span>
              <i className="bi bi-card-checklist me-1"></i> Cut Line Summary
            </span>
            <span className="text-white fw-semibold">
              {calc.labelWidth.toFixed(1)} × {calc.labelHeight.toFixed(1)} {unit}
            </span>
          </h6>
          <div className="row g-2 fs-7 text-muted-dark">
            <div className="col-6">
              <span>Top ({dimensions.topMode}):</span>{' '}
              <strong className="text-white">
                {dimensions.topDimension} {unit}
              </strong>
            </div>
            <div className="col-6">
              <span>Bottom ({dimensions.bottomMode}):</span>{' '}
              <strong className="text-white">
                {dimensions.bottomDimension} {unit}
              </strong>
            </div>
            <div className="col-6">
              <span>Slant Height:</span>{' '}
              <strong className="text-white">
                {dimensions.slantHeight} {unit}
              </strong>
            </div>
            <div className="col-6">
              <span>Margins (T / B):</span>{' '}
              <strong className="text-white">
                {dimensions.topMargin} / {dimensions.bottomMargin} {unit}
              </strong>
            </div>
            <div className="col-6">
              <span>Top Arc Radius:</span>{' '}
              <strong className="text-white">
                {calc.topArcRadius.toFixed(1)} {unit}
              </strong>
            </div>
            <div className="col-6">
              <span>Bottom Arc Radius:</span>{' '}
              <strong className="text-white">
                {calc.bottomArcRadius.toFixed(1)} {unit}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Action Download PDF Button */}
      <div>
        <button
          type="button"
          className="btn btn-emerald w-100 py-3 fs-5 d-flex align-items-center justify-content-center gap-2 shadow"
          onClick={handleDownloadClick}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Compiling PDF...</span>
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-pdf-fill fs-4"></i>
              <span>Download PDF Cut Line</span>
            </>
          )}
        </button>
        <div className="text-center mt-2">
          <small className="text-muted-dark fs-8">
            <i className="bi bi-shield-check text-success me-1"></i>
            Generates high-precision PDF template
          </small>
        </div>
      </div>

      {/* Large Size Warning Modal */}
      <LargeSizeWarning
        isOpen={showLargeSizeWarning}
        width={calc.labelWidth}
        height={calc.labelHeight}
        unit={unit}
        onCancel={() => setShowLargeSizeWarning(false)}
        onContinue={() => {
          setShowLargeSizeWarning(false);
          handleDownloadPdf();
        }}
      />
    </div>
  );
};
