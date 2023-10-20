import mongoose from "mongoose";

const Schema = mongoose.Schema;
/*comments:
    data integrity: minimum and maximum limits
*/
//truck schema
export const Truck = mongoose.model("Truck", new Schema({
    truckType: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true
    },
    expenses: {

        type: Schema.Types.ObjectId,
        ref: 'Expense'

    },
    trips: [ //multiple instances
        {
            type: Schema.Types.ObjectId,
            ref: 'Trip'
        }
    ]
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
//entities
export const Driver = mongoose.model("Driver", new Schema({
    name: String, //searchable using name
    licenseNumber: String
}));

export const Helper = mongoose.model("Helper", new Schema({
    name: String,
    contactNumber: String
}));

export const Customer = mongoose.model("Customer", new Schema({
    name: String, //searchable using name
    contactNumber: String,
    location: String
}));

export const Trip = mongoose.model("Trip", new Schema({
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
