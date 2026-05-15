import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');

  return d;
};

const PieChart = ({ size = 120, width = 20, data = [] }) => {
  const total = data.reduce((s, item) => s + item.value, 0) || 1;
  let startAngle = 0;
  const center = size / 2;
  const radius = center - width / 2;

  return (
    <View>
      <Svg width={size} height={size}>
        <G rotation={0} originX={center} originY={center}>
          {data.map((slice, idx) => {
            const valueAngle = (slice.value / total) * 360;
            const endAngle = startAngle + valueAngle;
            const path = describeArc(center, center, radius, startAngle, endAngle);
            startAngle = endAngle;
            return <Path key={idx} d={path} stroke={slice.color} strokeWidth={width} fill="none" strokeLinecap="butt" />;
          })}
        </G>
      </Svg>
    </View>
  );
};

export default PieChart;
