// src/components/Home.js
import React, { useState } from "react";
import "./Home.css";
import MovieOverlay from "./MovieOverlay";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? "https://movienight-psi.vercel.app/movies/search"
          : "/movies/search";
      const response = await fetch(`${apiUrl}?q=${searchQuery}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setMovies(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search for a movie..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie, index) => {
            // Check if BoxOffice is defined before attempting to format it

            return (
              <div key={index} className="movie-item">
                <img
                  src={movie.Poster}
                  alt={`${movie.Title} Poster`}
                  className="movie-poster"
                />
                <MovieOverlay movie={movie} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
