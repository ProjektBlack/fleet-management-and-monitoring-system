import React from "react";

//login page - handle login logic - authenticate, then redirect to home page
const Login = (props) => {
    return (
        <div>
            <div className="container" style={{
                padding: '100px', width: '30%', marginTop: '10%', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <form>
                    <h5 style={{ color: '#2E8B57' }}>FMMS</h5>
                    <div className="row">
                        <label htmlFor="username" className="mb-1">Username</label>
                        <input className="form-control" type="text" id="username" name="username" />
                    </div>
                    <div className="row">
                        <label htmlFor="password" className="mb-1">Password</label>
                        <input className="form-control" type="password" id="password" name="password" />
                    </div>
                    <button className="btn btn-success mt-3 mx-auto d-flex" type="submit">
                        Log In
                    </button>
                </form>
            </div>

        </div >
    );
}
export default Login;