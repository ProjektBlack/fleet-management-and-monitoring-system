import React from 'react';
import ReturnButton from "../components/widgets/subcomponents/ReturnButton";
const Missing = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <ReturnButton />
        </div>
    );
};

export default Missing;
