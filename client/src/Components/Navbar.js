import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  function logout() {
    // Clear user data
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to={user ? "/home" : "/login"}>
        Hotel Booking
      </Link>
      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
          {user && (
            <Link className="nav-item nav-link" to="/home">
              Home
            </Link>
          )}
        </div>
        <div className="navbar-nav navbar-nav-RL">
          {user ? (
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="nav-item nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-item nav-link" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
