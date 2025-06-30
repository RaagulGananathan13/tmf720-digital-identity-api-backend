const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const digitalIdentityRoutes = require('./routes/digitalIdentityRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Default root route (fixes Railway "Not Found" issue)
app.get('/', (req, res) => {
  res.send('✅ TMF720 Digital Identity API is live on Railway!');
});

// API Routes
app.use(
  ['/tmf-api/digitalIdentity', '/tmf-api/digitalIdentityManagement/v4/digitalIdentity'],
  digitalIdentityRoutes
);

// Start server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`TMF720 API running on port ${PORT}`);
});
