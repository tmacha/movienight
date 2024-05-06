const express = require("express");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const crypto = require("crypto");
const { searchMovies, getMovieById, getAllMovies } = require("./endpoints");
const PORT = 3001;
const path = require("path");

function generateSessionSecret() {
  return crypto.randomBytes(64).toString("hex");
}
const sessionSecret = generateSessionSecret();

const app = express();

app.use(express.json()); // Add this line to parse JSON requests
app.use(cors());
app.use(
  session({
    secret: `${sessionSecret}`, // Replace with a secure, random string
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../build")));

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.CLIENT_ID}`, // Replace with your Google Client ID
      clientSecret: `${process.env.CLIENT_SECRET}`, // Replace with your Google Client Secret
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // Here, you would typically find or create a user in your database
      // For simplicity, we'll just return the profile
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Route to initiate Google OAuth flow
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// Route to handle Google OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/movies/search", searchMovies);
app.get("/movies/:id", getMovieById);
app.get("/movies", getAllMovies);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
