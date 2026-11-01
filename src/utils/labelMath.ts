import { LabelDimensions, CalculationResult } from '../types';

export function calculateLabelGeometry(dim: LabelDimensions): CalculationResult {
  // 1. Calculate Top and Bottom Circumferences based on mode
  const topCircumference =
    dim.topMode === 'diameter' ? dim.topDimension * Math.PI : dim.topDimension;
  const bottomCircumference =
    dim.bottomMode === 'diameter' ? dim.bottomDimension * Math.PI : dim.bottomDimension;

  const topRadius = topCircumference / (2 * Math.PI);
  const bottomRadius = bottomCircumference / (2 * Math.PI);
  const slantHeight = Math.max(1, dim.slantHeight);
  const labelTopMargin = Math.max(0, dim.topMargin);
  const labelBottomMargin = Math.max(0, dim.bottomMargin);
  const labelSlantHeight = Math.max(1, slantHeight - labelTopMargin - labelBottomMargin);
  const coverPercentage = Math.min(100, Math.max(1, dim.coverPercentage));

  // Check if surface is cylindrical (top and bottom equal)
  const radiusDiff = Math.abs(topRadius - bottomRadius);
  const isCylinder = radiusDiff < 0.001;

  if (isCylinder) {
    const labelWidth = topCircumference * (coverPercentage / 100);
    const labelHeight = labelSlantHeight;

    const minX = -labelWidth / 2;
    const maxX = labelWidth / 2;
    const minY = 0;
    const maxY = labelHeight;
    const pad = Math.max(20, labelWidth * 0.05);

    const svgPathData = `M ${minX.toFixed(3)} 0 L ${maxX.toFixed(3)} 0 L ${maxX.toFixed(3)} ${labelHeight.toFixed(3)} L ${minX.toFixed(3)} ${labelHeight.toFixed(3)} Z`;

    return {
      topCircumference,
      bottomCircumference,
      topRadius,
      bottomRadius,
      labelSlantHeight,
      outerRadius: topRadius,
      innerRadius: bottomRadius,
      topArcRadius: topRadius,
      bottomArcRadius: bottomRadius,
      isTopLarger: true,
      sweepAngleDeg: 0,
      sweepAngleRad: 0,
      svgPathData,
      isCylinder: true,
      labelWidth,
      labelHeight,
      boundingBox: {
        width: labelWidth,
        height: labelHeight,
        minX,
        minY,
        maxX,
        maxY,
      },
      viewBox: `${(minX - pad).toFixed(1)} ${-pad.toFixed(1)} ${(labelWidth + pad * 2).toFixed(1)} ${(labelHeight + pad * 2).toFixed(1)}`,
    };
  }

  // Frustum of a right circular cone
  const isTopLarger = topRadius > bottomRadius;

  let R_top_arc: number;
  let R_bottom_arc: number;

  if (isTopLarger) {
    // Top is larger -> Cone narrows downwards towards bottom apex.
    // Apex distance to container top edge:
    const L_top = (topRadius * slantHeight) / (topRadius - bottomRadius);
    // Label top arch is further from apex (outer arch)
    R_top_arc = L_top - labelTopMargin;
    // Label bottom arch is closer to apex (inner arch)
    R_bottom_arc = R_top_arc - labelSlantHeight;
  } else {
    // Bottom is larger -> Cone narrows upwards towards top apex.
    // Apex distance to container top edge:
    const L_top = (topRadius * slantHeight) / (bottomRadius - topRadius);
    // Label top arch is closer to apex (inner arch)
    R_top_arc = L_top + labelTopMargin;
    // Label bottom arch is further from apex (outer arch)
    R_bottom_arc = R_top_arc + labelSlantHeight;
  }

  // Sweep angle calculation
  const m = (topRadius - bottomRadius) / slantHeight;
  const r_top_label = topRadius - m * labelTopMargin;
  const r_bottom_label = bottomRadius + m * labelBottomMargin;

  const sweepAngleDeg = 360 * (coverPercentage / 100) * (Math.abs(r_top_label - r_bottom_label) / labelSlantHeight);
  const sweepAngleRad = sweepAngleDeg * (Math.PI / 180);
  const halfSweepRad = sweepAngleRad / 2;

  const largeArcFlag = sweepAngleDeg > 180 ? 1 : 0;

  let x_tl: number;
  let y_tl: number;
  let x_tr: number;
  let y_tr: number;
  let x_br: number;
  let y_br: number;
  let x_bl: number;
  let y_bl: number;

  let minY: number;
  let maxY: number;
  let minX: number;
  let maxX: number;

  if (isTopLarger) {
    // RAINBOW SHAPE (∩): arches curve upwards.
    // Top arch is larger (outer). Center of curvature is below.
    // Let apex center be at (0, R_top_arc) so that top crest is at (0, 0).
    const Y_center = R_top_arc;

    // Top arch endpoints (Left to Right)
    x_tl = -R_top_arc * Math.sin(halfSweepRad);
    y_tl = Y_center - R_top_arc * Math.cos(halfSweepRad);

    x_tr = R_top_arc * Math.sin(halfSweepRad);
    y_tr = Y_center - R_top_arc * Math.cos(halfSweepRad);

    // Bottom arch endpoints (Right to Left)
    x_br = R_bottom_arc * Math.sin(halfSweepRad);
    y_br = Y_center - R_bottom_arc * Math.cos(halfSweepRad);

    x_bl = -R_bottom_arc * Math.sin(halfSweepRad);
    y_bl = Y_center - R_bottom_arc * Math.cos(halfSweepRad);

    // Bounds
    minY = 0; // Top crest
    maxY = Math.max(y_bl, y_br, Y_center - R_bottom_arc);
    const maxHalfWidth = sweepAngleDeg > 180 ? R_top_arc : R_top_arc * Math.sin(halfSweepRad);
    minX = -maxHalfWidth;
    maxX = maxHalfWidth;
  } else {
    // SMILE SHAPE (∪): arches curve downwards.
    // Bottom arch is larger (outer). Center of curvature is above.
    // Let apex center be at (0, -R_top_arc) so that top trough is at (0, 0).
    const Y_center = -R_top_arc;

    // Top arch endpoints (Left to Right)
    x_tl = -R_top_arc * Math.sin(halfSweepRad);
    y_tl = Y_center + R_top_arc * Math.cos(halfSweepRad);

    x_tr = R_top_arc * Math.sin(halfSweepRad);
    y_tr = Y_center + R_top_arc * Math.cos(halfSweepRad);

    // Bottom arch endpoints (Right to Left)
    x_br = R_bottom_arc * Math.sin(halfSweepRad);
    y_br = Y_center + R_bottom_arc * Math.cos(halfSweepRad);

    x_bl = -R_bottom_arc * Math.sin(halfSweepRad);
    y_bl = Y_center + R_bottom_arc * Math.cos(halfSweepRad);

    // Bounds
    minY = Math.min(y_tl, y_tr, 0);
    maxY = labelSlantHeight; // Bottom trough at x=0
    const maxHalfWidth = sweepAngleDeg > 180 ? R_bottom_arc : R_bottom_arc * Math.sin(halfSweepRad);
    minX = -maxHalfWidth;
    maxX = maxHalfWidth;
  }

  // Sweep-flag dynamically adapts based on whether top or bottom is larger:
  // Since top arch travels Left-to-Right and bottom arch travels Right-to-Left,
  // their angular travel directions around the cone's apex are opposite:
  // - When Top is larger (Rainbow ∩, apex below): Top arc is Clockwise (1), Bottom arc is Counter-Clockwise (0).
  // - When Top is smaller (Smile ∪, apex above): Top arc is Counter-Clockwise (0), Bottom arc is Clockwise (1).
  const sweepFlagTop = isTopLarger ? 1 : 0;
  const sweepFlagBottom = isTopLarger ? 0 : 1;

  // Consistent path direction:
  // Top arch: from Top-Left to Top-Right
  // Right side: from Top-Right down to Bottom-Right
  // Bottom arch: from Bottom-Right to Bottom-Left
  // Left side: from Bottom-Left up to Top-Left (Z)
  const svgPathData = `M ${x_tl.toFixed(3)} ${y_tl.toFixed(3)} A ${R_top_arc.toFixed(3)} ${R_top_arc.toFixed(3)} 0 ${largeArcFlag} ${sweepFlagTop} ${x_tr.toFixed(3)} ${y_tr.toFixed(3)} L ${x_br.toFixed(3)} ${y_br.toFixed(3)} A ${R_bottom_arc.toFixed(3)} ${R_bottom_arc.toFixed(3)} 0 ${largeArcFlag} ${sweepFlagBottom} ${x_bl.toFixed(3)} ${y_bl.toFixed(3)} Z`;

  // Real Label Dimensions:
  // Outer and inner arch radii of the label:
  const R_outer_arch = isTopLarger ? R_top_arc : R_bottom_arc;
  const R_inner_arch = isTopLarger ? R_bottom_arc : R_top_arc;

  // 1. Real label width = chord length of the larger arch:
  // 2 * (Radius of the outer arch of the label) * sin(half of the sweep angle)
  const labelWidth = 2 * R_outer_arch * Math.sin(halfSweepRad);

  // 2. Real label height =
  // (Radius of the outer arch of the label) - ((Radius of the inner arch of the label) * cos(half of the sweep angle))
  const labelHeight = R_outer_arch - R_inner_arch * Math.cos(halfSweepRad);

  const width = maxX - minX;
  const height = maxY - minY;
  const padX = Math.max(20, width * 0.1);
  const padY = Math.max(20, height * 0.1);

  const viewBox = `${(minX - padX).toFixed(1)} ${(minY - padY).toFixed(1)} ${(width + padX * 2).toFixed(1)} ${(height + padY * 2).toFixed(1)}`;

  return {
    topCircumference,
    bottomCircumference,
    topRadius,
    bottomRadius,
    labelSlantHeight,
    outerRadius: Math.max(R_top_arc, R_bottom_arc),
    innerRadius: Math.min(R_top_arc, R_bottom_arc),
    topArcRadius: R_top_arc,
    bottomArcRadius: R_bottom_arc,
    isTopLarger,
    sweepAngleDeg,
    sweepAngleRad,
    svgPathData,
    isCylinder: false,
    labelWidth,
    labelHeight,
    boundingBox: {
      width,
      height,
      minX,
      minY,
      maxX,
      maxY,
    },
    viewBox,
  };
}
