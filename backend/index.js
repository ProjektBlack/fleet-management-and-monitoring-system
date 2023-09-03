//import modules
import express from "express" //express is a backend framework
import mongoose from "mongoose"; //mongoose is the substsitute for sql
//import variables - helps keep the code short
import {PORT, dbUrl} from "./config.js";

//starting your server
const app = express();
app.get("/", (request, response) => {
    console.log(request) //details about the request
    return response.status(200).send("Request successful.") //the server "responding" by sending the requested file
});

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