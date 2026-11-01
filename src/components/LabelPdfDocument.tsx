import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Svg,
  Path,
  Line,
  StyleSheet,
} from '@react-pdf/renderer';
import { LabelDimensions, UnitMode, CalculationResult } from '../types';
import LabelItLogo from './Logo';
import LabelItIconLogo from './IaLogo';

interface LabelPdfDocumentProps {
  dimensions: LabelDimensions;
  unit: UnitMode;
  calc: CalculationResult;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#13a438',
    paddingBottom: 8,
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  creatorText: {
    fontSize: 9,
    color: '#4b5563',
  },
  scaleNotice: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#13a438',
    backgroundColor: '#e8f7ec',
    padding: '4 8',
    borderRadius: 4,
  },
  summaryBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#6b7280',
  },
  value: {
    fontWeight: 'bold',
    color: '#111827',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  rulerBox: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  rulerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  rulerNotice: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 4,
  },
});

export const LabelPdfDocument: React.FC<LabelPdfDocumentProps> = ({
  dimensions,
  unit,
  calc,
}) => {
  // Conversion factors:
  // 1 mm in PDF points = 72 / 25.4 = 2.8346457 pt
  // 1 inch in PDF points = 72 pt
  const mmToPt = 72 / 25.4;
  const unitToPt = unit === 'in' ? 72 : mmToPt;

  // Actual label bounding dimensions in PDF points (1:1 true scale)
  const labelWidthPt = calc.boundingBox.width * unitToPt;
  const labelHeightPt = calc.boundingBox.height * unitToPt;

  // Padding / Bleed for SVG cut line stroke thickness
  // Expanding both the viewBox and the rendered SVG dimensions by the exact same
  // margin preserves true 1:1 physical print scale while ensuring the stroke
  // thickness is never clipped by the edge of the viewport.
  const strokeBleedPt = 5; // 5 pt (~1.76 mm) margin on all sides
  const strokeBleedUnits = strokeBleedPt / unitToPt;
  const svgViewBoxMinX = calc.boundingBox.minX - strokeBleedUnits;
  const svgViewBoxMinY = calc.boundingBox.minY - strokeBleedUnits;
  const svgViewBoxWidth = calc.boundingBox.width + 2 * strokeBleedUnits;
  const svgViewBoxHeight = calc.boundingBox.height + 2 * strokeBleedUnits;
  const svgWidthPt = svgViewBoxWidth * unitToPt; // = labelWidthPt + 2 * strokeBleedPt
  const svgHeightPt = svgViewBoxHeight * unitToPt; // = labelHeightPt + 2 * strokeBleedPt

  // Margin allowances in points:
  // Top padding: ~85 mm (for header, logo, specs summary box)
  // Bottom padding: ~45 mm (for calibration ruler, notes, instructions)
  // Side padding: ~12 mm on each side
  const padTopPt = 85 * mmToPt;
  const padBottomPt = 45 * mmToPt;
  const padSidePt = 12 * mmToPt;

  // Dynamic custom page size adapting to actual label size
  // Minimum width is 200 mm (~567 pt) so header & summary box display comfortably
  const minPageWidthPt = 200 * mmToPt;
  const pageWidthPt = Math.max(minPageWidthPt, svgWidthPt + padSidePt * 2);
  const pageHeightPt = svgHeightPt + padTopPt + padBottomPt;

  // Ruler setup: 50mm (or 2 inches)
  const isInch = unit === 'in';
  const rulerPt = isInch ? 2 * 72 : 50 * mmToPt;

  return (
    <Document title="LABELIT Cut Line Template" author="LABELIT">
      <Page
        size={{ width: pageWidthPt, height: pageHeightPt }}
        style={[styles.page, { paddingHorizontal: padSidePt, paddingTop: 16, paddingBottom: 16 }]}
        wrap={false}
      >
        {/* Header with SVG Logo and Creator Brand */}
        <View style={styles.header} wrap={false}>
          <View style={styles.titleGroup}>
            {/* SVG Brand Logo */}
            <LabelItLogo width={95} height={50} />

            {/* Creator line: "By Ilan Abadi" + IaLogo + "Creating. Always." */}
            <View style={styles.creatorRow}>
              <Text style={[styles.creatorText, { marginRight: 4 }]}>By Ilan Abadi</Text>
              <LabelItIconLogo width={13} height={14} style={{ marginRight: 4 }} />
              <Text style={styles.creatorText}>Creating. Always.</Text>
            </View>
          </View>

          <View>
            <Text style={styles.scaleNotice}>1:1 SCALE PRINT READY</Text>
          </View>
        </View>

        {/* Specifications Summary */}
        <View style={styles.summaryBox} wrap={false}>
          <Text style={styles.summaryTitle}>Container & Label Specs Summary</Text>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Top ({dimensions.topMode}):</Text>
              <Text style={styles.value}>
                {dimensions.topDimension} {unit}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Bottom ({dimensions.bottomMode}):</Text>
              <Text style={styles.value}>
                {dimensions.bottomDimension} {unit}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Slant Height:</Text>
              <Text style={styles.value}>
                {dimensions.slantHeight} {unit}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Wrap Coverage:</Text>
              <Text style={styles.value}>{dimensions.coverPercentage}%</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Top / Bottom Margins:</Text>
              <Text style={styles.value}>
                {dimensions.topMargin} / {dimensions.bottomMargin} {unit}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Actual Dimensions (W × H):</Text>
              <Text style={styles.value}>
                {calc.labelWidth.toFixed(1)} × {calc.labelHeight.toFixed(1)} {unit}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Top Arc Radius:</Text>
              <Text style={styles.value}>
                {calc.topArcRadius.toFixed(1)} {unit}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Bottom Arc Radius:</Text>
              <Text style={styles.value}>
                {calc.bottomArcRadius.toFixed(1)} {unit}
              </Text>
            </View>
          </View>
        </View>

        {/* SVG Cut Line Graphic at Exact 1:1 Scale */}
        <View style={styles.visualizerContainer} wrap={false}>
          <Svg
            viewBox={`${svgViewBoxMinX} ${svgViewBoxMinY} ${svgViewBoxWidth} ${svgViewBoxHeight}`}
            width={svgWidthPt}
            height={svgHeightPt}
          >
            {/* Cut Line Path */}
            <Path
              d={calc.svgPathData}
              fill="none"
              stroke="#13a438"
              strokeWidth={1.5 / unitToPt}
            />
          </Svg>
        </View>

        {/* Physical Print Calibration Ruler */}
        <View style={styles.rulerBox} wrap={false}>
          <Text style={styles.rulerTitle}>
            1:1 Print Calibration Check Ruler ({isInch ? '2.0 inches' : '50 mm'})
          </Text>

          <Svg width={rulerPt + 20} height={30} viewBox={`-10 0 ${rulerPt + 20} 30`}>
            {/* Base Line */}
            <Line x1={0} y1={15} x2={rulerPt} y2={15} stroke="#13a438" strokeWidth={1.5} />

            {/* 0 Tick */}
            <Line x1={0} y1={5} x2={0} y2={20} stroke="#13a438" strokeWidth={1.5} />

            {isInch ? (
              <>
                <Line x1={0.5 * 72} y1={10} x2={0.5 * 72} y2={18} stroke="#13a438" strokeWidth={1} />
                <Line x1={1.0 * 72} y1={8} x2={1.0 * 72} y2={20} stroke="#13a438" strokeWidth={1.2} />
                <Line x1={1.5 * 72} y1={10} x2={1.5 * 72} y2={18} stroke="#13a438" strokeWidth={1} />
              </>
            ) : (
              <>
                <Line x1={10 * mmToPt} y1={10} x2={10 * mmToPt} y2={18} stroke="#13a438" strokeWidth={1} />
                <Line x1={20 * mmToPt} y1={10} x2={20 * mmToPt} y2={18} stroke="#13a438" strokeWidth={1} />
                <Line x1={30 * mmToPt} y1={10} x2={30 * mmToPt} y2={18} stroke="#13a438" strokeWidth={1} />
                <Line x1={40 * mmToPt} y1={10} x2={40 * mmToPt} y2={18} stroke="#13a438" strokeWidth={1} />
              </>
            )}

            {/* End Tick */}
            <Line x1={rulerPt} y1={5} x2={rulerPt} y2={20} stroke="#13a438" strokeWidth={1.5} />
          </Svg>

          <Text style={styles.rulerNotice}>
            IMPORTANT: Set printer scale to "Actual Size" or "100%". Verify accuracy with a physical ruler.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
