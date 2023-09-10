import mongoose, { mongo } from "mongoose";

const routeSchema = mongoose.Schema(
    {
        RouteID: {
            type: Number,
            required: true
        },
        InitialLoc: {
            type: String,
            required: true
        },
        Destination: {
            type: String,
            required: true
        },
        Distance: {
            type: Number,
            required: true
        },
        Duration: {
            type: String,
            required: true
        },
    }
)
export const Route = mongoose.model('RouteDatabase', routeSchema);