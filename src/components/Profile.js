// src/components/Profile.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, setUser, authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data); // Assuming setUser is a method to update user in AuthContext
      })
      .catch((error) => {
        console.error("Error fetching profile", error);
      });
  }, [setUser]);

  const handleLogout = () => {
    logout(); // Ensure this method updates the context to reflect no user is logged in
    navigate("/"); // Navigate to home page or login page
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <img src={user.profileImageUrl} alt="Profile Picture" />
      <p>Hello, {user.displayName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
