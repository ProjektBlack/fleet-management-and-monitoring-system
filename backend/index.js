// Import modules
import express from "express";
import mongoose from "mongoose";

// Import variables
import { PORT, dbUrl } from "./config.js";

// Import models
import {
    Truck,
    Customer,
    Driver,
    Helper,
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

// CORS issue - allows different domains to access the API
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

// Routes for Driver
app.post('/drivers', (req, res) => createRecord(Driver, req, res));
app.get('/drivers', (req, res) => getAllRecords(Driver, res));
app.get('/drivers/:id', (req, res) => getSingleRecord(Driver, req, res));
app.put('/drivers/:id', (req, res) => updateRecord(Driver, req, res));
app.delete('/drivers/:id', (req, res) => deleteRecord(Driver, req, res));

// Routes for Customer
app.post('/customers', (req, res) => createRecord(Customer, req, res));
app.get('/customers', (req, res) => getAllRecords(Customer, res));
app.get('/customers/:id', (req, res) => getSingleRecord(Customer, req, res));
app.put('/customers/:id', (req, res) => updateRecord(Customer, req, res));
app.delete('/customers/:id', (req, res) => deleteRecord(Customer, req, res));

// Routes for Helper
app.post('/helpers', (req, res) => createRecord(Helper, req, res));
app.get('/helpers', (req, res) => getAllRecords(Helper, res));
app.get('/helpers/:id', (req, res) => getSingleRecord(Helper, req, res));
app.put('/helpers/:id', (req, res) => updateRecord(Helper, req, res));
app.delete('/helpers/:id', (req, res) => deleteRecord(Helper, req, res));

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