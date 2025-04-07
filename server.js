const express = require('express');
const path = require('path');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// ✅ Logger middleware for ALL requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Route files
const expenseRoutes = require('./controller/expense');
const categoryRoutes = require('./controller/category');

// Use routes
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);

// Serve static files from the "assets" folder
app.use(express.static(path.join(__dirname, 'assets')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
