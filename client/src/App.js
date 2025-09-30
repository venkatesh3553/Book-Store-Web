import { Component } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Login from "./components/LoginComponent/Login";
import { Register } from "./components/RegisterComponent/Register";
import { Home } from "./components/HomeComponent/Home";

import ProtectRouter from './components/protectRouter';
import Cart from "./components/CatrComponent/Cart";
import Contact from "./components/ContactComponet/Contact";


import "./App.css"
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectRouter><Home /></ProtectRouter>} />
          <Route path="/cart" element={<ProtectRouter><Cart /></ProtectRouter>} />
          <Route path="/contact" element={<ProtectRouter><Contact /></ProtectRouter>} />
          <Route path="*" element={
            <div className="noufound-div">
              <h1 className="notfount-head">Not Found!</h1>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/page-not-found-illustration-download-in-svg-png-gif-file-formats--404-message-hosting-error-pack-design-development-illustrations-5736070.png" className="notfound-img" alt="Image" />
              <Link to='/' className="notfound-btn">Go Home</Link>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;