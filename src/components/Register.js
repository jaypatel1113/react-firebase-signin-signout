import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { auth, storage } from "../firebase";

import "react-toastify/dist/ReactToastify.css";
import "./mix.css";

const Register = () => {
    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);
    const [submitDisable, setSubmitDisable] = useState(false);
    const [buttonCon, setButtonCon] = useState("Sign Up");

    const [inpval, setInpval] = useState({
        fname: "",
        email: "",
        profilePic: "",
        password: "",
        cpassword: "",
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

    const btnact = (progress) => {
        console.log(progress);
        setButtonCon("Uploaded: " + progress.toFixed(2) + "%");
        setSubmitDisable(true);
    };
    const resetbtn = (progress) => {
        setTimeout(() => {
            setButtonCon("Sign Up");
        }, 1000);
        setButtonCon("Uploaded");
        setSubmitDisable(false);
    };

    const updImage = (e) => {
        console.log(e.target.files[0]);
        setInpval({ ...inpval, profilePic: e.target.files[0] });

        // const uniqueName = new Date().getTime() + "_" + e.target.files[0].name;
        // console.log(uniqueName);
        const storageRef = ref(storage, e.target.files[0].name);

        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                if (progress < 100) btnact(progress);
                else resetbtn();

                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                console.log(error);
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    setInpval({ ...inpval, profilePic: downloadURL });
                });
            }
        );
        console.log(inpval);
    };

    const addUserdata = async (e) => {
        e.preventDefault();

        const { fname, email, profilePic, password, cpassword } = inpval;

        if (fname === "") {
            toast.warning("Name is required!");
        } else if (email === "") {
            toast.error("Email is required!");
        } else if (!email.includes("@")) {
            toast.warning("includes @ in your email!");
        } else if (profilePic === "") {
            toast.error("ProfilePic is required!");
        } else if (password === "") {
            toast.error("Password is required!");
        } else if (password.length < 6) {
            toast.error("Password: min 6 char require!");
        } else if (cpassword === "") {
            toast.error("Confirm password is required!");
        } else if (password !== cpassword) {
            toast.error("Confirm password is not matching!");
        } else {
            setSubmitDisable(true);
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    setSubmitDisable(false);
                    console.log(user);
                    toast.success("Registered Successfully 😃");

                    updateProfile(user, {
                        displayName: fname,
                        photoURL: profilePic,
                    })
                        .then(() => console.log("updated"))
                        .catch((err) => console.log(err));

                    history("/");
                    // ...
                })
                .catch((error) => {
                    setSubmitDisable(false);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + " " + errorMessage);
                    toast.error("Error in registering 😢");
                    // ..
                });
        }
    };

    return (
        <>
            <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Sign Up</h1>
                        <p style={{ textAlign: "center" }}>
                            We are glad that you will be using Project Cloud to
                            manage <br />
                            your tasks! We hope that you will get like it.
                        </p>
                    </div>

                    <form
                        encType="multipart/form-data"
                        style={{ zIndex: 1000 }}
                        className="log"
                    >
                        <div className="form_input">
                            <label htmlFor="fname">Name</label>
                            <input
                                type="text"
                                onChange={setVal}
                                value={inpval.fname}
                                name="fname"
                                id="fname"
                                placeholder="Enter Your Name"
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                onChange={setVal}
                                value={inpval.email}
                                name="email"
                                id="email"
                                placeholder="Enter Your Email Address"
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="profilePic">Profile Picture</label>
                            <input
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                onChange={updImage}
                                name="profilePic"
                                id="profilePic"
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password">Password</label>
                            <div className="two">
                                <input
                                    type={!passShow ? "password" : "text"}
                                    value={inpval.password}
                                    onChange={setVal}
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

                        <div className="form_input">
                            <label htmlFor="password">Confirm Password</label>
                            <div className="two">
                                <input
                                    type={!cpassShow ? "password" : "text"}
                                    value={inpval.cpassword}
                                    onChange={setVal}
                                    name="cpassword"
                                    id="cpassword"
                                    placeholder="Confirm password"
                                />
                                <div
                                    className="showpass"
                                    onClick={() => setCPassShow(!cpassShow)}
                                    style={{
                                        background: "transparent",
                                        color: "#fff",
                                    }}
                                >
                                    {!cpassShow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={submitDisable}
                            className="btn"
                            onClick={addUserdata}
                            style={{"--i": "#20c997"}}
                        >
                            {buttonCon}
                        </button>
                        <p>
                            Already have an account?
                            <NavLink to="/" className="pbtn" style={{"--i": "#0dcaf0"}}>Log In</NavLink>
                        </p>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Register;
