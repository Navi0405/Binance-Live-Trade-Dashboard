// // server.js
// const express = require('express');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swagger'); // Adjust the path if needed
// const WebSocket = require('ws');
// const your_account1_balancesRoute = require('./routes/balances');
// const your_account1_positionsRoute = require('./routes/positions');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());

// // Serve Swagger documentation
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Routes
// app.use('/api/balances', your_account1_balancesRoute);
// app.use('/api/positions', your_account1_positionsRoute);

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Adjust the path if needed
const your_account1_balancesRoute = require('./routes/your_account1_balances');
const your_account1_positionsRoute = require('./routes/your_account1_positions');
const your_account2_balancesRoute = require('./routes/your_account2_balances');
const your_account2_positionsRoute = require('./routes/your_account2_positions');
const your_account_balancesRoute = require('./routes/your_account_balances');
const your_account_positionsRoute = require('./routes/your_account_positions');
// const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/your_account1_balances', your_account1_balancesRoute);
app.use('/api/your_account1_positions', your_account1_positionsRoute);
app.use('/api/your_account2_balances', your_account2_balancesRoute);
app.use('/api/your_account2_positions', your_account2_positionsRoute);
app.use('/api/your_account_balances', your_account_balancesRoute);
app.use('/api/your_account_positions', your_account_positionsRoute);

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = your_account1_balancesRoute, your_account1_positionsRoute, your_account2_balancesRoute, your_account2_positionsRoute, your_account_balancesRoute, your_account_positionsRoute;