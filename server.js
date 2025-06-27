const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const digitalIdentityRoutes = require('./routes/digitalIdentityRoutes');

connectDB();
app.use(cors());
app.use(express.json());

app.use(['/tmf-api/digitalIdentity', '/tmf-api/digitalIdentityManagement/v4/digitalIdentity'], digitalIdentityRoutes);

app.listen(80, () => {
  console.log('TMF720 API running on port 80');
});