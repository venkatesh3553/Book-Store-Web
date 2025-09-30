import { Component } from "react";

import { CiSearch } from "react-icons/ci";
import { GrHome } from "react-icons/gr";
import { LuContact } from "react-icons/lu";
import { BsCart4 } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { TiArrowBackOutline } from "react-icons/ti";

import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

import "./Navbar.css";
import { Link } from "react-router-dom";

class Navbar extends Component {
    state = { username: "User", sidebar: false }

    componentDidMount() {
        this.getusername();
    }
    // Get username from backend //
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
            this.setState({ username: data.username })
        } catch (e) {
            console.log(e);
        }
    }

    // Logout function //
    onLogout = () => {
        toast.success("Logged out successfully!");
        Cookies.remove("token");
        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);

    }


    render() {
        const { cartLength, handleSearchChange, userinput } = this.props;
        const { sidebar } = this.state

        const Icon = sidebar ? TiArrowBackOutline : IoMenu
        return (
            <nav className="navbar-bg">
                <div className="nav-user-details-div">
                    <p className="nav-user-details">Welcome {this.state.username}</p>
                </div>

                <div className="nav-search-div">
                    <CiSearch className="nav-search-icon" />
                    <input className="nav-search-input" type="text" placeholder="Search books..."
                        onChange={(e) => handleSearchChange(e)} value={userinput} />
                </div>

                <div className="menu-div">
                    <Icon
                        className="menu-icon"
                        onClick={() => this.setState({ sidebar: !this.state.sidebar })}
                    />
                </div>

                {sidebar &&
                    <div className="menu-details-div">
                        <p className="menu-title">Welcome {this.state.username}</p>
                        <div className="sidebar-icon-link-div">
                            <Link to='/'> <GrHome className="sidebar-icon" /> </Link>
                            <Link to='/' className="menu-item">Home</Link>
                        </div>
                        <div className="sidebar-icon-link-div">
                            <Link to='/'> <LuContact className="sidebar-icon" /> </Link>
                            <Link to='/contact' className="menu-item">Contact</Link>
                        </div>
                        <div className="sidebar-icon-link-div">
                            <Link to='/'> <BsCart4 className="sidebar-icon" /> </Link>
                            <Link to='/cart' className="menu-item">Cart {cartLength}</Link>
                        </div>
                        <button onClick={this.onLogout} className="menu-btn">Logout</button>
                    </div>
                }

                <div className="links-div">
                    <div className="nav-icon-div">
                        <Link to='/'> <GrHome className="nav-home-icon" /> </Link>
                        <Link to='/' className="nav-link">Home</Link>
                    </div>
                    <div className="nav-icon-div">
                        <Link to='/cart'><LuContact className="nav-home-icon" /></Link>
                        <Link to='/contact' className="nav-link">Contact</Link>
                    </div>
                    <div className="nav-icon-div">
                        <Link to='/cart'> <BsCart4 className="nav-home-icon" /> </Link>
                        <Link to='/cart' className="nav-link">Cart</Link>
                        <p className="cart-length">{cartLength}</p>
                    </div>
                    <button className="logout-btn" onClick={this.onLogout}>Logout</button>
                    <IoIosLogOut className="logout-icon" onClick={this.onLogout} />
                </div>
                <ToastContainer theme="dark" position="top-right" autoClose={2000} />
            </nav>
        );
    }
}
export default Navbar;