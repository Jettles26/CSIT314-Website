import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // optional: for styling

function Header() {
  return (
    <div>
      {/* Header */}
      <div className="TitleContainer">
        <div className="Title">
          <h1 style={{ color: "whitesmoke" }}>Eventik</h1>
        </div>
        <div className="Title">
          <h1><Link className="Link" to="/">Home</Link></h1>
        </div>
        <div className="Title">
          <h1><Link className="Link" to="/Events">Events</Link></h1>
        </div>
        <div className="Title">
          <h1><Link className="Link" to="/notify">Notify</Link></h1>
        </div>
        <div className="Title">
          <h1><Link className="Link" to="/login">Login</Link></h1>
        </div>
      </div>
    </div>
  );
}

export default Header;