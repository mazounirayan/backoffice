// components/pieChartBox/PieChartBox.tsx
import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ChartConfiguration, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface PieChartBoxProps {
  data: ChartConfiguration<'pie'>['data'];
  options?: ChartConfiguration<'pie'>['options'];
}

const PieChartBox: React.FC<PieChartBoxProps> = ({ data, options }) => {
  const chartRef = useRef<ChartJS<'pie'> | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Pie ref={chartRef} data={data} options={options} />;
};

export default PieChartBox;
