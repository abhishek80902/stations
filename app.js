const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// MongoDB setup (using mongoose)
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ev_charging', { useNewUrlParser: true, useUnifiedTopology: true });

// Model for Charging Stations
const Station = mongoose.model('Station', {
    name: String,
    latitude: Number,
    longitude: Number,
    availableSpots: Number
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// Endpoint to fetch all charging stations
app.get('/api/stations', async(req, res) => {
    const stations = await Station.find();
    res.json(stations);
});

// Endpoint to plan a route with charging stations
app.get('/api/plan-route', (req, res) => {
    const { start, end } = req.query;

    // For now, just return dummy data or calculate charging stops along the route.
    // Real route planning logic can be integrated using Google Maps API, OpenRouteService, etc.
    res.json({ message: `Route from ${start} to ${end} planned with charging stops.` });
});

// Endpoint to reserve a charging spot
app.post('/api/reserve', async(req, res) => {
    const { stationId } = req.body;

    // Logic to reserve a spot at the station (update the availability)
    const station = await Station.findById(stationId);
    if (station.availableSpots > 0) {
        station.availableSpots--;
        await station.save();
        res.json({ message: 'Spot reserved!', availableSpots: station.availableSpots });
    } else {
        res.status(400).json({ message: 'No spots available.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});