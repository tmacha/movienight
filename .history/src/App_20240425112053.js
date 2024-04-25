import React, { useState, useEffect } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await fetch(`/movies/search?q=${searchQuery}`);
    const data = await response.json();
    setMovies(data.Search);
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
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            {movie.Title} ({movie.Year})
          </li>
        ))}
      </ul>
    </div>
  );
}
