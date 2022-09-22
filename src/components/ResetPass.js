import React, { useState } from "react";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./mix.css";

import { auth } from "../firebase";
import { confirmPasswordReset } from "firebase/auth";
import { Password } from "@mui/icons-material";

const ResetPass = ({location}) => {
    const [submitDisable, setSubmitDisable] = useState(false);

    const [password, setPassword] = useState("");
    const [passShow, setPassShow] = useState(false);
    const [oobCode, setOobCode] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const history = useNavigate();

    const loginuser = async (e) => {
        e.preventDefault();

        if (password === "") {
            toast.error("Password is required!");
        } else if (password.length < 6) {
            toast.error("Password: min 6 char require!");
        } else {
            setSubmitDisable(true);

            try {
                // update pass 
                setOobCode(searchParams.get("oobCode"));
                // console.log(searchParams.get("oobCode"));
                // console.log(password);

                const passUpdate = await confirmPasswordReset(auth, oobCode, password);
                console.log("here");
                setSubmitDisable(false);
                history("/dash");
                toast.success("Password Updated Successfull 😉");
            } catch (error) {
                // console.log(error);
                setSubmitDisable(false);
                    console.log(error);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // console.log(errorCode + "  " + errorMessage);
                    if(errorCode === "auth/expired-action-code")
                        toast.warn("Link is Expire!");
                    else if(errorCode === "auth/user-not-found")
                        toast.warn("user not found");
                    else
                        toast.error("Something went wrong!");
            }
        }
    };

    return (
        <>
            <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Enter new Password</h1>
                    </div>

                    <form style={{ zIndex: 1000 }} className="log">
                        <div className="form_input">
                            <label htmlFor="password">New Password</label>
                            <div className="two">
                                <input
                                    type={!passShow ? "password" : "text"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    name="password"
                                    id="password"
                                    placeholder="Enter Your new password"
                                    />
                                <div
                                    className="showpass"
                                    onClick={() => setPassShow(!passShow)}
                                    style={{
                                        background: "transparent",
                                        color: "#fff",
                                    }}
                                    >
                                    {!passShow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>
                        
                        <button disabled={submitDisable} className="btn" onClick={loginuser} style={{"--i": "#20c997"}}>
                            Update Password
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default ResetPass;
