import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import Users from "./components/Users";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import ViewUser from "./components/ViewUser";
import { AuthContext } from "./components/ContextProvider/AuthContext";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/react-toastify/dist/ReactToastify.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";


function App() {
    const { currentUser } = useContext(AuthContext);

    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/" />;
    };
    const RequireAuthtoDash = ({ children }) => {
        return currentUser ? <Navigate to="/dash" /> : children;
    };

    // console.log(currentUser);

    return (
        <>
            <div className="main">
                <Header />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <RequireAuthtoDash>
                                <Login />
                            </RequireAuthtoDash>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <RequireAuthtoDash>
                                <Register />
                            </RequireAuthtoDash>
                        }
                    />
                    <Route
                        path="/dash"
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <RequireAuth>
                                <Users />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/adduser"
                        element={
                            <RequireAuth>
                                <AddUser />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <RequireAuth>
                                <EditUser />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/view/:id"
                        element={
                            <RequireAuth>
                                <ViewUser />
                            </RequireAuth>
                        }
                    />

                    <Route path="*" element={<Error />} />
                </Routes>
                <ToastContainer
                    theme="colored"
                    position="bottom-right"
                    style={{ fontSize: "14px" }}
                />
            </div>
        </>
    );
}

export default App;
