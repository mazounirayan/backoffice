// components/chartBox/ChartBox.tsx
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ChartConfiguration, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

interface ChartBoxProps {
  data: ChartConfiguration<'line'>['data'];
  options?: ChartConfiguration<'line'>['options'];
}

const ChartBox: React.FC<ChartBoxProps> = ({ data, options }) => {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Line ref={chartRef} data={data} options={options} />;
};

export default ChartBox;
