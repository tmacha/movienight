require("dotenv").config();
const axios = require("axios");
const omdbApiKey = process.env.OMDBAPIKEY;
const omdbApiUrl = "http://www.omdbapi.com";

const endpoints = {
  async searchMovies(req, res) {
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
  },

  async getMovieById(req, res) {
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
  },

  async getAllMovies(req, res) {
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
  },
};

module.exports = endpoints;
