const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crops', require('./routes/cropRoutes'));

// Indian Data Source APIs
app.use('/api/imd', require('./routes/imdWeather'));
app.use('/api/soil-health', require('./routes/soilHealth'));
app.use('/api/enam', require('./routes/enam'));
app.use('/api/bhuvan', require('./routes/bhuvan'));
app.use('/api/language', require('./routes/ai4bharat'));

// AI Analysis route (Gemini)
app.use('/api/analyze-plant', require('./routes/aiAnalysis'));

app.get('/', (req, res) => {
    res.send('AgriGuard API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
