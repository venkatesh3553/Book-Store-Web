import { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

import "./Login.css";

class Login extends Component {
    state = { username: "", password: "", redirect: false };

    // Redirect like user login success then Navigate to Home Page Function
    getusername = async () => {
        const url = 'https://book-data-e8gp.onrender.com/userDetails';
        const token = Cookies.get("token");
        // console.log(token)
        const options = {
            method: "GET",
            headers: {
                "x-token": token,
            },
        };
        try {
            const res = await fetch(url, options)
            const data = await res.json();
            this.setState({ verifyusername: data.username })
        } catch (e) {
            console.log(e);
        }
    }
    loginSuccess = (token) => {
        Cookies.set("token", token, { expires: 30 });

        setTimeout(() => {
            this.setState({ redirect: true });
        }, 1000);
    }

    // Form Submit Function "https://book-data-e8gp.onrender.com
    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://book-data-e8gp.onrender.com/login", {
                username: this.state.username,
                password: this.state.password
            });
            if (res.status === 200) {
                toast.success("Login Successful");
                this.loginSuccess(res.data.token);
            } else {
                toast.error("Login Failed");
            }
        } catch (error) {
            toast.error(error.response.data || "Login Failed");
        }

    }

    render() {

        if (this.state.redirect || Cookies.get("token")) {
            return <Navigate to="/" />;
        }
        return (
            <div className="login-container">
                <h2 className="login-head">Login Page</h2>
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">User Name:</label>
                        <input
                            className="login-input" type="text"
                            placeholder="Name"
                            value={this.state.email}
                            onChange={(e) => this.setState({ username: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password:</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <span className="login-span">Don't have an account? </span><a href="/register">Register here</a>
                <ToastContainer theme="dark" position="top-right" autoClose={2000} />
            </div>
        );
    }
}

export default Login;