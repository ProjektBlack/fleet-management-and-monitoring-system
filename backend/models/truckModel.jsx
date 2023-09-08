import mongoose, { mongo } from "mongoose";

const truckSchema = mongoose.Schema(
    {
        TruckID: {
            type: Number,
            required: true
        },
        PlateNo: {
            type: String,
            required: true
        },
        TruckType: {
            type: String,
            required: true
        },
        Revenue: {
            type: Number,
            required: true
        },
        Depreciation: {
            type: Number,
            required: true
        },
        Amortization: {
            type: Number,
            required: true
        },
        TotalFeeExpenses: {
            type: Number,
            required: true
        },
        FCIE: {
            type: Number,
            required: true
        },
        REGISTRATION: {
            type: Number,
            required: true
        }
    }
)
export const Truck = mongoose.model('Temp', truckSchema);