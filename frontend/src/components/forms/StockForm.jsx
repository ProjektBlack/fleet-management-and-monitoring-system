import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateStock = (props) => {
    const [StockID, setStockID] = useState('');
    const [StockOutNo, setStockOutNo] = useState('');
    const [StockDate, setStockDate] = useState('');
    const [Qty, setQty] = useState('');
    const [Particular, setParticular] = useState('');
    const [MarketPrice, setMarketPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateStock = async () => {
        try {
            const data = {
                StockID,
                StockOutNo,
                StockDate,
                Qty,
                Particular,
                MarketPrice,
            };
            setLoading(true);
            await axios.post('http://localhost:2222/stocks', data);
            setLoading(false);
            navigate("/stocks");
        } catch (error) {
            setLoading(false);
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Stock Record</h5>
                <label>Stock ID: </label>
                <input
                    type="number"
                    value={StockID}
                    onChange={(e) => setStockID(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Stock Out No: </label>
                <input
                    type="text"
                    value={StockOutNo}
                    onChange={(e) => setStockOutNo(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Stock Date: </label>
                <input
                    type="date"
                    value={StockDate}
                    onChange={(e) => setStockDate(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Quantity: </label>
                <input
                    type="number"
                    value={Qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Particular: </label>
                <input
                    type="text"
                    value={Particular}
                    onChange={(e) => setParticular(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Market Price: </label>
                <input
                    type="number"
                    value={MarketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    className="form-control"
                    required
                />
                <button
                    className="btn btn-success mx-auto d-flex mt-4 mb-4"
                    onClick={handleCreateStock}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateStock;