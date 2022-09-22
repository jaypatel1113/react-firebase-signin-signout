import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

import { db } from "../firebase";
import { AuthContext } from "./ContextProvider/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditUser = () => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [oldData, setOldData] = useState();

    const history = useNavigate();

    const [inpval, setINP] = useState({
        erno: "",
        name: "",
        mobile: "",
    });

    const setdata = (e) => {
        // console.log(e.target.value);
        const { name, value } = e.target;
        setINP((preval) => {
            return {
                ...preval,
                [name]: value,
            };
        });
    };

    const { id } = useParams("");
    // console.log(id);

    const getdata = async () => {
        setLoading(true);

        try {
            let dataref = doc(db, currentUser.uid, id);
            setOldData(dataref);
    
            const docSnap = await getDoc(dataref);
            // console.log(docSnap.data());
    
            setINP({
                id,
                erno: docSnap.data().erno,
                mobile: docSnap.data().mobile,
                name: docSnap.data().name,
            });
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong! 😢");   
        }

        setLoading(false);
    };

    useEffect(() => {
        getdata();
    }, []);

    const updateuser = async (e) => {
        e.preventDefault();

        const { erno, name, mobile } = inpval;

        if (erno === "") {
            toast.warn("Enter the Enrollment Number");
        } else if (name === "") {
            toast.warn("Enter the name");
        } else if (mobile === "") {
            toast.warn("Enter the Mobile Number");
        } else {
            // console.log(inpval);
            setLoading(true);
            try {
                const upduser = await updateDoc(oldData, { 
                                                    erno: inpval.erno,
                                                    mobile: inpval.mobile,
                                                    name: inpval.name,
                                                })
                // console.log(upduser);
                if(upduser === undefined) {
                    setLoading(false);
                    toast.success("Updated Successfully 😁");
                    history(-1);
                } else {
                    // console.log(err);
                    toast.error("Something went wrong! 😢");
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
                        <NavLink
                            to={() => history(-1)}
                            style={{ "--i": "#ffc107" }}
                        >
                            <button
                                className="view back btn btn-primary mx-2"
                                onClick={() => history(-1)}
                                style={{ "--i": "#ffc107" }}
                            >
                                <ArrowBackIosNewOutlinedIcon />
                            </button>
                        </NavLink>
                        <div className="container cont2 p-5 d-flex justify-content-center align-item-center flex-column">
                            <div class="mb-3 col-12">
                                <label for="erno" class="form-label todo">
                                    Enrollment Number
                                </label>
                                <input
                                    type="number"
                                    value={inpval.erno}
                                    onChange={setdata}
                                    name="erno"
                                    class="form-control todo"
                                    id="erno"
                                    placeholder="Enter Enrollment Number"
                                />
                            </div>
                            <div class="mb-3 col-12">
                                <label for="name" class="form-label todo">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={inpval.name}
                                    onChange={setdata}
                                    name="name"
                                    class="form-control todo"
                                    id="name"
                                    placeholder="Enter your Name"
                                />
                            </div>
                            <div class="mb-3 col-12">
                                <label for="mobile" class="form-label todo">
                                    Mobile
                                </label>
                                <input
                                    type="number"
                                    value={inpval.mobile}
                                    onChange={setdata}
                                    name="mobile"
                                    class="form-control todo"
                                    id="mobile"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>
                            <button
                                type="submit"
                                onClick={updateuser}
                                class="col-12 mt-5 sbtn specbtn"
                                style={{ "--i": "#fd7e14" }}
                            >
                                Submit
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

export default EditUser;
