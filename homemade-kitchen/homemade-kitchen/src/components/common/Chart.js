import React from 'react';
import { Line, Bar, Pie, LineChart, BarChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

const Chart = ({ type, data, width = '100%', height = 300 }) => {
  // Если данные отсутствуют, отображаем сообщение
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  // Функция для выбора типа графика
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width={width} height={height}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#FF6B35" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width={width} height={height}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width={width} height={height}>
            <PieChart>
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                labelLine={false}
                outerRadius={80} 
                fill="#FF6B35" 
                dataKey="value" 
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="chart-error">
            <p>Неизвестный тип графика</p>
          </div>
        );
    }
  };

  return (
    <div className="chart-container">
      {renderChart()}
    </div>
  );
};

export default Chart;