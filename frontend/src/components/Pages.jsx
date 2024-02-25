//dependencies
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Modal, Button } from "react-bootstrap";
import { BsCash, BsCashStack, BsTruck } from "react-icons/bs";
import axios from "axios";
//components
import {
  Spinner,
  BackButton,
  Sidebar,
  Dashboard,
  CardComponent,
  BackToLogin,
  BackToTrucks,
} from "./Widgets";
import {
  TruckTable,
  YearlyExpensesTable,
  TripsTable,
  MonthlyExpensesTable,
} from "./Tables";
//icons
import {
  BsFillFilePlusFill,
  BsEye,
  BsFillPencilFill,
  BsFillTrashFill,
} from "react-icons/bs";

//login page
export const Login = () => {
  //global state for authentication
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { login } = useAuth();
  //states for login page
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //displays error message if login fails
  const [error, setError] = useState("");
  //used to navigate to home page after login
  //loading state for login
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  //function to handle login
  const handleLogin = async () => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:2222/login            ",
        {
          username,
          password,
        }
      );
      const { token } = response.data;
      login(token);
      setUsername("");
      setPassword("");
      setIsAuthenticated(true);
      setLoading(false);
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/home");
    } catch (error) {
      setLoading(false);
      console.log(error);
      enqueueSnackbar("Login failed!", { variant: "error" });
    }
  };

  const areFormsFilled = () => {
    if (username === "" || password === "") {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <div
        id="loginBackground"
        className="d-flex align-items-center justify-content-center"
      >
        <div
          id="loginPanel"
          className="d-flex align-items-center justify-content-center"
        >
          <form onSubmit={handleLogin}>
            <h3 className="logo">FMMS</h3>
            <div className="row mb-2">
              <label className="mb-2">Username</label>
              <input
                className="form-control"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="row mb-4">
              <label className="mb-2">Password</label>
              <input
                className="form-control"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-danger">{error}</div>
            </div>
            <button
              className="btn btn-success mt-3 mx-auto d-flex fs-6}"
              type="submit"
              disabled={!areFormsFilled() || loading}
            >
              {" "}
              Log In
            </button>
            <div className="text-center mt-1">
              <Link
                to={"/register"}
                className="text-muted text-decoration-none fw-light"
              >
                Not yet registered?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Missing = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <BackButton />
    </div>
  );
};

//home page
export const Home = () => {
  return (
    <div className="row g-2">
      <div className="col-2">
        <Sidebar />
      </div>
      <div id="dashboardContainer" className="col border-0 rounded">
        <Dashboard />
      </div>
    </div>
  );
};

//manage trucks
export const ManageTruck = () => {
  return (
    <div>
      <div className="row g-2">
        <div className="col-2">
          <Sidebar />
        </div>
        <div id="dashboardContainer" className="col border-0 rounded p-4">
          <div className="row border-start border-success rounded border-5 dsContainer mb-3">
            <div className="col-10 p-4">
              <h1>Manage Trucks</h1>
            </div>
          </div>
          <div className="row border-start border-success rounded border-5 dsContainer tableContainer">
            <TruckTable />
          </div>
        </div>
      </div>
    </div>
  );
};

//can split into three separate tables for easier management
//show truck details
export const ShowTruck = () => {
  const [loading, setLoading] = useState(false); //loading
  const [truckInfo, setTruckInfo] = useState({}); //info and ids
  const [expenses, setExpenses] = useState([]); //ids
  const [yearlyExpenses, setYearlyExpenses] = useState([]); //records to map
  const [monthlyExpenses, setMonthlyExpenses] = useState([]); //records to map
  const [trips, setTrips] = useState([]); //records to map
  const [selectedId, setSelectedId] = useState(null); //selected
  //modals
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  //misc
  const { user } = useAuth();
  const { id } = useParams(); //identify which truck
  const navigate = useNavigate();
  const [tableToShow, setTableToShow] = useState("trips");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        //get single truck
        const response = await axios.get(`http://localhost:2222/trucks/${id}`);
        const truckData = response.data;
        setTruckInfo(truckData);
        console.log(truckData);
        setExpenses(truckData.expenses);
        //get all yearly expenses and their data based on the references on expenses.yearlyExpenses
        if (
          truckData &&
          truckData.expenses &&
          truckData.expenses.yearlyExpenses &&
          truckData.expenses.yearlyExpenses.length > 0
        ) {
          const yearlyExpensesData = await Promise.all(
            truckData.expenses.yearlyExpenses.map(async (expense) => {
              const response = await axios.get(
                `http://localhost:2222/expenses/yearly/${expense}`
              );
              return response.data;
            })
          );
          setYearlyExpenses(yearlyExpensesData);
        }
        if (
          truckData &&
          truckData.expenses &&
          truckData.expenses.monthlyExpenses &&
          truckData.expenses.monthlyExpenses.length > 0
        ) {
          //get all monthly expenses based on the references on expenses.monthlyExpenses
          const monthlyExpensesData = await Promise.all(
            truckData.expenses.monthlyExpenses.map(async (expense) => {
              const response = await axios.get(
                `http://localhost:2222/expenses/monthly/${expense}`
              );
              return response.data;
            })
          );
          setMonthlyExpenses(monthlyExpensesData);
        }
        if (truckData && truckData.trips.length > 0) {
          //get all trips and their data based on the reference ids
          const tripData = await Promise.all(
            truckData.trips.map(async (trip) => {
              const response = await axios.get(
                `http://localhost:2222/trips/${trip}`
              );
              return response.data;
            })
          );
          setTrips(tripData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [trips.length, yearlyExpenses.length, monthlyExpenses.length]);

  const handleTripConfirmation = (id) => {
    setSelectedId(id);
    setShowModal1(true);
  };

  const handleMEConfirmation = (id) => {
    setSelectedId(id);
    setShowModal2(true);
  };

  const handleYEConfirmation = (id) => {
    setSelectedId(id);
    setShowModal3(true);
  };

  const deleteTrip = async () => {
    try {
      await axios.delete(`http://localhost:2222/trips/${selectedId}`);
      //remove trip from local state
      setTrips(trips.filter((trip) => trip._id !== selectedId));
      setShowModal1(false);
    } catch (error) {
      console.error(error);
    } finally {
      enqueueSnackbar("Trip deleted!", { variant: "success" });
    }
  };

  const deleteMonthlyExpense = async () => {
    try {
      await axios.delete(
        `http://localhost:2222/expenses/monthly/${selectedId}`
      );
      setMonthlyExpenses(
        monthlyExpenses.filter((expense) => expense._id !== selectedId)
      );
      setShowModal2(false);
      enqueueSnackbar("Monthly expense deleted!", { variant: "success" });
    } catch (error) {
      console.error(error);
    } finally {
      enqueueSnackbar("Monthly expense deleted!", { variant: "success" });
    }
  };

  const deleteYearlyExpense = async () => {
    try {
      await axios.delete(`http://localhost:2222/expenses/yearly/${selectedId}`);
      setYearlyExpenses(
        yearlyExpenses.filter((expense) => expense._id !== selectedId)
      );
      setShowModal3(false);
    } catch (error) {
      // Log the error
      console.error(error);
    } finally {
      enqueueSnackbar("Yearly expense deleted!", { variant: "success" });
    }
  };

  const truckAvailability = (truck) => {
    const hasPendingTrips =
      Array.isArray(truck.trips) &&
      truck.trips.some(
        (trip) => trip.status === "pending" || trip.status === "Pending"
      );
    const isUnderMaintenance = truck.underMaintenance;

    if (hasPendingTrips || isUnderMaintenance) {
      return "Unavailable";
    } else {
      return "Available";
    }
  };

  const handleDelete = () => {
    console.log(id);
    setSelectedId(id);
    setShowModal(true);
  };

  //handles delete function
  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://fmms-api.vercel.app/trucks/?id=${selectedId}`
      );
      if (response.status === 204) {
        enqueueSnackbar("Truck deleted successfully.", { variant: "success" });
        setLoading(false);
        setShowModal(false);
        navigate("/trucks");
      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Process failed.", { variant: "error" });
      setShowModal(false);
      console.log(error);
    }
  };

  return (
    <div>
      <div className="row" style={{ minHeight: "100vh" }}>
        <div className="col-2">
          <div
            className="container rounded p-4 infoContainer"
            style={{ minHeight: "100vh" }}
          >
            <h2 className="">
              <span className="logo">Plate No.</span> {truckInfo.plateNumber}
            </h2>
            <div className="row mb-1">
              <h6>Table</h6>
              <div className="col-4 text-center">
                <button
                  className="btn btn-success"
                  onClick={() => setTableToShow("monthlyExpenses")}
                >
                  <BsCash />
                </button>
              </div>
              <div className="col-4 text-center">
                <button
                  className="btn btn-success"
                  onClick={() => setTableToShow("yearlyExpenses")}
                >
                  <BsCashStack />
                </button>
              </div>
              <div className="col-4 text-center">
                <button
                  className="btn btn-success"
                  onClick={() => setTableToShow("trips")}
                >
                  <BsTruck />
                </button>
              </div>
            </div>
            <div className="row mb-2">
              <h6>Operations</h6>
              <div className="col-4">
                <Link className="btn btn-warning" to={`/trucks/edit/${id}`}>
                  <BsFillPencilFill />
                </Link>
              </div>
              {user.role === "Admin" && (
                <div className="col-4">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(selectedId)}
                  >
                    <BsFillTrashFill />
                  </button>
                </div>
              )}
              <div className="col-4">
                <BackToTrucks />
              </div>
            </div>
            <div className="row">
              <h6>Type</h6>
              <p className="text-muted">{truckInfo.truckType}</p>
            </div>
            <div className="row">
              <h6>Status</h6>
              <p className="text-muted">{truckAvailability(truckInfo)}</p>
            </div>
            <div className="row">
              <h6>Maintenance Status</h6>
              <p className="text-muted">
                {truckInfo.underMaintenance
                  ? "Under Maintenance"
                  : "Not Under Maintenance"}
              </p>
            </div>
          </div>
        </div>
        <div className="col-10">
          {tableToShow === "monthlyExpenses" && (
            <div className="row">
              <div
                className="col border rounded p-4 infoContainer"
                style={{ minHeight: "100vh" }}
              >
                <div className="container">
                  <div className="row mb-1">
                    <div className="col-10">
                      <h1>Monthly Expenses</h1>
                    </div>
                    <div className="col text-end">
                      <Link to={`/expenses/new/${id}`} className="btn">
                        <BsFillFilePlusFill
                          size={40}
                          className="createIcon createButton"
                        />
                      </Link>
                    </div>
                  </div>
                  {loading ? (
                    <div className="text-center" style={{ minHeight: "85vh" }}>
                      <Spinner />
                    </div>
                  ) : (
                    <div
                      style={{
                        overflowX: "auto",
                        overflowY: "auto",
                        minHeight: "85vh",
                        maxHeight: "85vh",
                      }}
                    >
                      <table className="table table-bordered table-hover table-striped">
                        <thead className="">
                          <th>Month</th>
                          <th>Year</th>
                          <th>Maintenance Cost</th>
                          <th>Total Trips</th>
                          <th>Diesel Consumption</th>
                          <th>Total Monthly Expenses</th>
                          <th>Operations</th>
                        </thead>
                        <tbody>
                          {monthlyExpenses.map((expense) => (
                            <tr key={expense._id}>
                              <td>{expense.month}</td>
                              <td>{expense.year}</td>
                              <td>{expense.maintenance}</td>
                              <td>{expense.totalTrips}</td>
                              <td>{expense.dieselConsumption}</td>
                              <td>{expense.totalMonthlyExpenses}</td>
                              <td className="text-center">
                                <Link
                                  id="showIcon"
                                  to={`/expenses/monthly/edit/${expense._id}/${id}`}
                                  style={{ marginRight: "2%" }}
                                >
                                  <BsEye className="showIcon" />
                                </Link>
                                {user.role == "Admin" && (
                                  <BsFillTrashFill
                                    className="trashIcon"
                                    onClick={() =>
                                      handleMEConfirmation(expense._id)
                                    }
                                  />
                                )}
                                <Link
                                  to={`/expenses/monthly/edit/${expense._id}`}
                                  style={{ marginLeft: "2%" }}
                                  className="editIcon"
                                >
                                  <BsFillPencilFill />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {tableToShow === "yearlyExpenses" && (
            <div className="row">
              <div
                className="p-4 rounded infoContainer"
                style={{ minHeight: "100vh" }}
              >
                <div className="row mb-1">
                  <div className="col-10">
                    <h1>Yearly Expenses</h1>
                  </div>
                  <div className="col text-end">
                    <Link to={`/expenses/new/${id}`} className="btn">
                      <BsFillFilePlusFill
                        size={40}
                        className="createIcon createButton"
                      />
                    </Link>
                  </div>
                </div>
                <div
                  style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    minHeight: "85vh",
                    maxHeight: "85vh",
                  }}
                >
                  <table className="table table-bordered table-hover table-striped">
                    <thead className="">
                      <th>Year</th>
                      <th>LTO Fees</th>
                      <th>FCIE Fees</th>
                      <th>Sticker Fees</th>
                      <th>Maintenance Costs</th>
                      <th>Total Trips</th>
                      <th>Total Diesel Consumption</th>
                      <th>Total Expenses</th>
                      <th>Operations</th>
                    </thead>
                    <tbody>
                      {yearlyExpenses.map((expense) => (
                        <tr key={expense._id}>
                          <td>{expense.year}</td>
                          <td>{expense.ltoReg}</td>
                          <td>{expense.fcieReg}</td>
                          <td>{expense.stickerReg}</td>
                          <td>{expense.maintenance}</td>
                          <td>{expense.totalTrips}</td>
                          <td>{expense.totalDieselConsumption}</td>
                          <td>{expense.totalExpenses}</td>
                          <td className="text-center">
                            <Link
                              id="showIcon"
                              to={`/expenses/yearly/edit/${expense._id}/${id}`}
                              className="showIcon"
                              style={{ marginRight: "2%" }}
                            >
                              <BsEye />
                            </Link>
                            {user.role == "Admin" && (
                              <BsFillTrashFill
                                className="trashIcon"
                                onClick={() =>
                                  handleYEConfirmation(expense._id)
                                }
                              />
                            )}
                            <Link
                              to={`/expenses/yearly/edit/${expense._id}`}
                              style={{ marginLeft: "2%" }}
                              className="editIcon"
                            >
                              <BsFillPencilFill />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tableToShow === "trips" && (
            <div className="row">
              <div
                className="p-4 rounded infoContainer"
                style={{ minHeight: "100vh" }}
              >
                <div className="row mb-1">
                  <div className="container"></div>
                  <div className="col">
                    <h1>Trips</h1>
                  </div>
                  <div className="col text-end ">
                    <Link to={`/newtrips/${id}`} className="btn">
                      <BsFillFilePlusFill
                        size={40}
                        className="createIcon createButton"
                      />
                    </Link>
                  </div>
                </div>
                <div
                  style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    minHeight: "85vh",
                    maxHeight: "85vh",
                  }}
                >
                  <table className="table table-bordered table-hover table-striped">
                    <thead className="">
                      <tr className="bg-primary">
                        <th style={{}}>Customer</th>
                        <th style={{}}>Customer Location</th>
                        <th style={{}}>Driver</th>
                        <th style={{}}>Helper</th>
                        <th style={{}}>Date</th>
                        <th style={{}}>Time Dispatched</th>
                        <th style={{}}>Time Received</th>
                        <th style={{}}>Time Returned</th>
                        <th style={{}}>Status</th>
                        <th style={{}}>Distance</th>
                        <th style={{}}>Diesel Consumption</th>
                        <th style={{}}>Toll Fees</th>
                        <th style={{}}>Pathway Fees</th>
                        <th style={{}}>Total Trip Expenses</th>
                        <th style={{}}>Operations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.map((trip) => (
                        <tr key={trip._id}>
                          <td>{trip.customer.name}</td>
                          <td>{trip.customer.location}</td>
                          <td>{trip.driver.name}</td>
                          <td>{trip.helper.name}</td>
                          <td>
                            {trip.month} {trip.day}, {trip.year}
                          </td>
                          <td>{trip.timeDispatched}</td>
                          <td>{trip.timeReceived}</td>
                          <td>{trip.timeReturned}</td>
                          <td>{trip.status}</td>
                          <td>{trip.distance}</td>
                          <td>{trip.dieselConsumption}</td>
                          <td>{trip.tollFee}</td>
                          <td>{trip.pathway}</td>
                          <td>{trip.totalTripExpense}</td>
                          <td className="text-center">
                            {user.role == "Admin" && (
                              <BsFillTrashFill
                                className="trashIcon"
                                onClick={() => handleTripConfirmation(trip._id)}
                              />
                            )}
                            <Link
                              to={`/trips/edit/${trip._id}`}
                              style={{ marginLeft: "2%" }}
                            >
                              <BsFillPencilFill className="editIcon" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal1} onHide={() => setShowModal1(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this trip?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal1(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteTrip}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this monthly expense?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal2(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteMonthlyExpense}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal3} onHide={() => setShowModal3(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this yearly expense?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal3(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteYearlyExpense}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this truck?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

//manage expenses
export const ManageYearlyExpenses = () => {
  return (
    <div>
      <div className="row g-2">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col-10">
          <div id="dashboardContainer" className="col border-0 rounded p-4">
            <div className="row border-start border-success rounded border-5 dsContainer mb-3">
              <div className="col-10 p-4">
                <h1>Yearly Expenses</h1>
              </div>
            </div>
            <div className="row border-start border-success rounded border-5 dsContainer tableContainer">
              <YearlyExpensesTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ManageMonthlyExpenses = () => {
  return (
    <div>
      <div className="row g-2">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col-10">
          <div id="dashboardContainer" className="col border-0 rounded p-4">
            <div className="row border-start border-success rounded border-5 dsContainer mb-3">
              <div className="col-10 p-4">
                <h1>Monthly Expenses</h1>
              </div>
            </div>
            <div className="row border-start border-success rounded border-5 dsContainer tableContainer">
              <MonthlyExpensesTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//manage trips
export const ManageTrips = () => {
  return (
    <div>
      <div className="row g-2">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col">
          <div id="dashboardContainer" className="col border-0 rounded p-4">
            <div className="row border-start border-success rounded border-5 dsContainer mb-3">
              <div className="col-10 p-4">
                <h1>Manage Trips</h1>
              </div>
            </div>
            <div className="row border-start border-success rounded border-5 dsContainer tableContainer">
              <TripsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
