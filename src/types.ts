export type UnitMode = 'mm' | 'in';
export type DimensionType = 'circumference' | 'diameter';

export interface LabelDimensions {
  topMode: DimensionType;
  topDimension: number;
  bottomMode: DimensionType;
  bottomDimension: number;
  slantHeight: number;
  topMargin: number;
  bottomMargin: number;
  coverPercentage: number;
}

export interface CalculationResult {
  topCircumference: number;
  bottomCircumference: number;
  topRadius: number;
  bottomRadius: number;
  labelSlantHeight: number;
  outerRadius: number;
  innerRadius: number;
  topArcRadius: number;
  bottomArcRadius: number;
  isTopLarger: boolean;
  sweepAngleDeg: number;
  sweepAngleRad: number;
  svgPathData: string;
  isCylinder: boolean;
  labelWidth: number;
  labelHeight: number;
  boundingBox: {
    width: number;
    height: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  viewBox: string;
}
