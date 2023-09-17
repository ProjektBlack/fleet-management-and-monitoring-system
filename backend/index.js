import express from "express";
import mongoose from "mongoose";
import { PORT, dbUrl } from "./config.js";
import {
  Truck,
  Customer,
  Driver,
  Expenses,
  Route,
  Shipment,
  Stock,
} from "./models/simplemodel.js"

const app = express();


app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Request successful.");
});

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
    res.status(200).send({ message: `${model.modelName} deleted successfully` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Routes for Stock
app.post('/tempstock', (req, res) => createRecord(Stock, req, res));
app.get('/stock', (req, res) => getAllRecords(Stock, res));
app.get('/stock/:id', (req, res) => updateRecord(Stock, req, res));
app.put('/stock/:id', (req, res) => updateRecord(Stock, req, res));
app.delete('/stock/:id', (req, res) => deleteRecord(Stock, req, res));

// Routes for Route
app.post('/tempsroute', (req, res) => createRecord(Route, req, res));
app.get('/route', (req, res) => getAllRecords(Route, res));
app.get('/route/:id', (req, res) => updateRecord(Route, req, res));
app.put('/route/:id', (req, res) => updateRecord(Route, req, res));
app.delete('/route/:id', (req, res) => deleteRecord(Route, req, res));

// Routes for Shipment
app.post('/tempshipment', (req, res) => createRecord(Shipment, req, res));
app.get('/shipment', (req, res) => getAllRecords(Shipment, res));
app.get('/shipment/:id', (req, res) => updateRecord(Shipment, req, res));
app.put('/shipment/:id', (req, res) => updateRecord(Shipment, req, res));
app.delete('/shipment/:id', (req, res) => deleteRecord(Shipment, req, res));

// Routes for Expenses
app.post('/tempsexpenses', (req, res) => createRecord(Expenses, req, res));
app.get('/expenses', (req, res) => getAllRecords(Expenses, res));
app.get('/expenses/:id', (req, res) => updateRecord(Expenses, req, res));
app.put('/expenses/:id', (req, res) => updateRecord(Expenses, req, res));
app.delete('/expenses/:id', (req, res) => deleteRecord(Expenses, req, res));

// Routes for Driver
app.post('/tempsdriver', (req, res) => createRecord(Driver, req, res));
app.get('/driver', (req, res) => getAllRecords(Driver, res));
app.get('/driver/:id', (req, res) => updateRecord(Driver, req, res));
app.put('/driver/:id', (req, res) => updateRecord(Driver, req, res));
app.delete('/driver/:id', (req, res) => deleteRecord(Driver, req, res));

// Routes for Customer
app.post('/tempscustomer', (req, res) => createRecord(Customer, req, res));
app.get('/customer', (req, res) => getAllRecords(Customer, res));
app.get('/customer/:id', (req, res) => updateRecord(Customer, req, res));
app.put('/customer/:id', (req, res) => updateRecord(Customer, req, res));
app.delete('/customer/:id', (req, res) => deleteRecord(Customer, req, res));

// Routes for Truck
app.post('/tempstruck', (req, res) => createRecord(Truck, req, res));
app.get('/truck', (req, res) => getAllRecords(Truck, res));
app.get('/truck/:id', (req, res) => updateRecord(Truck, req, res));
app.put('/truck/:id', (req, res) => updateRecord(Truck, req, res));
app.delete('/truck/:id', (req, res) => deleteRecord(Truck, req, res));

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("App connected to the database.");
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
