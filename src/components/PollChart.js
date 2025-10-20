import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PollChart({ poll, type = 'pie' }) {
  const data = {
    labels: poll.options.map(opt => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map(opt => opt.votes),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      {type === 'pie' ? (
        <Pie data={data} options={options} />
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}

export default PollChart;
