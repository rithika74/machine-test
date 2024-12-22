import React from 'react';
import { FaSearch } from "react-icons/fa";
import { Link, Outlet } from 'react-router-dom';

const Navigation = () => {
    return (
        <>
            <header>
                <div className="header-container">
                    <div className="brand">
                        <h4>MX Tech</h4>
                    </div>
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                placeholder="Search..."
                                className="search-input"
                            />
                            <FaSearch className="search-icon" />
                        </div>
                    </div>
                    <div className="nav-links">
                        <div>
                            <Link to="/dashboard"><li><a href="">Dashboard</a></li></Link>
                            <Link to="/staff"><li><a href="">Staff</a></li></Link>
                            <Link to="/employee"><li><a href="">Employee</a></li></Link>
                        </div>
                    </div>
                </div>
            </header>
            <Outlet/>
        </>
    );
};

export default Navigation;
