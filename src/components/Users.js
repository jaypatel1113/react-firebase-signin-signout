import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { db } from "../firebase";
import { AuthContext } from "./ContextProvider/AuthContext";

import "../index2.css";
import "../App2.css";

const Users = () => {
    const { currentUser } = useContext(AuthContext);
    const [getuserdata, setUserdata] = useState([]);
    const [loading, setLoading] = useState(false);
    // console.log(getuserdata);

    const getdata = async () => {
        setLoading(true);

        try {
            let finaldata = [];
            const querySnapshot = await getDocs(collection(db, currentUser.uid));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());

                finaldata.push({
                    id: doc.id,
                    erno: doc.data().erno,
                    mobile: doc.data().mobile,
                    name: doc.data().name,
                });
            });
            // console.log(finaldata);
            setUserdata(finaldata);
            // console.log(getuserdata);
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong! 😢");
        }
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        getdata();
    }, []);

    const deleteuser = async (id) => {
        setLoading(true);
        // deleting data
        try {
            const res = await deleteDoc(doc(db, currentUser.uid, id))
            // console.log(res);
            if(res === undefined) {
                toast.success("Deleted Successfully 😁");
            } else {  
                toast.error("Something went wrong! 😢");
            }
        } catch (err) {
            // console.log(err);
            toast.error("Something went wrong! 😢");
        }
        setLoading(false);
        getdata();
    };

    return (
        <>
            {!loading ? (
                getuserdata.length === 0 ? (
                    <div
                        className="container container1"
                        style={{ position: "relative" }}
                    >
                        <NavLink to="/adduser" style={{ zIndex: 1000 }}>
                            <button
                                className="specbtn addone"
                                style={{ "--i": "#d63384" }}
                            >
                                ADD USER
                            </button>
                        </NavLink>
                        <span className="notfound">Data Not found</span>
                    </div>
                ) : (
                    <div className="container mt-5">
                        <NavLink to="/adduser" style={{ zIndex: 1000 }}>
                            <button
                                className="specbtn"
                                style={{ "--i": "#d63384" }}
                            >
                                ADD USER
                            </button>
                        </NavLink>
                        <div className="container">
                            <table className="table todo">
                                <thead>
                                    <tr className="">
                                        <th scope="col">Enrollment Number</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Mobile Number</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getuserdata.map((element, id) => {
                                        return (
                                            <>
                                                <tr className="eachItem">
                                                    {/* <th scope="row">{id + 1}</th> */}
                                                    <td>{element.erno}</td>
                                                    <td>{element.name}</td>
                                                    <td>{element.mobile}</td>
                                                    <td>
                                                        <NavLink
                                                            to={`/view/${element.id}`}
                                                        >
                                                            <button
                                                                className="btn btn-success"
                                                                style={{"--i": "#20c997"}}
                                                            >
                                                                <RemoveRedEyeIcon />
                                                            </button>
                                                        </NavLink>
                                                        <NavLink
                                                            to={`/edit/${element.id}`}
                                                        >
                                                            <button
                                                                className="btn btn-primary"
                                                                style={{"--i": "#0dcaf0"}}
                                                            >
                                                                <CreateIcon />
                                                            </button>
                                                        </NavLink>
                                                        <button
                                                            className="del btn btn-danger"
                                                            onClick={() => deleteuser(element.id)}
                                                            style={{"--i": "#dc3545"}}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "calc(100vh - 12rem)",
                        fontSize: "2rem",
                    }}
                >
                    Loading... &nbsp;
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default Users;
