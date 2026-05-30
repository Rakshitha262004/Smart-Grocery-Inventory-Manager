const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/grocery',   require('./routes/groceryRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/api', (req, res) => res.json({ message: 'Server is running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));