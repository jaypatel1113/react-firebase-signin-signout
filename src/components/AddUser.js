import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { serverTimestamp } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

import { db } from "../firebase";
import { AuthContext } from "./ContextProvider/AuthContext";

const AddUser = () => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const history = useNavigate();

    const [inpval, setINP] = useState({});

    const setdata = (e) => {
        // console.log(e.target.value, e.target.name);
        const { name, value } = e.target;
        setINP((preval) => {
            return {
                ...preval,
                [name]: value,
            };
        });
    };

    const addinpdata = async (e) => {
        e.preventDefault();

        const { erno, name, mobile } = inpval;

        if (erno === "") {
            toast.warn("Enter the Enrollment Number");
        } else if (name === "") {
            toast.warn("Enter the name");
        } else if (mobile === "") {
            toast.warn("Enter the Mobile Number");
        } else {
            setLoading(true);
            try {
                const adddoc = await addDoc(collection(db, currentUser.uid), {
                    ...inpval,
                    timeStamp: serverTimestamp(),
                });
                // console.log(adddoc);
                if(adddoc) {
                    history("/users");
                    toast.success("Added Successfully 😁");
                } else {
                    toast.error("Error in adding new user! 😢");  
                }
            } catch (error) {
                // console.log(error);
                toast.error("Something went wrong! 😢");  
            }
        }
    };

    return (
        <>
            {!loading ? (
                <div className="container container1">
                    <form className="mt-4 backrel todo">
                        <NavLink to={`/users`} style={{ "--i": "#ffc107" }}>
                            <button className="view back btn btn-primary mx-2">
                                <ArrowBackIosNewOutlinedIcon />
                            </button>
                        </NavLink>
                        <div className="container cont2 p-5 d-flex justify-content-center align-item-center flex-column">
                            <div className="mb-3 col-12">
                                <label for="erno" className="form-label todo">
                                    Enrollment Number
                                </label>
                                <input
                                    type="number"
                                    value={inpval.erno}
                                    onChange={setdata}
                                    name="erno"
                                    className="form-control todo"
                                    id="erno"
                                    placeholder="Enter Enrollment Number"
                                />
                            </div>
                            <div className="mb-3 col-12">
                                <label for="name" className="form-label todo">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={inpval.name}
                                    onChange={setdata}
                                    name="name"
                                    className="form-control todo"
                                    id="name"
                                    placeholder="Enter your Name"
                                />
                            </div>
                            <div className="mb-3 col-12">
                                <label for="mobile" className="form-label todo">
                                    Mobile
                                </label>
                                <input
                                    type="number"
                                    value={inpval.mobile}
                                    onChange={setdata}
                                    name="mobile"
                                    className="form-control todo"
                                    id="mobile"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>
                            <button
                                type="submit"
                                onClick={addinpdata}
                                className="col-12 specbtn sbtn mt-5"
                                style={{ "--i": "#fd7e14" }}
                            >
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
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
export default AddUser;
