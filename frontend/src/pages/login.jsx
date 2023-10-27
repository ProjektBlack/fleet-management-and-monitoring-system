import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authProvider";
//login page - handle login logic - authenticate, then redirect to home page

const Login = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            console.log(password, username);
            const response = await axios.post("http://localhost:2222/login", {
                username,
                password,
            });
            setUsername("");
            setPassword("");
            const token = response.data.token;
            console.log(token);
            console.log(isAuthenticated)
            setIsAuthenticated(true);
            navigate("/home");
            console.log("why is this not working")
        } catch (error) {
            console.log(error);
            setError("Invalid username or password");
        }
    };

    return (
        <div>
            <div
                style={{
                    height: "100%",
                    paddingTop: "1%",
                    paddingBottom: "10%",
                    backgroundColor: "rgba(223, 228, 234,1.0)",
                }}
            >
                <div
                    className="container"
                    style={{
                        marginTop: "10%",
                        padding: "100px",
                        width: "30%",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div>
                        <h5 style={{ color: "#2E8B57" }}>FMMS</h5>
                        <div className="row">
                            <label htmlFor="username" className="mb-1">
                                Username
                            </label>
                            <input
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="password" className="mb-1">
                                Password
                            </label>
                            <input
                                className="form-control"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="text-danger">{error}</div>}
                        <button
                            className="btn btn-success mt-3 mx-auto d-flex"
                            onClick={handleLogin}
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;