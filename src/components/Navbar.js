// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">company's XG-Boost Live Trades</div>
      <NavLink to="/your_account1" className="nav-link" activeClassName="active-link">
        your_account
      </NavLink>
      <NavLink to="/your_account2" className="nav-link" activeClassName="active-link">
        your_account
      </NavLink>
      <NavLink to="/your_account" className="nav-link" activeClassName="active-link">
        your_account
      </NavLink>
    </nav>
  );
};

export default Navbar;
