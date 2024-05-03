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

  .movie-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }
   
   .movie-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 10px; /* Space between the poster/details and the title */
   }
   
   .movie-poster {
    max-width: 50%; /* Adjust the width as needed */
    height: auto;
    margin-right: 20px; /* Space between the poster and the details */
   }
   
   .movie-details {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
   }
}

export default App;
