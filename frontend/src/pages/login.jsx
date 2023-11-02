import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import axios from "axios";

const Login = () => {
    //global state for authentication
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    //states for login page
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //displays error message if login fails
    const [error, setError] = useState("");
    //used to navigate to home page after login
    const navigate = useNavigate();

    //function to handle login
    const handleLogin = async () => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:2222/login",
                {
                    username,
                    password,
                });
            setUsername("");
            setPassword("");
            setIsAuthenticated(true);
            navigate("/home");
        } catch (error) {
            console.log(error);
            setError(error.response.data.message || "Something went wrong. Please contact support.");
        }
    };

    return (
        <div>
            <div id="loginBackground" className="d-flex align-items-center justify-content-center">
                <div id="loginPanel" className="d-flex align-items-center justify-content-center">
                    <form onSubmit={handleLogin} noValidate>
                        <h5 className="logo">FMMS</h5>
                        <div className="row mb-2">
                            <label className="mb-2">Username</label>
                            <input className="form-control" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="row mb-4">
                            <label className="mb-2">Password</label>
                            <input className="form-control" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className="text-danger">{error}</div>
                        </div>
                        <button className="btn btn-success mt-3 mx-auto d-flex" type="submit">Log In</button>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Login;