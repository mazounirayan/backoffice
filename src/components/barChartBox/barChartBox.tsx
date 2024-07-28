// components/barChartBox/BarChartBox.tsx
import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ChartConfiguration, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface BarChartBoxProps {
  data: ChartConfiguration<'bar'>['data'];
  options?: ChartConfiguration<'bar'>['options'];
}

const BarChartBox: React.FC<BarChartBoxProps> = ({ data, options }) => {
  const chartRef = useRef<ChartJS<'bar'> | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Bar ref={chartRef} data={data} options={options} />;
};

export default BarChartBox;
