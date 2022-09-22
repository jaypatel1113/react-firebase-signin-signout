import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";
import { useContext } from "react";

import "./mix.css";

import { auth } from "../firebase";
import { AuthContext } from "./ContextProvider/AuthContext";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GitHubIcon from "@mui/icons-material/GitHub";

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
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
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
                if (errorCode === "auth/user-not-found")
                    toast.warn("Email is not Register!");
                else if (errorCode === "auth/wrong-password")
                    toast.warn("Incorrect Password!");
                else toast.error("Something went wrong!");
            }
        }
    };

    const signupSocialMedia = async (platform, e) => {
        e.preventDefault();
        // console.log(platform);
        try {
            if (platform === "GOOGLE") {
                const provider = new GoogleAuthProvider();
                const googleuser = await signInWithPopup(auth, provider);

                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(googleuser);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = googleuser.user;
                // ...
                console.log(user);
                dispatch({ type: "LOGIN", payload: user });
            } else if (platform === "FACEBOOK") {
                const provider = new FacebookAuthProvider();
                const fbuser = await signInWithPopup(auth, provider);
                const credential =
                    FacebookAuthProvider.credentialFromResult(fbuser);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = fbuser.user;
                console.log(user);
                dispatch({ type: "LOGIN", payload: user });
            } else if (platform === "GITHUB") {
                const provider = new GithubAuthProvider();
                const gituser = await signInWithPopup(auth, provider);
                const credential =
                    GithubAuthProvider.credentialFromResult(gituser);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = gituser.user;
                console.log(user);
                dispatch({ type: "LOGIN", payload: user });
            }

            // This gives you a Google Access Token. You can use it to access the Google API.
            // ...
            toast.success("Login Successfull 😉");
        } catch (error) {
            // console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            if (errorCode === "auth/popup-closed-by-user")
                toast.error("PopUp closed!");
            else
                toast.error("Something went wrong!")
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

                        <button
                            disabled={submitDisable}
                            className="btn"
                            onClick={loginuser}
                            style={{ "--i": "#20c997" }}
                        >
                            Login
                        </button>
                        <p>
                            Forget Password?
                            <NavLink
                                to="/forget-password"
                                className="pbtn marbtn"
                                style={{ "--i": "#FBBC05" }}
                            >
                                Reset
                            </NavLink>
                        </p>
                        <p className="optopt">or Sign IN with</p>
                        <p
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                            className="zeromar"
                        >
                            <NavLink
                                to="/register"
                                className="pbtn sicons"
                                style={{
                                    "--i": "#fd7e14",
                                    display: "grid",
                                    placeItems: "center",
                                }}
                                title="Email"
                            >
                                <AlternateEmailRoundedIcon />
                            </NavLink>
                            <button
                                title="Facebook"
                                onClick={(e) =>
                                    signupSocialMedia("FACEBOOK", e)
                                }
                                className="pbtn sicons"
                                style={{ "--i": "#4267B2" }}
                            >
                                <FacebookRoundedIcon />
                            </button>
                            <button
                                title="Google"
                                onClick={(e) => signupSocialMedia("GOOGLE", e)}
                                className="pbtn sicons"
                                style={{ "--i": "#EA4335" }}
                            >
                                <GoogleIcon />
                            </button>
                            <button
                                title="Github"
                                onClick={(e) => signupSocialMedia("GITHUB", e)}
                                className="pbtn sicons"
                                style={{ "--i": "#2f2f2f" }}
                            >
                                <GitHubIcon />
                            </button>
                        </p>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Login;
