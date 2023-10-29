import mongoose from "mongoose";

const Schema = mongoose.Schema;

//schema for user
export const User = mongoose.model('User', new Schema({
    username: String,
    password: String,
}));

//truck schema
export const Truck = mongoose.model("Truck", new Schema({
    truckType: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },
    expenses: {
        type: Schema.Types.ObjectId,
        ref: 'Expenses'
    },
    trips: [{
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    }]
}));

//expenses and sub-objects
export const Expenses = mongoose.model("Expense", new Schema({
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

//i have ideas for expenses to be able calculate the total expenses for the year based on the monthly expenses - will implement once I get feedback from the manager
export const YearlyExpense = mongoose.model("YearlyExpense", new Schema({
    year: Number,
    ltoReg: Number,
    fcieReg: Number,
    stickerReg: Number,
    maintenance: Number
}));

export const MonthlyExpense = mongoose.model("MonthlyExpense", new Schema({
    month: String,
    year: Number,
    maintenance: Number, //aggravated by the number of trips
    dieselConsumption: Number //aggravated by the number of trips
}));

export const Trip = mongoose.model("Trip", new Schema({
    driver: {
        name: {
            type: String,
            required: true
        },
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    },
    helper: {
        name: {
            type: String,
            required: true
        },
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
        type: String
    },
    timeReturned: {
        type: String
    },
    status: {
        type: String
    },
    distance: {
        type: Number
    },
    dieselCost: {
        type: Number
    },
    dieselConsumption: {
        type: Number
    },
    tollFee: {
        type: Number
    },
    pathway: {
        type: Number
    },
    totalTripExpense: {
        type: Number
    }
}));
