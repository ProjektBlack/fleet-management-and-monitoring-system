//import modules
import express, { request } from "express" //express is a backend framework
import mongoose from "mongoose"; //mongoose is the substsitute for sql
//import variables - helps keep the code short
import { PORT, dbUrl } from "./config.js";
//import models
import { Truck } from "./models/truckModel.jsx";
//starting your server
const app = express();
app.get("/", (request, response) => {
    console.log(request) //details about the request
    return response.status(200).send("Request successful.") //the server "responding" by sending the requested file
});
//creating a new file/data
app.post('/trucks', async (request, response) => {
    try {
        //check if all properties are there
        if (
            !request.body.TruckId ||
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
            TruckId: request.body.TruckId,
            PlateNumber: request.body.PlateNo,
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

