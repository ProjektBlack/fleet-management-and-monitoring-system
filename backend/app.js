// Import modules
import express from "express";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import router from "./routes/routes.js";
// Import variables
import { PORT, dbUrl, secretKey } from "./config.js";
//import user model
import { User } from "./models/models.js";

//starting the server
const app = express();

//for parsing json data
app.use(express.json());
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

//routes
//using middleware for other routes
app.use('/', router);
//route for logging in
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
            expiresIn: '2h',
        });
        //jwt for future use
        res.status(200).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in.' });
    }
});

//route for creating a new user
app.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error creating user' });
    }
});

//connect to the database
mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("App connected to the database.");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Error connecting to the database: ${error.message}`);
    });