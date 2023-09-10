//import modules
import express, { request } from "express" //express is a backend framework
import mongoose from "mongoose"; //mongoose is the substsitute for sql
//import variables - helps keep the code short
import { PORT, dbUrl } from "./config.js";
//import models
import { Truck } from "./models/truckModel.js";
import { Customer } from "./models/customerModel.js";
import { Driver } from "./models/driverModel.js";
import { Expenses } from "./models/expensesModel.js";
import { Route } from "./models/routeModel.js";
import { Shipment } from "./models/shipmentModel.js";
import { Stock } from "./models/stockModel.js";
//starting your server
const app = express();
//parsing
app.use(express.json());
app.get("/", (request, response) => {
    console.log(request) //details about the request
    return response.status(200).send("Request successful.") //the server "responding" by sending the requested file
});
//for stockID database
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.StockID ||
            !request.body.StockOutNo ||
            !request.body.StockDate ||
            !request.body.Qty ||
            !request.body.Particular ||
            !request.body.MarketPrice 
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new customer record
        const newStock = {
            StockID: request.body.StockID,
            StockOutNo: request.body.StockOutNo,
            StockDate: request.body.StockDate,
            Qty: request.body.Qty,
            Particular: request.body.Particular,
            MarketPrice: request.body.MarketPrice
        }
        const stock = await Stock.create(newStock);
        return response.status(201).send(stock);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
app.get('/stock', async (request, response) => {
    try {
        const StockDatabase = await Stock.find({});
        return response.status(200).json({
            count: StockDatabase.length,
            data: StockDatabase
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//for routeID database
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.RouteID ||
            !request.body.InitialLoc ||
            !request.body.Destination ||
            !request.body.Distance ||
            !request.body.Duration
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new route record
        const newRoute = {
            RouteID: request.body.RouteID,
            InitialLoc: request.body.InitialLoc,
            Destination: request.body.Destination,
            Distance: request.body.Distance,
            Duration: request.body.Duration
        }
        const route = await Route.create(newRoute);
        return response.status(201).send(route);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
app.get('/route', async (request, response) => {
    try {
        const RouteDatabase = await Route.find({});
        return response.status(200).json({
            count: RouteDatabase.length,
            data: RouteDatabase
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//for shipmentID database
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.ShipmentID ||
            !request.body.ShipmentDate
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new customer record
        const newShipment = {
            ShipmentID: request.body.ShipmentID,
            ShipmentDate: request.body.ShipmentDate
        }
        const shipment = await Shipment.create(newShipment);
        return response.status(201).send(shipment);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
app.get('/shipment', async (request, response) => {
    try {
        const ShipmentDatabase = await Shipment.find({});
        return response.status(200).json({
            count: ShipmentDatabase.length,
            data: ShipmentDatabase
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//for routeID database
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.RouteID ||
            !request.body.InitialLoc ||
            !request.body.Destination ||
            !request.body.Distance ||
            !request.body.Duration
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new route record
        const newRoute = {
            RouteID: request.body.RouteID,
            InitialLoc: request.body.InitialLoc,
            Destination: request.body.Destination,
            Distance: request.body.Distance,
            Duration: request.body.Duration
        }
        const route = await Route.create(newRoute);
        return response.status(201).send(route);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//for expensesID database
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.ExpensesID ||
            !request.body.ExpensesRevenue ||
            !request.body.DepreciationExpenses ||
            !request.body.ExpensesAmortization ||
            !request.body.MaintenanceCost ||
            !request.body.TruckRegis ||
            !request.body.Sticker ||
            !request.body.DriverSalary ||
            !request.body.HelperSalary ||
            !request.body.Trips ||
            !request.body.TotalKm ||
            !request.body.TotalExpense ||
            !request.body.CostAve ||
            !request.body.TollFee ||
            !request.body.Diesel ||
            !request.body.DieselpLiters ||
            !request.body.OtherExpense
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new expenses record
        const newExpenses = {
            ExpensesID: request.body.ExpensesID, 
            ExpensesRevenue: request.body.ExpensesRevenue, 
            DepreciationExpenses: request.body.DepreciationExpenses, 
            ExpensesAmortization: request.body.ExpensesAmortization,
            MaintenanceCost:request.body.MaintenanceCost, 
            TruckRegis: request.body.TruckRegis, 
            Sticker: request.body.Sticker, 
            DriverSalary: request.body.DriverSalary, 
            HelperSalary: request.body.HelperSalary, 
            Trips: request.body.Trips, 
            TotalKm: request.body.TotalKm, 
            TotalExpense: request.body.TotalExpense, 
            CostAve: request.body.CostAve, 
            TollFee: request.body.TollFee,
            Diesel: request.body.Diesel, 
            DieselpLiters: request.body.DieselpLiters, 
            OtherExpense: request.body.OtherExpense
        }
        const expenses = await Expenses.create(newExpenses);
        return response.status(201).send(expenses);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
app.get('/expenses', async (request, response) => {
    try {
        const ExpensesDatabase = await Expenses.find({});
        return response.status(200).json({
            count: ExpensesDatabase.length,
            data: ExpensesDatabase
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//for driverID database
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.DriverID ||
            !request.body.DriverFirstName ||
            !request.body.DriverLastName ||
            !request.body.DriverContactNo ||
            !request.body.DriverLicenseNo
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new driver record
        const newDriver = {
            DriverID: request.body.DriverID,
            DriverFirstName: request.body.DriverFirstName,
            DriverLastName: request.body.DriverLastName,
            DriverContactNo: request.body.DriverContactNo,
            DriverLicenseNo: request.body.DriverLicenseNo
        }
        const driver = await Driver.create(newDriver);
        return response.status(201).send(driver);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
app.get('/driver', async (request, response) => {
    try {
        const DriverDatabase = await Driver.find({});
        return response.status(200).json({
            count: DriverDatabase.length,
            data: DriverDatabase
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//for customerID database
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.CustomerID ||
            !request.body.CustomerFirstName ||
            !request.body.CustomerLastName ||
            !request.body.CustomerContactNo ||
            !request.body.DriverLicenseNo
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new customer record
        const newCustomer = {
            CustomerID: request.body.CustomerID,
            CustomerFirstName: request.body.CustomerFirstName,
            CustomerLastName: request.body.CustomerLastName,
            CustomerContactNo: request.body.CustomerContactNo,
            CustomerEmail: request.body.CustomerEmail
        }
        const customer = await Customer.create(newCustomer);
        return response.status(201).send(customer);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
app.get('/customer', async (request, response) => {
    try {
        const CustomerDatabase = await Customer.find({});
        return response.status(200).json({
            count: CustomerDatabase.length,
            data: CustomerDatabase
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//creating a new file/data
app.post('/temps', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.TruckID ||
            !request.body.PlateNo ||
            !request.body.TruckType ||
            !request.body.Revenue ||
            !request.body.Depreciation ||
            !request.body.Amortization ||
            !request.body.TotalFeeExpenses ||
            !request.body.FCIE ||
            !request.body.REGISTRATION
        ) {
            //return a message saying that the properties are incomplete
            return response.status(400).send({
                message: 'Please send all required fields.'
            });
        }
        //create new truck record
        const newTruck = {
            TruckID: request.body.TruckID,
            PlateNo: request.body.PlateNo,
            TruckType: request.body.TruckType,
            Revenue: request.body.Revenue,
            Depreciation: request.body.Depreciation,
            Amortization: request.body.Amortization,
            TotalFeeExpenses: request.body.TotalFeeExpenses,
            FCIE: request.body.FCIE,
            REGISTRATION: request.body.REGISTRATION
        }
        const truck = await Truck.create(newTruck);
        return response.status(201).send(truck);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
app.get('/truck', async (request, response) => {
    try {
        const TruckDatabase = await Truck.find({});
        return response.status(200).json({
            count: TruckDatabase.length,
            data: TruckDatabase
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//connect to db
mongoose
    .connect(dbUrl) //connects to mongodbatlas, connects to our database    
    .then(() => {
        console.log("App connected to database.");
        app.listen(PORT, () => {
            //confirms that server is running
            console.log(`App is listening to port: ${PORT}`)
        });
    })
    .catch((error) => {
        console.log(error);
    })

//create database schema based on our model

