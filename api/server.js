const express = require("express");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const crypto = require("crypto");
const movies = require("./routes/movies");
const PORT = 3001;
const mongoose = require("mongoose");
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.oqmbhnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//generate random session secret
function generateSessionSecret() {
  return crypto.randomBytes(64).toString("hex");
}
const sessionSecret = generateSessionSecret();

//setup express server
const app = express();

//use movies.js to handle all /movies routes
app.use("/movies", movies);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(
  session({
    secret: `${sessionSecret}`, // Replace with a secure, random string
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//!!use when deploying
//app.use(express.static(path.join(__dirname, "../build")));

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
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// Route to handle Google OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    // Successful authentication, redirect to React app
    res.redirect("http://localhost:3000/profile");
  }
);

// Route to get user profile
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

// Route to log out
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000");
  });
});

// Home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
