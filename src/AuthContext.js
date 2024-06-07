// src/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
  };

  const logout = (callback) => {
    axios
      .get("http://localhost:3001/logout", { withCredentials: true })
      .then(() => {
        setUser(null);
        if (callback) callback();
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out", error);
      });
  };

  useEffect(() => {
    // Fetch user profile on initial load
    axios
      .get("http://localhost:3001/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile", error);
      });
  }, []);

  const getFavoriteMovies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/movies/favorites",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      throw error;
    }
  };

  const addFavoriteMovie = async (movie) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/movies/favorites",
        { movie },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding favorite movie:", error);
      throw error;
    }
  };

  const removeFavoriteMovie = async (imdbID) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/movies/favorites/${imdbID}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing favorite movie:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        getFavoriteMovies,
        addFavoriteMovie,
        removeFavoriteMovie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
