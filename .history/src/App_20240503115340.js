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
          {movies.map((movie, index) => {
            // Remove dollar sign and commas, then convert to float
            const boxOfficeValue = parseFloat(
              movie.BoxOffice.replace(/[\$,]/g, "")
            );
            let formattedBoxOffice;

            // Determine the order of magnitude and format accordingly
            if (boxOfficeValue >= 1000000) {
              // Millions
              formattedBoxOffice = (boxOfficeValue / 1000000).toFixed(1) + "M";
            } else if (boxOfficeValue >= 1000) {
              // Thousands
              formattedBoxOffice = (boxOfficeValue / 1000).toFixed(1) + "T";
            } else {
              formattedBoxOffice = boxOfficeValue.toFixed(1); // Less than a thousand, no abbreviation
            }

            // Format runtime to show "m" directly behind the number
            const formattedRuntime = movie.Runtime.replace(" min", "m");

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
        {movies.map((movie, index) => {
          // Your existing logic for formatting box office and runtime
          // ...

          return (
            <li key={index} className="movie-item">
              <div className="movie-title">{movie.Title} ({movie.Year})</div>
              <div className="movie-info">
                {movie.Poster !== "N/A" && <img src={movie.Poster} alt={`${movie.Title} Poster`} className="movie-poster" />}
                <div className="movie-details">
                 <div>{formattedRuntime}</div>
                 <div><img src={`${process.env.PUBLIC_URL}/images/imdb-logo.png`} alt="IMDb" className="rating-logo" /> {movie.imdbRating}</div>
                 <div><img src={`${process.env.PUBLIC_URL}/images/metacritic-logo.png`} alt="Metacritic" className="rating-logo" /> {movie.Metascore}</div>
                 <div><span className="emoji">$</span> {formattedBoxOffice}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    )}
 </div>
);
}

export default App;
