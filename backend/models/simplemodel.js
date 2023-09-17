import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Customer
const customerSchema = new Schema({
  CustomerID: { type: Number, required: true },
  CustomerFirstName: { type: String, required: true },
  CustomerLastName: { type: String, required: true },
  CustomerContactNo: { type: Number, required: true },
  CustomerEmail: { type: String, required: true },
});

export const Customer = mongoose.model("CustomerDatabase", customerSchema);

// Driver
const driverSchema = new Schema({
  DriverID: { type: Number, required: true },
  DriverFirstName: { type: String, required: true },
  DriverLastName: { type: String, required: true },
  DriverContactNo: { type: Number, required: true },
  DriverLicenseNo: { type: String, required: true },
});

export const Driver = mongoose.model("DriverDatabase", driverSchema);

// Expenses
const expensesSchema = new Schema({
  ExpensesID: { type: Number, required: true },
  ExpensesRevenue: { type: Number, required: true },
  DepreciationExpenses: { type: Number, required: true },
  ExpensesAmortization: { type: Number, required: true },
  MaintenanceCost: { type: Number, required: true },
  TruckRegis: { type: Number, required: true },
  Sticker: { type: Number, required: true },
  DriverSalary: { type: Number, required: true },
  HelperSalary: { type: Number, required: true },
  Trips: { type: Number, required: true },
  TotalKm: { type: Number, required: true },
  TotalExpense: { type: Number, required: true },
  CostAve: { type: Number, required: true },
  TollFee: { type: Number, required: true },
  Diesel: { type: Number, required: true },
  DieselpLiters: { type: Number, required: true },
  OtherExpense: { type: Number, required: true },
});

export const Expenses = mongoose.model("ExpensesDatabase", expensesSchema);

// Route
const routeSchema = new Schema({
  RouteID: { type: Number, required: true },
  InitialLoc: { type: String, required: true },
  Destination: { type: String, required: true },
  Distance: { type: Number, required: true },
  Duration: { type: String, required: true },
});

export const Route = mongoose.model("RouteDatabase", routeSchema);

// Shipment
const shipmentSchema = new Schema({
  ShipmentID: { type: Number, required: true },
  ShipmentDate: { type: Date, required: true },
});

export const Shipment = mongoose.model("ShipmentDatabase", shipmentSchema);

// Stock
const stockSchema = new Schema({
  StockID: { type: Number, required: true },
  StockOutNo: { type: String, required: true },
  StockDate: { type: Date, required: true },
  Qty: { type: Number, required: true },
  Particular: { type: String, required: true },
  MarketPrice: { type: Number, required: true },
});

export const Stock = mongoose.model("StockDatabase", stockSchema);

// Truck
const truckSchema = new Schema({
  TruckID: { type: Number, required: true },
  PlateNo: { type: String, required: true },
  TruckType: { type: String, required: true },
  Revenue: { type: Number, required: true },
  Depreciation: { type: Number, required: true },
  Amortization: { type: Number, required: true },
  TotalFeeExpenses: { type: Number, required: true },
  FCIE: { type: Number, required: true },
  REGISTRATION: { type: Number, required: true },
});

export const Truck = mongoose.model("TruckDatabase", truckSchema);
