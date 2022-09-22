import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext } from "react";

import "./mix.css";

import { auth } from "../firebase";
import { AuthContext } from "./ContextProvider/AuthContext";

const Login = () => {
    const [passShow, setPassShow] = useState(false);
    const [submitDisable, setSubmitDisable] = useState(false);
    const { dispatch } = useContext(AuthContext);

    const [inpval, setInpval] = useState({
        email: "",
        password: "",
    });

    const history = useNavigate();

    const setVal = (e) => {
        // console.log(e.target.value);
        const { name, value } = e.target;

        setInpval(() => {
            return {
                ...inpval,
                [name]: value,
            };
        });
    };

    const loginuser = async (e) => {
        e.preventDefault();

        const { email, password } = inpval;

        if (email === "") {
            toast.error("Email is required!");
        } else if (!email.includes("@")) {
            toast.warning("includes @ in your email!");
        } else if (password === "") {
            toast.error("Password is required!");
        } else if (password.length < 6) {
            toast.error("Password: min 6 char require!");
        } else {
            setSubmitDisable(true);

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                setSubmitDisable(false);
                // console.log(user);
                dispatch({ type: "LOGIN", payload: user });
                toast.success("Login Successfull 😉");
                history("/dash");
            } catch (error) {
                // console.log(error);
                setSubmitDisable(false);
                    // console.log(error);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // console.log(errorCode + "  " + errorMessage);
                    if(errorCode === "auth/user-not-found")
                        toast.warn("Email is not Register!");
                    else if(errorCode === "auth/wrong-password")
                        toast.warn("Incorrect Password!");
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
                        <h1>Welcome Back, Log In</h1>
                        <p>Hi, we are you glad you are back. Please login.</p>
                    </div>

                    <form style={{ zIndex: 1000 }} className="log">
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                value={inpval.email}
                                onChange={setVal}
                                name="email"
                                id="email"
                                placeholder="Enter Your Email Address"
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password">Password</label>
                            <div className="two">
                                <input
                                    type={!passShow ? "password" : "text"}
                                    onChange={setVal}
                                    value={inpval.password}
                                    name="password"
                                    id="password"
                                    placeholder="Enter Your password"
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
                            Login
                        </button>
                        <p style={{display: "flex", justifyContent: "space-between"}}>
                            <NavLink to="/register" className="pbtn" style={{"--i": "#0dcaf0"}}>Sign Up</NavLink>
                            <NavLink to="/forget-password" className="pbtn" style={{"--i": "#0dcaf0"}}>Forget Password?</NavLink>
                        </p>
                        <p>
                            
                        </p>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Login;
