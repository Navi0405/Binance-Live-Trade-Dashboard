import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function your_account() {
  const [balances, setBalances] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Fetch wallet and margin balances
    axios.get('http://localhost:3001/api/balances')
      .then(response => setBalances(response.data.walletBalance))
      .catch(error => console.error(error));

    // Fetch open positions with PnL and ROI
    axios.get('http://localhost:3001/api/positions')
      .then(response => setPositions(response.data.openPositions))
      .catch(error => console.error(error));
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: positions.map(position => position.symbol),
    datasets: [
      {
        label: 'PnL',
        data: positions.map(position => position.pnl),
        backgroundColor: positions.map(position => position.pnl > 0 ? 'green' : 'red'),
        borderColor: positions.map(position => position.pnl > 0 ? 'darkgreen' : 'darkred'),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y', // Makes the chart horizontal
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const position = positions[context.dataIndex];
            return [
              `PnL: ${position.pnl}`,
              `ROI: ${position.roiPercentage}%`,
              `Position Amount: ${position.positionAmt}`,
              `Entry Price: ${position.entryPrice}`,
              `Mark Price: ${position.markPrice}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div>
      <h1>company 2</h1>

      <section>
        <h2>Open Positions</h2>
        <Bar data={chartData} options={chartOptions} width={800} height={400}/>
      </section>
    </div>
  );
}

export default your_account;
