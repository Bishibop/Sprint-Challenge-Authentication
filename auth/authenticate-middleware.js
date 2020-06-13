const jwt = require('jsonwebtoken');
const secrets = require('./secrets.js');

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization.split(" ");
    let token = null
    // This is done to account for different authentication header formats
    if (authorizationHeader[1]) {
      token = authorizationHeader[1];
    } else {
      token = authorizationHeader[0];
    }
    if (token) {
      jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ you: 'shall not pass!' });
        } else {
          req.decodedJwt = decodedToken;
          next();
        }
      })
    } else {
      throw new Error('invalid auth data');
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
