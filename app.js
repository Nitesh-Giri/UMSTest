const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = process.env.MONGO_URI;

// Define the schema for employee
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model based on the schema
const Employee = mongoose.model('Employee', employeeSchema);

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// GET all managers
app.get('/managers', (req, res) => {
    Employee.find({})
        .then(managers => res.json(managers))
        .catch(err => res.status(500).json({ message: err.message }));
});

// POST a new manager
app.post('/managers', (req, res) => {
    const { name, email, password } = req.body;
    const newManager = new Employee({ name, email, password });

    newManager.save()
        .then(() => {
            res.json(newManager);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Update a manager by ID
app.put('/managers/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    const updateData = { name, email, password };

    Employee.findByIdAndUpdate(userId, updateData, { new: true })
        .then(updatedManager => {
            if (!updatedManager) {
                return res.status(404).json({ message: 'Manager not found' });
            }
            res.json(updatedManager);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// DELETE a manager by ID
app.delete('/managers/:id', (req, res) => {
    const userId = req.params.id;

    Employee.findByIdAndDelete(userId)
        .then(deletedManager => {
            if (!deletedManager) {
                return res.status(404).json({ message: 'Manager not found' });
            }
            res.json({ message: "Manager deleted successfully" });
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
