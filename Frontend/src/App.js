import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Events from "./Pages/Events";
import Home from "./Pages/Home";
import Notify from "./Pages/Notify";
import Login from "./Pages/Login";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

function App() {
    return (
            <Router>
                <Header />
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/Events"
                        element={<Events />}
                    />
                    <Route
                        path="/Notify"
                        element={<Notify />}
                    />
                    <Route
                        path="/Login"
                        element={<Login />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
                <Footer />
            </Router>
    );
}

export default App;
