// src/components/Navbar.js
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout(() => {
      setIsLoggingOut(false);
    });
  };

  useEffect(() => {
    // Re-render the component whenever authState changes
  }, [user]);

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/profile">
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="profile-picture"
            />
          </Link>
          <button onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </nav>
  );
};

export default Navbar;
