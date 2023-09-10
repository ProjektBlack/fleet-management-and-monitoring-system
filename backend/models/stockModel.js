import mongoose, { mongo } from "mongoose";
//commit
const stockSchema = mongoose.Schema(
    {
        StockID: {
            type: Number,
            required: true
        },
        StockOutNo: {
            type: String,
            required: true
        },
        StockDate: {
            type: Date,
            required: true
        },
        Qty: {
            type: Number,
            required: true
        },
        Particular: {
            type: String,
            required: true
        },
        MarketPrice: {
            type: Number,
            required: true
        },
    }
)
export const Stock = mongoose.model('StockDatabase', stockSchema);