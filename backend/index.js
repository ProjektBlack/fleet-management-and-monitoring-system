//import modules now!
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
app.post('/tempstock', async (request, response) => {
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
//get stock 
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
//for getting stock by id 
app.get('/stock/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const stock = await Stock.findById(id);
        return response.status(200).json(stock);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//updating stock
app.put('/stock/:id', async (request, response) => {
    try{
        if(
        !request.body.StockID ||
        !request.body.StockOutNo ||
        !request.body.StockDate ||
        !request.body.Qty ||
        !request.body.Particular ||
        !request.body.MarketPrice 
        ){
        return response.status(400).send({
            message: 'Please send all required fields.'
        });
    }
    
    const {id} =request.params;

    const result = await Stock.findByIdAndUpdate(id, request.body);

    if (!result){
        return response.status(404).json({message: 'Stock not found'});
    }

    return response.status(200).send({message: 'Stock updated successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//deleting stock
app.delete('/stock/:id', async (request, response) => {
    try{
    const {id} =request.params;

    const result = await Stock.findByIdAndDelete(id);

    if (!result){
        return response.status(404).json({message: 'Stock not found'});
    }

    return response.status(200).send({message: 'Stock deleted successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//for routeID database
app.post('/tempsroute', async (request, response) => {
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
//for route get 1 by id
app.get('/route/:id', async (request, response) => {
    try {
        
        const { id } = request.params;
        const route = await Route.findById(id);
        return response.status(200).json(route);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//updating route
app.put('/route/:id', async (request, response) => {
    try{
        if(
            !request.body.RouteID ||
            !request.body.InitialLoc ||
            !request.body.Destination ||
            !request.body.Distance ||
            !request.body.Duration
        ){
        return response.status(400).send({
            message: 'Please send all required fields.'
        });
    }
    
    const {id} =request.params;

    const result = await Route.findByIdAndUpdate(id, request.body);

    if (!result){
        return response.status(404).json({message: 'Route not found'});
    }

    return response.status(200).send({message: 'Route updated successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//deleting route
app.delete('/route/:id', async (request, response) => {
    try{
    const {id} =request.params;

    const result = await Route.findByIdAndDelete(id);

    if (!result){
        return response.status(404).json({message: 'Route not found'});
    }

    return response.status(200).send({message: 'Route deleted successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//for shipmentID database
app.post('/tempshipment', async (request, response) => {
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
//for shipment get by id
app.get('/shipment/:id', async (request, response) => {
    try {
        
        const { id } = request.params;
        const shipment = await Shipment.findById(id);
        return response.status(200).json(shipment);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//updating shipment
app.put('/shipment/:id', async (request, response) => {
    try{
        if(
            !request.body.ShipmentID ||
            !request.body.ShipmentDate
        ){
        return response.status(400).send({
            message: 'Please send all required fields.'
        });
    }
    
    const {id} =request.params;

    const result = await Shipment.findByIdAndUpdate(id, request.body);

    if (!result){
        return response.status(404).json({message: 'Shipment not found'});
    }

    return response.status(200).send({message: 'Shipment updated successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//deleting shipment
app.delete('/shipment/:id', async (request, response) => {
    try{
    const {id} =request.params;

    const result = await Shipment.findByIdAndDelete(id);

    if (!result){
        return response.status(404).json({message: 'Shipment not found'});
    }

    return response.status(200).send({message: 'Shipment deleted successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//for expensesID database
app.post('/tempsexpenses', async (request, response) => {
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
//for getting expenses by id
app.get('/expenses/:id', async (request, response) => {
    try {
        
        const { id } = request.params;
        const expenses = await Expenses.findById(id);
        return response.status(200).json(expenses);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//updating expenses
app.put('/expenses/:id', async (request, response) => {
    try{
        if(
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
        ){
        return response.status(400).send({
            message: 'Please send all required fields.'
        });
    }
    
    const {id} =request.params;

    const result = await Expenses.findByIdAndUpdate(id, request.body);

    if (!result){
        return response.status(404).json({message: 'Expenses not found'});
    }

    return response.status(200).send({message: 'Expenses updated successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//deleting expenses
app.delete('/expenses/:id', async (request, response) => {
    try{
    const {id} =request.params;

    const result = await Expenses.findByIdAndDelete(id);

    if (!result){
        return response.status(404).json({message: 'Expenses not found'});
    }

    return response.status(200).send({message: 'Expenses deleted successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//for driverID database
app.post('/tempsdriver', async (request, response) => {
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
//for getting driver id
app.get('/driver/:id', async (request, response) => {
    try {
        
        const { id } = request.params;
        const driver = await Driver.findById(id);
        return response.status(200).json(driver);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//updating driver
app.put('/driver/:id', async (request, response) => {
    try{
        if(
            !request.body.DriverID ||
            !request.body.DriverFirstName ||
            !request.body.DriverLastName ||
            !request.body.DriverContactNo ||
            !request.body.DriverLicenseNo
        ){
        return response.status(400).send({
            message: 'Please send all required fields.'
        });
    }
    
    const {id} =request.params;

    const result = await Driver.findByIdAndUpdate(id, request.body);

    if (!result){
        return response.status(404).json({message: 'Driver not found'});
    }

    return response.status(200).send({message: 'Driver updated successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//deleting driver
app.delete('/driver/:id', async (request, response) => {
    try{
    const {id} =request.params;

    const result = await Driver.findByIdAndDelete(id);

    if (!result){
        return response.status(404).json({message: 'Driver not found'});
    }

    return response.status(200).send({message: 'Driver deleted successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//for customerID database
app.post('/tempscustomer', async (request, response) => {
    try {   
        //check if all properties are there
        if (
            !request.body.CustomerID ||
            !request.body.CustomerFirstName ||
            !request.body.CustomerLastName ||
            !request.body.CustomerContactNo ||
            !request.body.CustomerEmail
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
//for getting customer by id
app.get('/customer/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const customer = await Customer.findById(id);
        return response.status(200).json(customer);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//updating customer
app.put('/customer/:id', async (request, response) => {
    try{
        if(
            !request.body.CustomerID ||
            !request.body.CustomerFirstName ||
            !request.body.CustomerLastName ||
            !request.body.CustomerContactNo ||
            !request.body.CustomerEmail
        ){
        return response.status(400).send({
            message: 'Please send all required fields.'
        });
    }
    
    const {id} =request.params;

    const result = await Customer.findByIdAndUpdate(id, request.body);

    if (!result){
        return response.status(404).json({message: 'Customer not found'});
    }

    return response.status(200).send({message: 'Customer updated successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//deleting customer
app.delete('/customer/:id', async (request, response) => {
    try{
    const {id} =request.params;

    const result = await Customer.findByIdAndDelete(id);

    if (!result){
        return response.status(404).json({message: 'Customer not found'});
    }

    return response.status(200).send({message: 'Customer deleted successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//creating for truck 
app.post('/tempstruck', async (request, response) => {
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
//get truck by id
app.get('/truck/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const truck = await Truck.findById(id);
        return response.status(200).json(truck);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})
//updating truck
app.put('/truck/:id', async (request, response) => {
    try{
        if(
            !request.body.TruckID ||
            !request.body.PlateNo ||
            !request.body.TruckType ||
            !request.body.Revenue ||
            !request.body.Depreciation ||
            !request.body.Amortization ||
            !request.body.TotalFeeExpenses ||
            !request.body.FCIE ||
            !request.body.REGISTRATION
        ){
        return response.status(400).send({
            message: 'Please send all required fields.'
        });
    }
    
    const {id} =request.params;

    const result = await Truck.findByIdAndUpdate(id, request.body);

    if (!result){
        return response.status(404).json({message: 'Truck not found'});
    }

    return response.status(200).send({message: 'Truck updated successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
//deleting truck
app.delete('/truck/:id', async (request, response) => {
    try{
    const {id} =request.params;

    const result = await Truck.findByIdAndDelete(id);

    if (!result){
        return response.status(404).json({message: 'Truck not found'});
    }

    return response.status(200).send({message: 'Truck deleted successfully'})

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});
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

//created database schema based on our model

