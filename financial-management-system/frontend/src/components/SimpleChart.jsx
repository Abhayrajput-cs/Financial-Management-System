import React from 'react';
import './SimpleChart.css';

// Simple chart component for basic data visualization
const SimpleChart = ({ data, type = 'bar', title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  const renderBarChart = () => (
    <div className="bar-chart" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="bar-item">
          <div 
            className="bar"
            style={{ 
              height: `${(item.value / maxValue) * 80}%`,
              backgroundColor: item.color || '#3498db'
            }}
            title={`${item.label}: ${item.value}`}
          />
          <span className="bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="pie-chart-container">
        <svg width={height} height={height} className="pie-chart">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = height/2 + (height/2 - 10) * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = height/2 + (height/2 - 10) * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = height/2 + (height/2 - 10) * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = height/2 + (height/2 - 10) * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${height/2} ${height/2}`,
              `L ${x1} ${y1}`,
              `A ${height/2 - 10} ${height/2 - 10} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || `hsl(${index * 60}, 70%, 60%)`}
                stroke="white"
                strokeWidth="2"
                title={`${item.label}: ${percentage.toFixed(1)}%`}
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 60%)` }}
              />
              <span className="legend-label">
                {item.label}: {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      {type === 'pie' ? renderPieChart() : renderBarChart()}
    </div>
  );
};

export default SimpleChart;
