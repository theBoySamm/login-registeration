const express = require("express");
const router = express.Router();
const {
  register,
  login,
  registerUser,
  secretRoute,
  loginUser,
  homeRoute,
  deleteRoute,
  logout
} = require("../controllers/authController");

const {verifyToken, checkUser} = require("../middleware/auth")


router.get("*", checkUser)

router.get("/", homeRoute);

router.get("/delete", deleteRoute);

router.get("/secrets", verifyToken, secretRoute);

router.get("/register", register);

router.post("/register", registerUser);

router.get("/login", login);

router.post("/login", loginUser);

router.get("/logout", logout);

module.exports = router;
