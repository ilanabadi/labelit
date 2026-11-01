import * as React from "react";
import { Svg, Path, Circle } from "@react-pdf/renderer";

interface LogoProps {
  width?: number | string;
  height?: number | string;
  style?: any;
}

const LabelItIconLogo = ({ width = 60, height = "auto", style }: LogoProps) => (
  <Svg
    viewBox="0 0 90.7 97.7"
    style={[style, { width, height }]}
  >
    {/* First Accent Path (Right Side) */}
    <Path
      fill="#13A438"
      d="M66,77.4l-17.3-3.5c-1.3,0-2.8-1.1-3.2-2.4c-0.4-1.3,0.3-2.4,1.7-2.4l16.1-0.4c1.6,0,3.8,2.7,4.3,4.3C68.1,74.6,67.6,77.4,66,77.4z"
    />
    
    {/* Second Accent Path (Left Side) */}
    <Path
      fill="#13A438"
      d="M18,24.9L2.4,33.1C1.1,33.4,0,34.9,0,36.3c0,1.4,1,2.2,2.3,1.9L17.9,34c1.6-0.4,2.9-3.7,2.9-5.4C20.8,27,19.6,24.4,18,24.9z"
    />
    
    {/* Main Icon Body Path */}
    <Path
      fill="#13A438"
      d="M80.6,78.7c-0.1-0.2-0.2-0.3-0.3-0.5c-3.9-3.8-13.5-14.3-18.5-22.2c-7.7-12.2-7.6-15-8.2-19.8c-0.2-1.8-1.5-4.2-6-3.7c-7.5,0.9-8.2,3.7-8.2,3.9c-1.2,5.2-7.8,20.9-13.9,27.8c-2.2,2.4-4.3,3.8-6.4,3.1c0,0-0.1,0-0.1,0c-0.9-0.7-1.4-2-1.7-3.7c-0.8-6.5,2.8-19.1,5.7-25.6c0.5-1.2,6.8-14.9,8.4-17.8c0-0.2,0.1-0.4,0.2-0.6c0.2-2.8-4.6-5.4-7.5-5c-0.6,0.1-1.2,0.4-1.6,0.8c0,0-9.5,16.6-12.2,22.3C5.2,48.2-8.5,82.9,15.2,84.4C24.3,85,31.5,78.9,35.7,74c3.9-4.5,7.3-12,9.9-19.4C51.8,66.3,73,85.2,73,85.2c0.5,0.3,1.2,0.4,1.8,0.4C77.7,85.2,81.5,81.4,80.6,78.7z"
    />
    
    {/* Top Dot */}
    <Circle cx={31.7} cy={6.4} r={6.4} fill="#13A438" />
    
    {/* Bottom Dot */}
    <Circle cx={84.3} cy={91.3} r={6.4} fill="#13A438" />
  </Svg>
);

export default LabelItIconLogo;
