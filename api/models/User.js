const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
  },
  favoriteMovies: [
    {
      imdbID: {
        type: String,
        required: true,
      },
      Title: {
        type: String,
        required: true,
      },
      Poster: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
