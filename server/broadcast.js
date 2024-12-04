const WebSocket = require('ws');
// ALL ACCOUNTS
const { your_account1_balance_data } = require('./routes/your_account1_balances');
const { your_account1_position_data } = require('./routes/your_account1_positions');
const { your_account2_balance_data } = require('./routes/your_account2_balances');
const { your_account2_position_data } = require('./routes/your_account2_positions');
const { your_account3_balance_data } = require('./routes/your_account_balances');
const { your_account3_position_data } = require('./routes/your_account_positions');
const { your_account4_balance_data } = require('./routes/your_account_balances');
const { your_account4_position_data } = require('./routes/your_account_positions');
const { your_account5_balance_data } = require('./routes/your_account_balances');
const { your_account5_position_data } = require('./routes/your_account_positions');

// WebSocket server initialization
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const accounts = [
    { name: 'your_account1', balanceFn: your_account1_balance_data, positionFn: your_account1_position_data },
    { name: 'your_account2', balanceFn: your_account2_balance_data, positionFn: your_account2_position_data },
    { name: 'your_account3', balanceFn: your_account3_balance_data, positionFn: your_account3_position_data },
    { name: 'your_account4', balanceFn: your_account4_balance_data, positionFn: your_account4_position_data },
    { name: 'your_account5', balanceFn: your_account5_balance_data, positionFn: your_account5_position_data },
  ];

  const balanceIntervals = [];
  const positionIntervals = [];

  // Set intervals for fetching data
  accounts.forEach(({ name, balanceFn, positionFn }) => {
    // Balance data
    const balanceInterval = setInterval(async () => {
      try {
        const { available, marginalBalance, totalWalletBalance, totalUnrealizedPnL } = await balanceFn();
        ws.send(
          JSON.stringify({
            account: name,
            available,
            marginalBalance,
            totalWalletBalance,
            totalUnrealizedPnL,
          })
        );
      } catch (error) {
        ws.send(JSON.stringify({ account: name, error: error.message }));
      }
    }, 5000);
    balanceIntervals.push(balanceInterval);

    // Position data
    const positionInterval = setInterval(async () => {
      try {
        const openPositions = await positionFn();
        ws.send(
          JSON.stringify({
            account: name,
            type: 'positions',
            positions: openPositions,
          })
        );
      } catch (error) {
        ws.send(JSON.stringify({ account: name, error: error.message }));
      }
    }, 5000);
    positionIntervals.push(positionInterval);
  });

  // Clean up on client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    balanceIntervals.forEach(clearInterval);
    positionIntervals.forEach(clearInterval);
  });

  // Handle incoming messages if needed
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
