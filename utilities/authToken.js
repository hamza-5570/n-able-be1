"use strict";
const jwtHelper = require("./jwt");

let checkToken = (req, res, next) => {
  let token = req.header("x-auth-token"); // in header token will be send in "x-auth-token" variable
  if (token) {
    const isVerified = jwtHelper.verify(token);
    if (isVerified) {
      req.userId = isVerified.id;
      next();
    } else {
      return res.status(401).json({
        success: "false",
        message: "Token is not valid",
      });
    }
  } else {
    return res.status(401).json({
      success: "false",
      message: "Token is not provided",
      missingParameters: ["login_token"],
    });
  }
};

module.exports = {
  checkToken: checkToken,
};
