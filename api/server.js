// api/server.js
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const crypto = require("crypto");
const mongoose = require("mongoose");
const movies = require("./routes/movies");
const users = require("./routes/users");
const User = require("./models/User");
const PORT = 3001;

require("dotenv").config();

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.oqmbhnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Generate random session secret
function generateSessionSecret() {
  return crypto.randomBytes(64).toString("hex");
}
const sessionSecret = generateSessionSecret();

// Setup express server
const app = express();

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
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use movies.js to handle all /movies routes
app.use("/movies", movies);
app.use("/users", users);

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Find or create user in the database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profileImageUrl: profile.photos[0].value,
          });
          await user.save();
        }
        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
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
    res.redirect("http://localhost:3000/");
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
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    console.log("Logged out");
    res.status(200).json({ message: "Logged out successfully" });
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
