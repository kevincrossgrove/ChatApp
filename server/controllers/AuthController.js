const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthController {
  static createAccount = async (req, res) => {
    try {
      const { email, password, confirmPassword } = req.body;

      // Validation ( Most of this should be added to Client side, like requiring fields. )
      if (!email || !password || !confirmPassword)
        return res.status(400).json({
          errorMessage: "Please enter all required fields.",
          code: 1,
        });

      if (password.length < 8)
        return res.status(400).json({
          message: "Password must be 8 characters or greater.",
        });

      if (password.length !== confirmPassword.length)
        return res.status(400).json({
          message: "Password's did not match up.",
        });

      // Verify that the new account's email, does not already exist in the DB.
      const existingUser = await User.findOne({ email: email });

      if (existingUser)
        return res.status(400).json({
          message: "An account with this email already exists.",
        });

      // Hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      // Save the new user account to the DB
      const newUser = new User({
        email: email,
        passwordHash: passwordHash,
        creationTime: new Date(),
      });
      const savedUser = await newUser.save();

      // Sign the token. Here we are creating a token with the user's ID. This token then becomes a cookie for the website
      const token = jwt.sign(
        {
          user: savedUser._id,
        },
        process.env.JWT_SECRET
      );

      // Send the token in an HTTP-Only cookie
      res.cookie("token", token, { httpOnly: true });
      res.status(200).send(savedUser);
    } catch (err) {
      // Don't send the error as a response. This response can be used by hackers to exploit server.
      console.log(err);
      res.status(500).send();
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return res
          .status(400)
          .json({ errorMessage: "Invalid username or password." });

      const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.passwordHash
      );
      if (!passwordCorrect)
        return res
          .status(400)
          .json({ errorMessage: "Invalid username or password." });

      // Sign the token
      const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.JWT_SECRET
      );

      // Send the token in an HTTP-Only cookie
      res.cookie("token", token, { httpOnly: true });
      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  };

  static logout = async (req, res) => {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .send();
  };

  static getUser = async (req, res) => {
    try {
      if (!req.cookies.token) throw new Error("No token provided");

      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userData = await User.findOne({ _id: decoded.user });
      res.send(userData);
    } catch (err) {
      console.log(err);
      res.status(401).send();
    }
  };
}

module.exports = AuthController;
