import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useContext } from "react";

import "./mix.css";

import { auth } from "../firebase";
import { AuthContext } from "./ContextProvider/AuthContext";

const ForgetPass = () => {
    const [submitDisable, setSubmitDisable] = useState(false);
    const { dispatch } = useContext(AuthContext);

    const [email, setEmail] = useState("");

    const history = useNavigate();

    

    const sendemail = async (e) => {
        e.preventDefault();

        if (email === "") {
            toast.error("Email is required!");
        } else if (!email.includes("@")) {
            toast.warning("includes @ in your email!");
        } else {
            setSubmitDisable(true);

            try {
                const sentEmail = await sendPasswordResetEmail(auth, email);
                // console.log(sentEmail);
                setSubmitDisable(false);
                history("/dash");
                toast.success("Email sent Successfull 😉 (check spam)");
            } catch (error) {
                // console.log(error);
                setSubmitDisable(false);
                    // console.log(error);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // console.log(errorCode + "  " + errorMessage);
                    if(errorCode === "auth/user-not-found")
                        toast.warn("Email is not Register!");
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
                        <h1>Enter registered Email</h1>
                    </div>

                    <form style={{ zIndex: 1000 }} className="log">
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                                name="email"
                                id="email"
                                placeholder="Enter Your Email Address"
                            />
                        </div>
                        
                        <button disabled={submitDisable} className="btn" onClick={sendemail} style={{"--i": "#20c997"}}>
                            Send Email
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default ForgetPass;
