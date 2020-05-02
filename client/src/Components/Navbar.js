import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";

export default class Navbar extends Component {
  render() {
    return (
        <div className="top-container">
          <div className="navbar">
            <NavLink exact to="/">
              <span>Home</span>
            </NavLink>
            <NavLink to="/about">
              <span>About</span>
            </NavLink>
          </div>
        </div>
    );
  }
}
