const express = require("express");
const app = express();
const axios = require("axios");
const PORT = 3001;
const omdbApiKey = "c3e2d84b";
const omdbApiUrl = "http://www.omdbapi.com";

app.get("/movies", async (req, res) => {
  console.log("Movies route accessed");
  try {
    const response = await axios.get(omdbApiUrl, {
      params: {
        apikey: omdbApiKey,
        s: "movies", // search for movies
      },
    });
    console.log("OMDB API response:", response.data);
    res.json(response.data.Search);
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/movies/search", async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(omdbApiUrl, {
      params: {
        apikey: omdbApiKey,
        s: query, // search for movies by title
      },
    });
    res.json(response.data.Search);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/movies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(omdbApiUrl, {
      params: {
        apikey: omdbApiKey,
        i: id, // get movie details by ID
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});
