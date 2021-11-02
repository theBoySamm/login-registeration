const jwt = require("jsonwebtoken");
const User = require("../models/user")
const config = require("config");
const secrets = config.get("secrets");

module.exports.verifyToken =  (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secrets, (err, decodedToken) => {
      if (err) {
        throw Error("cannot verify token")
        res.redirect("login");
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    res.redirect("login");
  }
};


module.exports.checkUser =   function (req, res, next) {
  const token = req.cookies.jwt
  if(token){
    jwt.verify(token, secrets, async (err, decodedToken) => {
      if (err) {
        console.log(err.message); 
        res.locals.user = null
      } else {
        // console.log(decodedToken);
        const user = await  User.findById(decodedToken.id);
        res.locals.user = user
        next();
      }
    });
  }else{
    res.locals.user = null;
    next()
  }
}