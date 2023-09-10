import mongoose, { mongo } from "mongoose";

const shipmentSchema = mongoose.Schema(
    {
        ShipmentID: {
            type: Number,
            required: true
        },
        ShipmentDate: {
            type: Date,
            required: true
        },
    }
)
export const Shipment = mongoose.model('shipmentDatabase', shipmentSchema);