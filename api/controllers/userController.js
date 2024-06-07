// userController.js
const User = require("../models/User");

exports.createOrUpdateUser = async (userData) => {
  try {
    const { googleId, displayName, email, profileImageUrl } = userData;

    console.log("Received user data:", userData);
    // Check if the user already exists in the database
    let user = await User.findOne({ googleId });

    if (user) {
      // Update the existing user
      user.displayName = displayName;
      user.email = email;
      user.profileImageUrl = profileImageUrl;
      await user.save();
    } else {
      // Create a new user
      user = new User({ googleId, displayName, email, profileImageUrl });
      await user.save();
    }

    return user;
  } catch (error) {
    throw new Error(`Error creating or updating user: ${error.message}`);
  }
};
