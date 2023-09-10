import mongoose, { mongo } from "mongoose";
//commit
const driverSchema = mongoose.Schema(
    {
        DriverID: {
            type: Number,
            required: true
        },
        DriverFirstName: {
            type: String,
            required: true
        },
        DriverLastName: {
            type: String,
            required: true
        },
        DriverContactNo: {
            type: Number,
            required: true
        },
        DriverLicenseNo: {
            type: String,
            required: true
        },
    }
)
export const Driver = mongoose.model('DriverDatabase', driverSchema);