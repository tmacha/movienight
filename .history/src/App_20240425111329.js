import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetch(`http://www.omdbapi.com/?apikey=YOUR_OMDB_API_KEY&s=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => setMovies(data.Search));
  };

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
