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
const mongoURI = "<your_mongodb_uri>";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number,
});

const Movie = mongoose.model("Movie", movieSchema);
