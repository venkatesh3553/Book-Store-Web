import { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"

import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

import "./Register.css";

export class Register extends Component {
    state = { username: "", email: "", password: "", confirmpassword: "" };

    // Submin User Details Function
    handleSubmit = async (e) => {
        e.preventDefault();

        axios
            .post("https://book-data-e8gp.onrender.com/register", this.state)
            .then((response) => {
                console.log(response);
                toast.success("Registered Successfully")
                window.location.href = "/login";
            })
            .catch((error) => {
                console.error("There was an error registering!", error);
                toast.error(error.response.data)
            });

    }
    render() {
        if (Cookies.get("token")) {
            return <Navigate to="/" replace />;
        }
        return (
            <div className="register-bg">
                <div className="register-container">
                    <h2 className="register-head">Register Page</h2>
                    <form className="register-form" onSubmit={this.handleSubmit}>
                        <div className="input-group">
                            <label className="register-label">Username:</label>
                            <input
                                type="text"
                                className="register-input"
                                placeholder="Enter Name"
                                value={this.state.username}
                                onChange={(e) => this.setState({ username: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="register-label">Email:</label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="register-input"
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="register-label">Password:</label>
                            <input
                                type="password"
                                className="register-input"
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={(e) => this.setState({ password: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="register-label">Confirm Password:</label>
                            <input
                                type="password"
                                placeholder="Confirm Password "
                                className="register-input"
                                value={this.state.confirmpassword}
                                onChange={(e) => this.setState({ confirmpassword: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="register-btn">Register</button>
                    </form>
                </div>
                <span className="register-span">Already have an account? </span><a href="/login">Login here</a>

                <ToastContainer theme="dark" position="top-right" autoClose={3000} />
            </div>
        );
    }
}

