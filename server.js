const express = require('express');
const path = require('path');

const app = express();
// Middleware
app.use(express.json());

// Route files
const expenseRoutes = require('./controller/expense');
const categoryRoutes = require('./controller/category');

// Use routes
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'assets')));

// Example route to serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
