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
              <div className="movie-title">
                {movie.Title} ({movie.Year})
              </div>
              <div className="movie-details">
                <div>Runtime: {movie.Runtime}</div>
                <div>IMDb Rating: {movie.imdbRating}</div>
                <div>Metacritic Score: {movie.Metascore}</div>
                <div>Box Office: {movie.BoxOffice}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
