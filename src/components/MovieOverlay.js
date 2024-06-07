import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import "./MovieOverlay.css";

const MovieOverlay = ({ movie }) => {
  const [isInFavorites, setIsInFavorites] = useState(false);

  const handleAddToFavorites = async () => {
    try {
      if (!isInFavorites) {
        // Add the movie to favorites
        await fetch("http://localhost:3001/movies/favorites", {
          method: "POST",
          body: JSON.stringify({ movie }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        setIsInFavorites(true);
      } else {
        // Remove the movie from favorites
        await fetch(`http://localhost:3001/movies/favorites/${movie.imdbID}`, {
          method: "DELETE",
        });
        setIsInFavorites(false);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

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
    <div className="movie-overlay">
      <FontAwesomeIcon
        icon={isInFavorites ? faHeartSolid : faHeartRegular}
        onClick={handleAddToFavorites}
        className={`heart-icon ${isInFavorites ? "favorite" : ""}`}
      />
      <div className="movie-info">
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
};

export default MovieOverlay;
