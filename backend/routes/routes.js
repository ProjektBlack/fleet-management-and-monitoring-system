import express from "express";
import {
    Truck,
    Trip,
    YearlyExpense,
    MonthlyExpense,
} from "../models/models.js";

const router = express.Router();

//routes for trucks
router.post("/trucks", (req, res) => createRecord(Truck, req, res));
router.get("/trucks", (req, res) => getAllRecords(Truck, res));
router.get('/trucks/status', async (req, res) => {
    try {
        const trucks = await Truck.find();

        const trucksWithTrips = await Promise.all(trucks.map(async (truck) => {
            const trips = await Trip.find({ truck: truck._id });
            return { ...truck._doc, trips };
        }));

        res.status(200).json(trucksWithTrips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get("/trucks/:id", (req, res) => getSingleRecord(Truck, req, res));
router.put("/trucks/:id", (req, res) => updateRecord(Truck, req, res));
//deletes truck and its associated trips and expenses
router.delete("/trucks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // delete trips that are associated with the truck
        await Trip.deleteMany({ truck: id });
        // delete all associated expenses
        const truck = await Truck.findById(id);
        // issue with if expenses are empty, it cannot delete
        if (truck && truck.expenses) {
            const { yearlyExpenses, monthlyExpenses } = truck.expenses;

            for (let yearlyExpense of yearlyExpenses) {
                await YearlyExpense.deleteMany({ _id: yearlyExpense });
            }

            for (let monthlyExpense of monthlyExpenses) {
                await MonthlyExpense.deleteMany({ _id: monthlyExpense });
            }
        }
        // finally, delete the truck
        await Truck.findByIdAndRemove(id);
        // confirm deletion
        res.status(204).json({ message: "Truck and its associated trips and expenses deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


//routes for trips
router.post("/trips", (req, res) => createRecord(Trip, req, res));
router.get("/trips", (req, res) => getAllRecords(Trip, res));
router.get("/trips/:id", (req, res) => getSingleRecord(Trip, req, res));
router.put("/trips/:id", (req, res) => updateRecord(Trip, req, res));
//deletes trip and removes it from the truck's trips array
router.delete("/trips/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        //find the truck and remove the trip from its trips array
        const truck = await Truck.findById(trip.truck);
        if (truck) {
            const index = truck.trips.indexOf(id);
            if (index > -1) {
                truck.trips.splice(index, 1);
                await truck.save();
            }
        }
        //delete the trip record
        await Trip.findByIdAndRemove(id);
        res.status(200).json({ message: "Trip deleted and removed from references." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
//route for getting completed trips by year and month
router.get('/trips/status/completed/:year/:month', async (req, res) => {
    try {
        const { year, month } = req.params;

        // Convert first character to uppercase and the rest to lowercase
        const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

        const trips = await Trip.find({ status: "Completed", month: formattedMonth, year: year });

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: `There are no completed trips for ${formattedMonth} ${year}.` });
        }

        res.status(200).json(trips);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
//route for getting all completed trips by year
router.get("/trips/status/completed/:year", async (req, res) => {
    try {
        const { year } = req.params;
        const trips = await Trip.find({ status: "Completed", year: year });
        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: `There are no completed trips for ${year}.` });
        }
        res.status(200).json(trips);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
//route for getting trips by year and month
router.get("/trips/:truck/:year/:month", async (req, res) => {
    try {
        const { truck, year, month } = req.params;
        const trips = await Trip.find({ truck: truck, year: year, month: month });
        if (!trips) {
            res.status(404).json({ message: "There are no trips for that year and month." });
        }
        res.status(200).json(trips);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
//route for getting pending trips
router.get("/trips/status/pending", async (req, res) => {
    try {
        const trips = await Trip.find({ status: "Pending" });
        if (!trips) {
            res.status(404).json({ message: "There are no pending trips." });
        }
        res.status(200).json(trips);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});


//routes for monthly expenses
router.post("/expenses/monthly", (req, res) => createRecord(MonthlyExpense, req, res));
router.get("/expenses/monthly", (req, res) => getAllRecords(MonthlyExpense, res));
router.get("/expenses/monthly/:id", (req, res) => getSingleRecord(MonthlyExpense, req, res));
router.put("/expenses/monthly/:id", (req, res) => updateRecord(MonthlyExpense, req, res));
//power delete for monthly expenses
router.delete("/expenses/monthly/:id", async (req, res) => {
    try {
        const { id } = req.params;
        //find the expense
        const expense = await MonthlyExpense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "Monthly expense not found." });
        }
        //remove from references
        const truck = await Truck.findOne({ "expenses.monthlyExpenses": id });
        if (truck) {
            const index = truck.expenses.monthlyExpenses.indexOf(id);
            if (index > -1) {
                truck.expenses.monthlyExpenses.splice(index, 1);
                await truck.save();
            }
        }
        //remove the record
        await MonthlyExpense.findByIdAndRemove(id);
        res.status(200).json({ message: "Expense deleted and removed from references." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
//get monthly expenses by year and truck
router.get("/expenses/monthly/:year/:truckId", async (req, res) => {
    try {
        const { year, truckId } = req.params;
        const expenses = await MonthlyExpense.find({ truck: truckId, year: year });
        if (!expenses) {
            res.status(404).json({ message: "Record not found." });
        }
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

//routes for yearly expenses
router.post("/expenses/yearly", (req, res) => createRecord(YearlyExpense, req, res));
router.get("/expenses/yearly", (req, res) => getAllRecords(YearlyExpense, res));
router.get("/expenses/yearly/:id", (req, res) => getSingleRecord(YearlyExpense, req, res));
router.put("/expenses/yearly/:id", (req, res) => updateRecord(YearlyExpense, req, res));
//power delete for yearly expenses
router.delete("/expenses/yearly/:id", async (req, res) => {
    try {
        const { id } = req.params;
        //find the expense
        const expense = await YearlyExpense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found." });
        }

        // Find the truck that contains the expense and remove the expense from its expenses array
        const truck = await Truck.findOne({ "expenses.yearlyExpenses": id });
        if (truck) {
            const index = truck.expenses.yearlyExpenses.indexOf(id);
            if (index > -1) {
                truck.expenses.yearlyExpenses.splice(index, 1);
                await truck.save();
            }
        }

        // Delete the expense
        await YearlyExpense.findByIdAndRemove(id);

        res.status(200).json({ message: "Expense deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
//get yearly expenses by truck and year
router.get("/expenses/yearly/:truckId/:year", async (req, res) => {
    try {
        const { truckId, year } = req.params;
        const expenses = await MonthlyExpense.find({ truck: truckId, year: year });
        if (!expenses) {
            res.status(404).json({ message: "Record not found." });
        }
        res.status(200).json(expenses);
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
            return res.status(404).json({ message: `${model.modelName} not found.` });
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
            res.status(404).json({ message: `${model.modelName} not found.` });
        }
        res.status(200).send({ message: `${model.modelName} updated successfully.` });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

export default router;