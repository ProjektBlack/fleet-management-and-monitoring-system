// Import modules
import express from "express";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

// Import variables
import { PORT, dbUrl } from "./config.js";

// Import models
import {
    User,
    Truck,
    Expenses,
    Trip, // Add Trip model
    YearlyExpense, // Add YearlyExpense model
    MonthlyExpense, // Add MonthlyExpense model
} from "./models/models.js";

// Starting your server
const app = express();

// Parsing
app.use(express.json());

app.get("/", (request, response) => {
    console.log(request); // Details about the request
    return response.status(200).send("Request successful."); // The server "responding" by sending the requested file
});

//CORS - allows different domain addresses to access the API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your frontend's URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Use a string here
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    res.setHeader('Cache-Control', 'no-store');
    next();
});


// Common function for handling singular get operations by id
const getSingleRecord = async (model, req, res) => {
    try {
        const { id } = req.params;
        const record = await model.findById(id);
        if (!record) {
            res.status(404).json({ message: `${model.modelName} not found` });
        }
        res.status(200).json(record);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Define a common function for handling create operations
const createRecord = async (model, req, res) => {
    try {
        const newRecord = { ...req.body };
        const record = await model.create(newRecord);
        res.status(201).send(record);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Define a common function for handling read operations
const getAllRecords = async (model, res) => {
    try {
        const database = await model.find({});
        res.status(200).json({
            count: database.length,
            data: database,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Define a common function for handling update operations
const updateRecord = async (model, req, res) => {
    try {
        const { id } = req.params;
        const result = await model.findByIdAndUpdate(id, req.body);
        if (!result) {
            res.status(404).json({ message: `${model.modelName} not found` });
        }
        res.status(200).send({ message: `${model.modelName} updated successfully` });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Define a common function for handling delete operations
const deleteRecord = async (model, req, res) => {
    try {
        const { id } = req.params;
        const result = await model.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({ message: `${model.modelName} not found` });
        }
        res.status(204).send({ message: `${model.modelName} deleted successfully` });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};
//routes
//for logging in

// Define a route for logging in
app.post('/login', async (req, res) => {
    try {
        // Get the username and password from the request body
        const { username, password } = req.body;

        // Find the user with the given username
        const user = await User.findOne({ username });

        // If the user doesn't exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create a JSON Web Token (JWT) for the user
        const token = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', {
            expiresIn: '1h', // Token expiration time
        });

        // Return the token to the client
        res.status(200).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in' });
    }
});
// Route for creating a new user
app.post('/users', async (req, res) => {
    try {
        // Get the user data from the request body
        const { username, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            username,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        // Return a success message to the client
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error creating user' });
    }
});
// Routes for Trip
app.post('/trips', (req, res) => createRecord(Trip, req, res));
app.get('/trips', (req, res) => getAllRecords(Trip, res));
app.get('/trips/:id', (req, res) => getSingleRecord(Trip, req, res)); // Use getSingleRecord for retrieving a single trip
app.put('/trips/:id', (req, res) => updateRecord(Trip, req, res));
app.delete('/trips/:id', (req, res) => deleteRecord(Trip, req, res));

// Routes for YearlyExpense
app.post('/yearlyexpenses', (req, res) => createRecord(YearlyExpense, req, res));
app.get('/yearlyexpenses', (req, res) => getAllRecords(YearlyExpense, res));
app.get('/yearlyexpenses/:id', (req, res) => getSingleRecord(YearlyExpense, req, res)); // Use getSingleRecord for retrieving a single yearly expense
app.put('/yearlyexpenses/:id', (req, res) => updateRecord(YearlyExpense, req, res));
app.delete('/yearlyexpenses/:id', (req, res) => deleteRecord(YearlyExpense, req, res));

// Routes for MonthlyExpense
app.post('/monthlyexpenses', (req, res) => createRecord(MonthlyExpense, req, res));
app.get('/monthlyexpenses', (req, res) => getAllRecords(MonthlyExpense, res));
app.get('/monthlyexpenses/:id', (req, res) => getSingleRecord(MonthlyExpense, req, res)); // Use getSingleRecord for retrieving a single monthly expense
app.put('/monthlyexpenses/:id', (req, res) => updateRecord(MonthlyExpense, req, res));
app.delete('/monthlyexpenses/:id', (req, res) => deleteRecord(MonthlyExpense, req, res));

// Routes for Truck
app.post('/trucks', (req, res) => createRecord(Truck, req, res));
app.get('/trucks', (req, res) => getAllRecords(Truck, res));
app.get('/trucks/:id', (req, res) => getSingleRecord(Truck, req, res));
app.put('/trucks/:id', (req, res) => updateRecord(Truck, req, res));
app.delete('/trucks/:id', (req, res) => deleteRecord(Truck, req, res));

// Routes for Expenses
app.post('/expenses', (req, res) => createRecord(Expenses, req, res));
app.get('/expenses', (req, res) => getAllRecords(Expenses, res));
app.get('/expenses/:id', (req, res) => getSingleRecord(Expenses, req, res));
app.put('/expenses/:id', (req, res) => updateRecord(Expenses, req, res));
app.delete('/expenses/:id', (req, res) => deleteRecord(Expenses, req, res));

// Connect to the database
mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("App connected to the database.");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });