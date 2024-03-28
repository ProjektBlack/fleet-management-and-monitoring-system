//dependencies
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Modal, Button } from "react-bootstrap";
import {
  BsCash,
  BsCashStack,
  BsSearch,
  BsTruck,
  BsPlusCircleFill,
  BsArrowReturnLeft,
} from "react-icons/bs";
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
      <BackToLogin />
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
          <div className="row border-start border-success rounded border-5 dsContainer mb-2">
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
  const [showReportQuery, setShowReportQuery] = useState(false); //used for generating reports
  //misc
  const { user } = useAuth();
  const { id } = useParams(); //identify which truck
  const navigate = useNavigate();
  const [tableToShow, setTableToShow] = useState("trips");
  const [sortType, setSortType] = useState("asc");
  const { enqueueSnackbar } = useSnackbar();
  //filtering monthly reports
  const [showFilters, setShowFilters] = useState(false);
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  async function getReport() {
    const response = await axios.get(
      `http://localhost:2222/expenses/monthly/generate`
    );
    console.log(response.data);
  }

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
              console.log(expense);
              const response = await axios.get(
                `http://localhost:2222/expenses/yearly/${expense}`
              );
              console.log(response.data);
              return response.data;
            })
          );
          console.log(yearlyExpensesData);
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
    getReport();
  }, [id]);

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

  const printTripReport = () => {
    const mainTable = document.getElementById("");
    const totalTable = document.getElementById("");

    const printWindow = window.open("", "_blank");
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
                  title="Show Monthly Expenses"
                >
                  <BsCash />
                </button>
              </div>
              <div className="col-4 text-center">
                <button
                  className="btn btn-success"
                  onClick={() => setTableToShow("yearlyExpenses")}
                  title="Show Yearly Expenses"
                >
                  <BsCashStack />
                </button>
              </div>
              <div className="col-4 text-center">
                <button
                  className="btn btn-success"
                  onClick={() => setTableToShow("trips")}
                  title="Show Trips"
                >
                  <BsTruck />
                </button>
              </div>
            </div>
            <div className="row mb-2">
              <h6>Operations</h6>
              <div className="col-4">
                <Link
                  className="btn btn-warning"
                  to={`/trucks/edit/${id}`}
                  title="Edit Truck"
                >
                  <BsFillPencilFill />
                </Link>
              </div>
              {user.role === "Admin" && (
                <div className="col-4">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(selectedId)}
                    title="Delete Truck"
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
                className="col border rounded p-3 infoContainer"
                style={{ minHeight: "100vh" }}
              >
                <div className="container">
                  <div className="row mb-1">
                    <div className="col-10">
                      <h1>Monthly Expenses</h1>
                    </div>
                    <div className="col text-end">
                      <Link to={`/expenses/new/${id}`} className="btn">
                        <BsPlusCircleFill
                          size={40}
                          className="createIcon createButton"
                        />
                      </Link>
                    </div>
                    <div className="col-1 mx-auto d-flex justify-content-center align-items-center">
                      <button className="btn btn-success">Search</button>
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
                className="p-3 rounded infoContainer"
                style={{ minHeight: "100vh" }}
              >
                <div className="row mb-1">
                  <div className="col-10">
                    <h1>Yearly Expenses</h1>
                  </div>
                  <div className="col text-end">
                    <Link to={`/expenses/new/${id}`} className="btn">
                      <BsPlusCircleFill
                        size={40}
                        className="createIcon createButton"
                      />
                    </Link>
                  </div>
                  {showFilters && (
                    <div className="form-container">
                      <div className="row  mb-2">
                        <div className="col">
                          <h2>Filter</h2>
                        </div>
                        <div className="col text-end">
                          <button onClick={toggleFilters} className="btn ">
                            <BsArrowReturnLeft size={20} />
                          </button>
                        </div>
                      </div>
                      <form>
                        <div className="row mb-2">
                          <div className="col">
                            <label>Starting Year</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Start Year"
                              onChange={(e) => setStartYear(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>End Year</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="End Year"
                              onChange={(e) => setEndYear(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>Status</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Status"
                              onChange={(e) => setStatus(e.target.value)}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                  <div className="col-1 mx-auto d-flex justify-content-center align-items-center">
                    <button className="btn btn-success" onClick={toggleFilters}>
                      Search
                    </button>
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
                      {yearlyExpenses
                        .filter((expense) => {
                          const expenseYear = expense.year;
                          const sYear = startYear;
                          const eYear = endYear;

                          // If start year or end year is empty, return true to include all expenses
                          if (!sYear || !eYear) {
                            return true;
                          }

                          // Check if the expense year is within the start and end years
                          return expenseYear >= sYear && expenseYear <= eYear;
                        })
                        .map((expense) => (
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
                className="p-3 rounded infoContainer"
                style={{ minHeight: "100vh" }}
              >
                <div className="row mb-1">
                  <div className="container"></div>
                  <div className="col">
                    <h1>Trips</h1>
                  </div>
                  <div className="col d-flex align-items-center justify-content-center">
                    <select
                      className="form-select"
                      onChange={(e) => setSortType(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  {showFilters && (
                    <div className="form-container">
                      <div className="row  mb-2">
                        <div className="col">
                          <h2>Filter</h2>
                        </div>
                        <div className="col text-end">
                          <button onClick={toggleFilters} className="btn ">
                            <BsArrowReturnLeft size={20} />
                          </button>
                        </div>
                      </div>
                      <form>
                        <div className="row mb-2">
                          <div className="col">
                            <label>Status</label>
                            <select
                              className="form-control"
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">None</option>
                              <option value="Pending">Pending</option>
                              <option value="Done">Done</option>
                            </select>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>Starting Year</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Start Year"
                              onChange={(e) => setStartYear(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>Starting Month</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Start Month"
                              onChange={(e) => setStartMonth(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>End Year</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="End Year"
                              onChange={(e) => setEndYear(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>End Month</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="End Month"
                              onChange={(e) => setEndMonth(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>Customer Location</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Customer Location"
                              onChange={(e) =>
                                setCustomerLocation(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col">
                            <label>Customer Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Customer"
                              onChange={(e) => setCustomer(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col d-flex justify-content-center">
                            <button className="btn btn-success mt-2">
                              Generate Report
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="col d-flex align-items-center justify-content-center">
                    <button
                      className="btn btn-success align-items-center d-flex "
                      onClick={toggleFilters}
                    >
                      Search
                    </button>
                  </div>

                  <div className="col-1">
                    <Link to={`/newtrips/${id}`} className="btn">
                      <BsPlusCircleFill
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
                    minHeight: "80vh",
                    maxHeight: "80vh",
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
                      {trips
                        .sort((a, b) => {
                          const dateA = new Date(
                            `${a.month} ${a.day}, ${a.year}`
                          );
                          const dateB = new Date(
                            `${b.month} ${b.day}, ${b.year}`
                          );
                          return sortType === "asc"
                            ? dateA - dateB
                            : dateB - dateA;
                        })
                        .filter((trip) => {
                          const tripMonthNumber =
                            monthNames.indexOf(trip.month) + 1;
                          const startMonthNumber = startMonth
                            ? monthNames.indexOf(startMonth) + 1
                            : null;
                          const endMonthNumber = endMonth
                            ? monthNames.indexOf(endMonth) + 1
                            : null;

                          return (
                            (!startYear || trip.year >= startYear) &&
                            (!startMonthNumber ||
                              tripMonthNumber >= startMonthNumber) &&
                            (!endYear || trip.year <= endYear) &&
                            (!endMonthNumber ||
                              tripMonthNumber <= endMonthNumber) &&
                            (!customerLocation ||
                              trip.customer.location.includes(
                                customerLocation
                              )) &&
                            (!customer ||
                              trip.customer.name.includes(customer)) &&
                            (!status || trip.status === status)
                          );
                        })
                        .map((trip) => (
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
                                  onClick={() =>
                                    handleTripConfirmation(trip._id)
                                  }
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
                <div className="mt-2">
                  <table>
                    <tr>
                      <td colSpan={13}>
                        <strong>Total Expenses: </strong>
                      </td>
                      <td colSpan={2}>
                        {trips
                          .filter((trip) => {
                            const tripMonthNumber =
                              monthNames.indexOf(trip.month) + 1;
                            const startMonthNumber = startMonth
                              ? monthNames.indexOf(startMonth) + 1
                              : null;
                            const endMonthNumber = endMonth
                              ? monthNames.indexOf(endMonth) + 1
                              : null;

                            return (
                              (!startYear || trip.year >= startYear) &&
                              (!startMonthNumber ||
                                tripMonthNumber >= startMonthNumber) &&
                              (!endYear || trip.year <= endYear) &&
                              (!endMonthNumber ||
                                tripMonthNumber <= endMonthNumber) &&
                              (!customerLocation ||
                                trip.customer.location.includes(
                                  customerLocation
                                )) &&
                              (!customer ||
                                trip.customer.name.includes(customer)) &&
                              (!status || trip.status === status)
                            );
                          })
                          .reduce(
                            (acc, trip) => acc + trip.totalTripExpense,
                            0
                          )}
                      </td>
                    </tr>
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
      <Modal show={showReportQuery} onHide={() => setShowReportQuery(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>
                Start Year:
                <input
                  type="number"
                  min="1900"
                  max="2099"
                  step="1"
                  className="form-control"
                  value={startYear}
                />
              </label>
              <label>
                Start Month:
                <input
                  type="number"
                  min="1"
                  max="12"
                  step="1"
                  className="form-control"
                  value={startMonth}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                End Year:
                <input
                  type="number"
                  min="1900"
                  max="2099"
                  step="1"
                  className="form-control"
                  value={endYear}
                />
              </label>
              <label>
                End Month:
                <input
                  type="number"
                  min="1"
                  max="12"
                  step="1"
                  className="form-control"
                  value={endMonth}
                />
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportQuery(false)}>
            Cancel
          </Button>
          <Button variant="success">Generate</Button>
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
            <div className="row border-start border-success rounded border-5 dsContainer mb-2">
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
            <div className="row border-start border-success rounded border-5 dsContainer mb-2">
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
            <div className="row border-start border-success rounded border-5 dsContainer mb-2">
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
