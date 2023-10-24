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

export const Trip = mongoose.model("Trip", new Schema({
    driver: {
        name: String,
        licenseNumber: String,
        required: {
            type: Boolean,
            default: true
        }
    },
    customer: {
        name: String,
        contactNumber: String,
        location: String,
        required: {
            type: Boolean,
            default: true
        }
    },
    helper: {
        name: String,
        contactNumber: String
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
    }
    //should have status if completed or not - for ongoing trip listening widget
}));
