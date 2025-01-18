const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];

  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    // Verify the token
    jwt.verify(bearerToken, process.env.SECRET, (err, authData) => {
      if (err) {
        // If verification fails, send 403 Forbidden
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      // If token is valid, attach the user data to the request
      req.user = authData;
      // Next middleware
      next();
    });
  } else {
    // Forbidden
    res.status(403).json({ error: "No token provided" });
  }
}
module.exports = verifyToken;
