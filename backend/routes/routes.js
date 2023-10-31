import express from "express";
import {
    Truck,
    Expenses,
    Trip,
    YearlyExpense,
    MonthlyExpense,
} from "../models/models.js";

const router = express.Router();

//routes for trucks
router.post("/trucks", (req, res) => createRecord(Truck, req, res));
router.get("/trucks", (req, res) => getAllRecords(Truck, res));
router.get("/trucks/:id", (req, res) => getSingleRecord(Truck, req, res));
router.put("/trucks/:id", (req, res) => updateRecord(Truck, req, res));
router.delete("/trucks/:id", (req, res) => deleteRecord(Truck, req, res));

//routes for expenses
router.post("/expenses", (req, res) => createRecord(Expenses, req, res));
router.get("/expenses", (req, res) => getAllRecords(Expenses, res));
router.get("/expenses/:id", (req, res) => getSingleRecord(Expenses, req, res));
router.put("/expenses/:id", (req, res) => updateRecord(Expenses, req, res));
router.delete("/expenses/:id", (req, res) => deleteRecord(Expenses, req, res));

//routes for yearly expenses
router.post("/yearlyexpenses", (req, res) => createRecord(YearlyExpense, req, res));
router.get("/yearlyexpenses", (req, res) => getAllRecords(YearlyExpense, res));
router.get("/yearlyexpenses/:id", (req, res) => getSingleRecord(YearlyExpense, req, res));
router.put("/yearlyexpenses/:id", (req, res) => updateRecord(YearlyExpense, req, res));
router.delete("/yearlyexpenses/:id", (req, res) => deleteRecord(YearlyExpense, req, res));
router.get("/yearly/expenses/:year/:truckId", async (req, res) => {
    try {
        const { year, truck } = req.params;
        const expenses = await MonthlyExpense.find({ year: year, truck: truck });
        if (!expenses) {
            res.status(404).json({ message: "Expenses not found" });
        }
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

//routes for monthly expenses
router.post("/monthlyexpenses", (req, res) => createRecord(MonthlyExpense, req, res));
router.get("/monthlyexpenses", (req, res) => getAllRecords(MonthlyExpense, res));
router.get("/monthlyexpenses/:id", (req, res) => getSingleRecord(MonthlyExpense, req, res));
router.put("/monthlyexpenses/:id", (req, res) => updateRecord(MonthlyExpense, req, res));
router.delete("/monthlyexpenses/:id", (req, res) => deleteRecord(MonthlyExpense, req, res));
router.get("/monthly/expenses/:truckId/:year", async (req, res) => {
    try {
        const { truckId, year } = req.params;
        const expenses = await MonthlyExpense.find({ truck: truckId, year: year });
        if (!expenses) {
            res.status(404).json({ message: "Expenses not found" });
        }
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

//routes for trips
router.post("/trips", (req, res) => createRecord(Trip, req, res));
router.get("/trips", (req, res) => getAllRecords(Trip, res));
router.get("/trips/:id", (req, res) => getSingleRecord(Trip, req, res));
router.put("/trips/:id", (req, res) => updateRecord(Trip, req, res));
router.delete("/trips/:id", (req, res) => deleteRecord(Trip, req, res));
//route for getting trips by year and month
router.get("/trips/:year/:month/:truck", async (req, res) => {
    try {
        const { year, month, truck } = req.params;
        const trips = await Trip.find({ year: year, month: month, truck: truck });
        if (!trips) {
            res.status(404).json({ message: "Trips not found" });
        }
        res.status(200).json(trips);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

//functions for handling CRUD operations

//retrieving a single record
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
//creating a record
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
//retrieving all records from a collection
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
//update a record
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
//delete a record
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

export default router;