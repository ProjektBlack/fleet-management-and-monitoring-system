import mongoose, { mongo } from "mongoose";
//commit
const expensesSchema = mongoose.Schema(
    {
        ExpensesID: {
            type: Number,
            required: true
        },
        ExpensesRevenue: {
            type: Number,
            required: true
        },
        DepreciationExpenses: {
            type: Number,
            required: true
        },
        ExpensesAmortization: {
            type: Number,
            required: true
        },
        MaintenanceCost: {
            type: Number,
            required: true
        },
        TruckRegis: {
            type: Number,
            required: true
        },
        Sticker: {
            type: Number,
            required: true
        },
        DriverSalary: {
            type: Number,
            required: true
        },
        HelperSalary: {
            type: Number,
            required: true
        },
        Trips: {
            type: Number,
            required: true
        },
        TotalKm: {
            type: Number,
            required: true
        },
        TotalExpense: {
            type: Number,
            required: true
        },
        CostAve: {
            type: Number,
            required: true
        },
        TollFee : {
            type: Number,
            required: true
        },
        Diesel  : {
            type: Number,
            required: true
        },
        DieselpLiters  : {
            type: Number,
            required: true
        },
        OtherExpense  : {
            type: Number,
            required: true
        },
    }
)
export const Expenses = mongoose.model('ExpensesDatabase', expensesSchema);