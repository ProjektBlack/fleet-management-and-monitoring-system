import React from "react";

const Table = (props) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Plate Number</th>
                    <th scope="col">Model</th>
                    <th scope="col">Mileage</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>NBJ 0981</td>
                    <td>Forward</td>
                    <td>7000 km</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>NTJ 1234</td>
                    <td>10-Wheeler</td>
                    <td>10000 km</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>ABG 7521</td>
                    <td>Elf</td>
                    <td>2000 km</td>
                </tr>
            </tbody>
        </table>
    )
}

export default Table;