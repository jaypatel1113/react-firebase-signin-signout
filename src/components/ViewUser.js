import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { db } from "../firebase";
import { AuthContext } from "./ContextProvider/AuthContext";

const ViewUser = () => {
    const [loading, setLoading] = useState(true);
    const [getuserdata, setUserdata] = useState({});
    const { currentUser } = useContext(AuthContext);
    // console.log(getuserdata);

    const { id } = useParams("");
    // console.log(id);

    const history = useNavigate();

    const getdata = async () => {
        setLoading(true);

        try {
            const docRef = doc(db, currentUser.uid, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                //   console.log("Document data:", docSnap.data());
                let finaldata = [];
                finaldata.push({
                    id,
                    erno: docSnap.data().erno,
                    mobile: docSnap.data().mobile,
                    name: docSnap.data().name,
                });
                setUserdata(finaldata);
                // console.log(finaldata);
                // console.log(getuserdata);
            } else {
                // doc.data() will be undefined in this case
                // console.log("No such document!");
                toast.error("Data not exit! 😢");
            }
            setLoading(false);
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong! 😢");
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const deleteuser = async (id) => {
        setLoading(true);
        // console.log(id);
        try {
            const res = await deleteDoc(doc(db, currentUser.uid, id));
            // console.log(res);
            if(res === undefined) {
                toast.success("Deleted Successfully 😁");
                history("/users");
            } else {  
                toast.error("Something went wrong! 😢");
            }
        } catch (err) {
            // console.log(err);
            toast.error("Something went wrong! 😢");
        }
        setLoading(false);
    };

    return (
        <>
            {!loading ? (
                <div className="container container1 padd">
                    <span className="todo notfound">
                        <h1
                            style={{ fontWeight: 100, fontSize: "4rem" }}
                            className="mb-5"
                        >
                            Welcome&nbsp;
                            <span className="uniq">{getuserdata[0].name}</span>
                        </h1>
                        <div className="row row1">
                            <div className="left_view col-12">
                                <div className="row row1">
                                    <div className="col-6 plpl">
                                        <img
                                            src="/man.png"
                                            style={{ width: "7.5rem" }}
                                            alt="profile"
                                        />
                                    </div>
                                    <div className="my-auto col-6 text-right">
                                        <NavLink
                                            to={`/edit/${getuserdata[0].id}`}
                                            style={{ "--i": "#0dcaf0" }}
                                        >
                                            <button className="view btn btn-primary mx-2">
                                                <CreateIcon />
                                            </button>
                                        </NavLink>
                                        <button
                                            className="view btn btn-danger"
                                            onClick={() => deleteuser(getuserdata[0].id)}
                                            style={{ "--i": "#dc3545" }}
                                        >
                                            <DeleteOutlineIcon />
                                        </button>
                                        <button
                                            className="view btn btn-primary mx-2"
                                            style={{ "--i": "#ffc107" }}
                                            onClick={() => history(-1)}
                                        >
                                            <ArrowBackIosNewOutlinedIcon />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="mt-5 dgird">
                                    <span className="minmin">
                                        Enrollent Number
                                    </span>
                                    <span>{getuserdata[0].erno}</span>
                                </h3>
                                <h3 className="mt-4 dgird">
                                    <span className="minmin">Name</span>
                                    <span>{getuserdata[0].name}</span>
                                </h3>
                                <h3 className="mt-4 dgird">
                                    <span className="minmin">Mobile</span>
                                    {/* <PhoneAndroidIcon /> */}
                                    <span>+91 {getuserdata[0].mobile}</span>
                                </h3>
                            </div>
                        </div>
                    </span>
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

export default ViewUser;
