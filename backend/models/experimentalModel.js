//this is an experimental data model for simpler use cases
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
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
        yearlyExpenses: [{
            year: String,
            ltoReg: Number,
            fcieReg: Number,
            stickerReg: Number,
            maintenance: Number,
            totalTrips: Number,
            totalDieselConsumption: Number,
            totalExpenses: Number
        }],
        monthlyExpenses: [{
            month: String,
            year: String,
            maintenance: Number,
            totalTrips: Number,
            dieselConsumption: Number
        }]
    },
    trips: [{
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
        year: {
            type: String,
            required: true
        },
        month: {
            type: String,
            required: true
        },
        day: {
            type: String,
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
    }]
});

const Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;
