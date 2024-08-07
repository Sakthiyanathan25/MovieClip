const jwt = require('jsonwebtoken');

const userAuthorization = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ errMsg: "Invalid Jwt Token" });
  }
  
  const jwtToken = authHeader.split(" ")[1];
  jwt.verify(jwtToken, process.env.USER_SECRET_TOKEN, (err, payload) => {
    if (err) {
      return res.status(401).send("Invalid JWT Token");
    }
    req.username = payload.username;
    next();
  });
};

const adminAuthorization = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ errMsg: "Invalid Jwt Token" });
  }
  
  const jwtToken = authHeader.split(" ")[1];
  jwt.verify(jwtToken, process.env.ADMIN_SECRET_TOKEN, (err, payload) => {
    if (err) {
      return res.status(401).send("Invalid JWT Token");
    }
    req.admin = payload.adminname;
    next();
  });
};

module.exports = { userAuthorization, adminAuthorization };
