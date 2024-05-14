// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());    

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/visa_slots', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Define schema and model
const visaSlotSchema = new mongoose.Schema({
    location: String,
    availability: Boolean,
    checkedTime: { type: Date, default: Date.now }
});

const VisaSlot = mongoose.model('VisaSlot', visaSlotSchema);

// Routes   
app.post('/api/visa-slots', async (req, res) => {
    try {
        const { location, city, availability } = req.body;
        const newSlot = new VisaSlot({ location, city, availability });
        await newSlot.save();
        res.status(201).json({ message: 'Slot submitted successfully' });
    } catch (error) {
        console.error('Error submitting slot:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/visa-slots', async (req, res) => {
    try {
        const slots = await VisaSlot.find();
        res.status(200).json(slots);
    } catch (error) {
        console.error('Error fetching visa slots:', error);
        res.status(500).json({ message: 'Failed to fetch data' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
