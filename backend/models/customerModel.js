import mongoose, { mongo } from "mongoose";
//commit
const customerSchema = mongoose.Schema(
    {
        CustomerID: {
            type: Number,
            required: true
        },
        CustomerFirstName: {
            type: String,
            required: true
        },
        CustomerLastName: {
            type: String,
            required: true
        },
        CustomerContactNo: {
            type: Number,
            required: true
        },
        CustomerEmail: {
            type: String,
            required: true
        },
    }
)
export const Customer = mongoose.model('CustomerDatabase', customerSchema);