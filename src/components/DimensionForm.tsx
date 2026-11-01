import React from 'react';
import { InputField } from './InputField';
import { UnitMode, DimensionType, LabelDimensions } from '../types';

interface DimensionFormProps {
  dimensions: LabelDimensions;
  setDimensions: React.Dispatch<React.SetStateAction<LabelDimensions>>;
  unit: UnitMode;
  setUnit: (unit: UnitMode) => void;
}

export const DimensionForm: React.FC<DimensionFormProps> = ({
  dimensions,
  setDimensions,
  unit,
  setUnit,
}) => {
  const updateField = (field: keyof LabelDimensions, value: any) => {
    setDimensions((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card-labelit p-4 h-100">
      {/* Form Title & Measurement Unit Selector */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom border-secondary border-opacity-25">
        <h2 className="h5 mb-0 text-white fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-sliders text-success"></i> Container & Label Dimensions
        </h2>

        {/* Measurement Unit Selector */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted-dark fs-7 fw-semibold">
            Measurement Unit:
          </span>
          <div className="pill-toggle-group">
            <button
              type="button"
              className={`pill-toggle-btn ${unit === 'mm' ? 'active' : ''}`}
              onClick={() => setUnit('mm')}
            >
              mm
            </button>
            <button
              type="button"
              className={`pill-toggle-btn ${unit === 'in' ? 'active' : ''}`}
              onClick={() => setUnit('in')}
            >
              inches
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark bg-opacity-50 p-3 rounded-3 border border-secondary border-opacity-25 mb-4">
        <p className="small text-muted-dark mb-0">
          <i className="bi bi-info-circle-fill text-success me-2"></i>
          <strong>Measuring Tip:</strong> Depending on your container's shape—like a bucket where measuring the top opening diameter is easy, or a tapered bottle where measuring the outer circumference is simpler—you can choose <strong>Diameter</strong> or <strong>Circumference</strong> independently for the top and bottom measurements.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          {/* Top Dimension with Independent Mode Switch */}
          <div className="col-md-6">
            <InputField
              id="topDimension"
              label={dimensions.topMode === 'circumference' ? 'Top Circumference' : 'Top Diameter'}
              value={dimensions.topDimension}
              onChange={(val) => updateField('topDimension', val)}
              unit={unit}
              mode={dimensions.topMode}
              onModeChange={(mode: DimensionType) => updateField('topMode', mode)}
              gifSrc={dimensions.topMode === 'circumference' ? 'DTop.gif' : 'TopRad.gif'}
              gifDescription={
                dimensions.topMode === 'circumference'
                  ? 'Measure the perimeter around the outer top edge of the container.'
                  : 'Measure the diameter of the top circular face of the container.'
              }
            />
          </div>

          {/* Bottom Dimension with Independent Mode Switch */}
          <div className="col-md-6">
            <InputField
              id="bottomDimension"
              label={dimensions.bottomMode === 'circumference' ? 'Bottom Circumference' : 'Bottom Diameter'}
              value={dimensions.bottomDimension}
              onChange={(val) => updateField('bottomDimension', val)}
              unit={unit}
              mode={dimensions.bottomMode}
              onModeChange={(mode: DimensionType) => updateField('bottomMode', mode)}
              gifSrc={dimensions.bottomMode === 'circumference' ? 'Dbottom.gif' : 'BottomRad.gif'}
              gifDescription={
                dimensions.bottomMode === 'circumference'
                  ? 'Measure the perimeter around the outer bottom edge of the container.'
                  : 'Measure the diameter of the bottom circular face of the container.'
              }
            />
          </div>
        </div>

        <div className="row">
          {/* Slant Height */}
          <div className="col-md-6">
            <InputField
              id="slantHeight"
              label="Slant Height (Side Length)"
              value={dimensions.slantHeight}
              onChange={(val) => updateField('slantHeight', val)}
              unit={unit}
              gifSrc="Side.gif"
              gifDescription="Straight-line side distance along the container from the top edge to the bottom edge."
            />
          </div>

          {/* Wrap Coverage Percentage */}
          <div className="col-md-6">
            <InputField
              id="coverPercentage"
              label="Wrap Coverage"
              value={dimensions.coverPercentage}
              onChange={(val) => updateField('coverPercentage', val)}
              unit="%"
              gifSrc="LabelCov.gif"
              gifDescription="Percentage of the total circumference covered by the label (e.g. 100% for full wrap, 50% for half)."
              min={1}
              max={100}
            />
          </div>
        </div>

        <div className="row">
          {/* Top Margin */}
          <div className="col-md-6">
            <InputField
              id="topMargin"
              label="Label Top Margin"
              value={dimensions.topMargin}
              onChange={(val) => updateField('topMargin', val)}
              unit={unit}
              gifSrc="ZoomTop.gif"
              gifDescription="Distance between the top edge of the container surface and the top edge of the label."
            />
          </div>

          {/* Bottom Margin */}
          <div className="col-md-6">
            <InputField
              id="bottomMargin"
              label="Label Bottom Margin"
              value={dimensions.bottomMargin}
              onChange={(val) => updateField('bottomMargin', val)}
              unit={unit}
              gifSrc="ZoomBottom.gif"
              gifDescription="Distance between the bottom edge of the container surface and the bottom edge of the label."
            />
          </div>
        </div>
      </form>
    </div>
  );
};
