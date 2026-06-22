require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
app.use(cors());

// Parse incoming request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if any (e.g. coffee illustrations, placeholder images)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Import Routes
const authRouter = require('./routes/auth');
const menuRouter = require('./routes/menu');

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Root fallback route
app.get('/', (req, res) => {
  res.send('Mana Katha backend API server is running.');
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database and start server:', error);
    process.exit(1);
  }
};

startServer();
