import React, { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Particles from "./Particles";
import { AuthContext } from "./ContextProvider/AuthContext";
import { auth } from "../firebase";

import "./header.css";

const Header = () => {
    const { currentUser, dispatch } = useContext(AuthContext);
    const [tog, setTog] = useState(false);

    const history = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutuser = async () => {
        dispatch({ type: "LOGOUT" });
        toast.success("Logged out Successful 😃");
    };

    const goDash = () => {
        history("/dash");
    };

    const goError = () => {
        toast.error("Login First to access it 😢", {
            position: "bottom-right",
            theme: "colored",
        });
        history("*");
    };
    const [data, setData] = useState({});

    useEffect(() => {
        setTimeout(() => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    // toast.success("Logged in Successful 😃");
                    setData({ name: user.displayName, email: user.email, imgsrc: user.photoURL });
                } else {
                    setData("");
                }
                // console.log(user);
            });
        }, 1000);
    }, [currentUser]);

    return (
        <>
            <Particles id="tsparticles" tog={tog} />
            <header>
                <nav>
                    <NavLink to="/users" style={{ zIndex: 1000 }}>
                        <h1>ALL USERS</h1>
                    </NavLink>
                    <span
                        onClick={() => setTog(!tog)}
                        style={{ zIndex: 1000, cursor: "pointer" }}
                        className={`${tog ? "active" : ""}`}
                    ></span>
                    <div className="avtar">
                        {currentUser ? (
                            <Avatar
                                style={
                                    {
                                        // background: "salmon",
                                        // background: "#333",
                                        // fontWeight: "bold",
                                        // textTransform: "capitalize",
                                        // zIndex: 1000,
                                        // color: "#fff",
                                        // padding: "0.5rem",
                                        // fontSize: "1.7rem",
                                    }
                                }
                                onClick={handleClick}
                            >
                                {/* {currentUser.displayName[0].toUpperCase()} */}
                                <img
                                    src={data.imgsrc}
                                    alt="errror"
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Avatar>
                        ) : (
                            <Avatar
                                style={{
                                    background: "#333",
                                    zIndex: 1000,
                                    color: "#fff",
                                    padding: "0.5rem",
                                }}
                                onClick={handleClick}
                            />
                        )}
                    </div>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{ "aria-labelledby": "basic-button" }}
                    >
                        {currentUser ? (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        goDash();
                                        handleClose();
                                    }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        logoutuser();
                                        handleClose();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        goError();
                                        handleClose();
                                    }}
                                >
                                    Profile
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </nav>
            </header>
        </>
    );
};

export default Header;
