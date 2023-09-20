import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import Sidebar from "../Sidebar";
import Spinner from "../Spinner";
import { Stock } from "../../../../backend/models/models";
//table's kinda squished - change layout later
//general analysis of how this works
const StocksTable = () => {
    // rendering load states
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    // get data
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:2222/stock")
            .then((response) => {
                setStocks(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, [])

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div style={{ overflowX: "auto", marginLeft: "17%" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stock ID</th>
                                <th>Out No.</th>
                                <th>Date</th>
                                <th>Qty</th>
                                <th>Particular</th>
                                <th>Market Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* renders the information */}
                            {stocks.map((stock, index) => (
                                <tr key={stock.StockID}>
                                    <td>{stock.StockID}</td>
                                    <td>{stock.StockOutNo}</td>
                                    <td>{stock.StockDate}</td>
                                    <td>{stock.Qty}</td>
                                    <td>{stock.Particular}</td>
                                    <td>{stock.MarketPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StocksTable;