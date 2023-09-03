import React from "react";

//build component
const CardComponent = (props) => {
    return (
        <div className="card mx-auto">
            <div className="card-header">
                <h3>Sample</h3>
            </div>
            <div className="card-body">
                <p>This is a sample card.</p>
            </div>
        </div>
    );
}

export default CardComponent;