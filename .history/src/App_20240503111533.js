import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/movies/search?q=${searchQuery}`);
      if (!response.ok) {
        // If the response is not ok, throw an error with the status text
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data);
      setMovies(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul className="movie-list">
          {movies.map((movie, index) => (
            <li key={index} className="movie-item">
              <div className="movie-info">
                {movie.Poster !== "N/A" && (
                  <img
                    src={movie.Poster}
                    alt={`${movie.Title} Poster`}
                    className="movie-poster"
                  />
                )}
                <div className="movie-details">
                  <div>{movie.Runtime}</div>
                  <div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDb_logo.svg"
                      alt="IMDb"
                      className="rating-logo"
                    />{" "}
                    {movie.imdbRating}
                  </div>
                  <div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/6/6b/Metacritic.svg"
                      alt="Metacritic"
                      className="rating-logo"
                    />{" "}
                    {movie.Metascore}
                  </div>
                  <div>{movie.BoxOffice}</div>
                </div>
              </div>
              <div className="movie-title">
                {movie.Title} ({movie.Year})
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
