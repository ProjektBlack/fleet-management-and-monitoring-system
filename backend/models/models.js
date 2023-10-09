import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define truck schema and export model
export const Truck = mongoose.model("TruckDatabase", new Schema({
    truckType: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true
    },
    expenses: [ //multiple instances
        {
            type: Schema.Types.ObjectId,
            ref: 'Expense'
        }
    ],
    trips: [ //multiple instances
        {
            type: Schema.Types.ObjectId,
            ref: 'Trip'
        }
    ]
}));

export const YearlyExpense = mongoose.model("YearlyExpense", new Schema({
    year: Number,
    ltoReg: Number,
    fcieReg: Number,
    stickerReg: Number,
    maintenance: Number
}));

export const MonthlyExpense = mongoose.model("MonthlyExpense", new Schema({
    month: String,
    maintenance: Number,
    dieselConsumption: Number
}));

export const Expenses = mongoose.model("ExpensesDatabase", new Schema({
    yearlyExpenses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'YearlyExpense'
        }
    ],
    monthlyExpenses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'MonthlyExpense'
        }
    ]
}));

export const Driver = mongoose.model("DriverDatabase", new Schema({
    name: String, //searchable using name
    licenseNumber: String
}));

export const Customer = mongoose.model("CustomerDatabase", new Schema({
    name: String, //searchable using name
    contactNumber: String,
    location: String
}));

export const Helper = mongoose.model("HelperDatabase", new Schema({
    name: String,
    contactNumber: String
}));

export const Trip = mongoose.model("TripDatabase", new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    helper: {
        type: Schema.Types.ObjectId,
        ref: 'Helper',
    },
    date: {
        type: Date,
        required: true
    },
    timeDispatched: {
        type: String,
        required: true
    },
    timeReceived: {
        type: String,
    },
    timeReturned: {
        type: String,
    }
}));
