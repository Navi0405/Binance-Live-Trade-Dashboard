import React, { useEffect, useState } from 'react';
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
import '../Styles/your_account.css';

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
  const [balances, setBalances] = useState(null);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server for your_account3');
      setError(null);  // Clear the error when the connection is established
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.account === 'your_account3') {
          if (data.type === 'positions') {
            setPositions(data.positions); // Save all positions
          } else {
            setBalances({
              available: data.available,
              marginalBalance: data.marginalBalance,
              totalWalletBalance: data.totalWalletBalance,
              totalUnrealizedPnL: data.totalUnrealizedPnL,
            });
          }
        }
      } catch (e) {
        console.error('Error parsing WebSocket message', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
      setError('WebSocket connection error'); // Display error if connection fails
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  // Log the raw data to check all positions received
  useEffect(() => {
    console.log('Received positions:', positions);
  }, [positions]);

  // Filter valid positions and log them
  const validPositions = positions.filter(
    (position) => position.symbol && typeof position.pnl === 'number'
  );

  // Sort valid positions alphabetically by symbol
  const sortedPositions = validPositions.sort((a, b) => a.symbol.localeCompare(b.symbol));

  // Log sorted positions
  useEffect(() => {
    console.log('Sorted positions:', sortedPositions);
  }, [sortedPositions]);

  const chartData = {
    labels: sortedPositions.map((position) => position.symbol), // Labels for symbols
    datasets: [
      {
        label: 'PnL',
        data: sortedPositions.map((position) => position.pnl), // PnL values
        backgroundColor: sortedPositions.map((position) =>
          position.pnl < 0 ? 'rgba(255, 0, 0)' : 'rgba(0, 204, 0)'
        ), // Red for negative, Green for positive
        borderColor: sortedPositions.map((position) =>
          position.pnl < 0 ? 'rgba(255, 26, 26)' : 'rgba(75, 192, 192, 1)'
        ),
        borderWidth: 0,
      },
      {
        label: 'Take Profit (TP)',
        data: sortedPositions.map((position) => position.takeProfit || 0), // TP values
        backgroundColor: 'rgba(179, 255, 179)', // Blue color for TP
        borderWidth: 0,
      },
      {
        label: 'Stop Loss (SL)',
        data: sortedPositions.map((position) => -(position.stopLoss || 0)), // SL values as negatives
        backgroundColor: 'rgba(255, 179, 179)', // Yellow color for SL
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal stacked bar
    scales: {
      x: {
        beginAtZero: true,
        stacked: true, // Enable stacking for X-axis
      },
      y: {
        stacked: true, // Enable stacking for Y-axis
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const position = sortedPositions[context.dataIndex];
            if (context.dataset.label === 'PnL') {
              return [
                `PnL: ${position.pnl}$`,
                `ROI: ${position.roiPercentage}%`,
                `Position Amount: ${position.positionAmt}$`,
                `Entry Price: ${position.entryPrice} USDT`,
                `Mark Price: ${position.markPrice} USDT`,
                `Side: ${position.positionType}`,
              ];
            } else if (context.dataset.label === 'Take Profit (TP)') {
              return `TP: ${position.takeProfit}$`;
            } else if (context.dataset.label === 'Stop Loss (SL)') {
              return `SL: -${position.stopLoss}$`;
            }
          },
        },
      },
    },
  };
  
  return (
    <div className="container">
      <h1>your_account</h1>

      {/* WebSocket error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section className="balance-container">
        <h2>Balances</h2>
        {balances ? (
          <div>
            <p>
              <strong>Available:</strong> {balances.available}</p>
            <p>
              <strong>Marginal Balance:</strong> {balances.marginalBalance}</p>
            <p>
              <strong>Total Wallet Balance:</strong> {balances.totalWalletBalance}</p>
            <p>
              <strong>Unrealized PnL:</strong> {balances.totalUnrealizedPnL}</p>
            <p>
              <strong>Return:</strong>
            </p>
            <p>
              <strong>Winrate:</strong>
            </p>
          </div>
        ) : (
          <p>Loading balances...</p>
        )}
      </section>

      <section className="chart-container">
        <h2>Open Positions</h2>
        {sortedPositions.length > 0 ? (
          <div className="chart-wrapper">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p>Loading positions...</p>
        )}
      </section>
    </div>
  );
}

export default your_account;
