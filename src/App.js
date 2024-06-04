import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

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
      console.log(process.env.NODE_ENV);
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
      <div>
        <a href="http://localhost:3001/auth/google">Login with Google</a>
      </div>
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
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3001/logout", { withCredentials: true })
      .then(() => {
        setUser(null);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error logging out", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      {user && (
        <>
          <img src={user.picture} alt="Profile Picture" />
          <p>Hello, {user.name.givenName}</p>
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
