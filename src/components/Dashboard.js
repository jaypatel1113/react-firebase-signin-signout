import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { auth } from "../firebase";

const Dashboard = () => {
    const [data, setData] = useState({});
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
        setTimeout(() => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    // toast.success("Logged in Successful 😃");
                    setData({
                        name: user.displayName,
                        email: user.email,
                        imgsrc: user.photoURL,
                    });
                    setLoad(false);
                } else {
                    setData("");
                }
                // console.log(user);
            });
        }, 1000);
    }, []);

    return (
        <>
            {!load ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "calc(100vh - 8rem - 1.5rem)",
                        gap: "15px",
                    }}
                >
                    <img
                        src={data.imgsrc}
                        style={{
                            width: "15rem",
                            height: "15rem",
                            marginTop: 20,
                            borderRadius: "50%",
                            zIndex: 1000,
                        }}
                        alt="access denial 😂"
                    />
                    <h3 style={{ zIndex: 1000, fontSize: "3rem" }}>
                        Name : {data.name}
                    </h3>
                    <h3 style={{ zIndex: 1000, fontSize: "3rem" }}>
                        Email : {data.email}
                    </h3>
                </div>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "calc(100vh - 8rem - 1.5rem)",
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

export default Dashboard;
