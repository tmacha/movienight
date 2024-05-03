import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? "https://movienight-seven.vercel.app/movies/search"
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
            const boxOfficeValue = movie.BoxOffice
              ? parseFloat(movie.BoxOffice.replace(/[\$,]/g, ""))
              : 0;
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

            // Check if Runtime is defined before attempting to format it
            const formattedRuntime = movie.Runtime
              ? movie.Runtime.replace(" min", "m")
              : "N/A";

            return (
              <div key={index} className="movie-item">
                <img
                  src={movie.Poster}
                  alt={`${movie.Title} Poster`}
                  className="movie-poster"
                />
                <div className="movie-overlay">
                  <div className="movie-title">
                    {movie.Title} ({movie.Year})
                  </div>
                  <div className="movie-details">
                    <div>{formattedRuntime}</div>
                    <div>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/imdb-logo.png`}
                        alt="IMDb"
                        className="rating-logo"
                      />{" "}
                      {movie.imdbRating}
                    </div>
                    <div>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/metacritic-logo.png`}
                        alt="Metacritic"
                        className="rating-logo"
                      />{" "}
                      {movie.Metascore}
                    </div>
                    <div>
                      <span className="emoji">$</span> {formattedBoxOffice}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
