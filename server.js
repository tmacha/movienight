const express = require("express");
const app = express();
const port = 3001; // Choose a port number

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const mongoose = require("mongoose");

// Replace <your_mongodb_uri> with your actual MongoDB URI
const mongoURI = "mongodb://127.0.0.1:27017/";

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Example function to add a movie to the database
async function addMovie() {
  const newMovie = new Movie({
    title: "Example Movie",
    director: "John Doe",
    year: 2024,
  });

  try {
    const savedMovie = await newMovie.save();
    console.log("Movie saved:", savedMovie);
  } catch (err) {
    console.error("Error saving movie:", err);
  }
}

// Call the function to add a movie
addMovie();
