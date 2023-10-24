import React from 'react';

const BackButton = () => {
    const goBack = () => {
        window.history.back();
    };

    return (
        <button className="btn btn-outline-success" onClick={goBack}>Return</button>
    );
};

export default BackButton;