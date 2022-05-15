const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) res.status(401).json({ errorMessage: "Unauthorized" });

    // Verify compares token with password, if it hasn't it will throw an error.
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Pass along the user id, so that the endpoint will have the user id.
    req.user = verified.user;

    // Exit out of the auth middleware, continue executing this endpoint
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
};

module.exports = auth;
