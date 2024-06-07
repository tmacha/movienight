require("dotenv").config();
const axios = require("axios");
const omdbApiKey = process.env.OMDBAPIKEY;
const omdbApiUrl = "http://www.omdbapi.com";
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/search", searchMovies);
router.get("/:id", getMovieById);
router.get("/", getAllMovies);
router.get("/favorites", getFavorites);
router.post("/favorites", setFavorite);
router.delete("/favorites/:id", removeFavorite);

async function searchMovies(req, res) {
  const query = req.query.q;
  let allResults = [];
  let page = 1;
  let hasMore = true;
  let limit = true;

  while (hasMore && limit) {
    limit = page === 1 ? (limit = false) : (limit = true);
    try {
      const response = await axios.get(omdbApiUrl, {
        params: {
          apikey: omdbApiKey,
          s: query, // search for movies by title
          page: page, // specify the page number
        },
      });
      const data = response.data;
      if (data.Response === "True") {
        const searchResults = Array.isArray(data.Search)
          ? data.Search
          : [data.Search];
        // Fetch full details for each movie
        const detailedResults = await Promise.all(
          searchResults.map(async (movie) => {
            const detailResponse = await axios.get(omdbApiUrl, {
              params: {
                apikey: omdbApiKey,
                i: movie.imdbID, // fetch full details using IMDb ID
              },
            });
            return detailResponse.data;
          })
        );
        allResults = allResults.concat(detailedResults);
        // Check if there are more pages
        hasMore = data.totalResults > page * 10;
        page++;
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error("Error fetching movies:", err.message);
      res.status(500).json({ message: err.message });
      hasMore = false;
    }
  }

  res.json(allResults);
}

async function getMovieById(req, res) {
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
}

async function getAllMovies(req, res) {
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
}

async function getFavorites(req, res) {
  try {
    const user = await User.findOne({ googleId: req.user.googleId });
    res.json(user.favoriteMovies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function setFavorite(req, res) {
  try {
    const user = await User.findOne({ googleId: req.user.googleId });
    user.favoriteMovies.push(req.body.movie);
    await user.save();
    res.status(201).json(user.favoriteMovies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function removeFavorite(req, res) {
  try {
    const user = await User.findOne({ googleId: req.user.googleId });
    user.favoriteMovies = user.favoriteMovies.filter(
      (movie) => movie.imdbID !== req.params.id
    );
    await user.save();
    res.json(user.favoriteMovies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = router;
