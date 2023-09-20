import React from "react";

const Spinner = (props) => {
    return (
        <div className="spinner-border text-success mx-auto d-flex" role="status" style={{ marginTop: "50vh" }}>
            <span className="sr-only"></span>
        </div>
    )
}

export default Spinner;