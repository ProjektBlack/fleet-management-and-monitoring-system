import axios from "axios";
export async function getYearlyExpenses() {
    try {
        const response = await axios.get("http://localhost:2222/expenses/yearly");
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}
export async function getPlateNumber(id) {
    try {
        const response = await axios.get(`http://localhost:2222/trucks/${id}`);
        return response.data.plateNumber;
    } catch (error) {
        console.log(error);
    }
}
export async function getTrips() {
    try {
        const response = await axios.get("http://localhost:2222/trips");
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}
export async function getTrucks() {
    try {
        const response = await axios.get("http://localhost:2222/trucks/status");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export async function getMonthlyExpenses() {
    try {
        const response = await axios.get("http://localhost:2222/expenses/monthly");
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}