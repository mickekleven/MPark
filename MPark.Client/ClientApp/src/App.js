import logo from "../src/logo.svg";
import "./App.css";
import "./components/navbar";
import Navbar from "./components/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./statics/modale.css";
import { StateContext } from "./helpers/context";
import Home from "./components/home";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Navbar></Navbar>
            <Routes>
                <Route path="/" element={<Home />}></Route>
            </Routes>
        </div>
    );
}

export default App;
