const express = require("express");
const app = express();
const axios = require("axios");
const PORT = 3001;
const omdbApiKey = "c3e2d84b";
const omdbApiUrl = "http://www.omdbapi.com";

app.use(express.json()); // Add this line to parse JSON requests

app.get("/movies", async (req, res) => {
  try {
    const response = await axios.get(omdbApiUrl, {
      params: {
        apikey: omdbApiKey,
        s: "movies", // search for movies
      },
    });
    const data = response.data;
    if (data.Response === "True") {
      res.json(data.Search);
    } else {
      res.status(404).json({ message: "No movies found" });
    }
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/movies/search", async (req, res) => {
  console.log("TEST1");
  const query = req.query.q;
  try {
    console.log("TEST2");
    const response = await axios.get(omdbApiUrl, {
      params: {
        apikey: omdbApiKey,
        s: query, // search for movies by title
      },
    });
    const data = response.data;
    console.log("TEST3");
    if (data.Response === "True") {
      console.log("TEST4");
      const searchResults = Array.isArray(data.Search)
        ? data.Search
        : [data.Search];
      res.json(searchResults);
    } else {
      res.status(404).json({ message: "No movies found" });
    }
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
    const data = response.data;
    if (data.Response === "True") {
      res.json(data);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
