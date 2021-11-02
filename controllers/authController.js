// Here, we create our handler functions
const User = require("../models/user");
const config = require("config");
const secrets = config.get("secrets");
const jwt = require("jsonwebtoken");

// handleErrors

function handleErrors(err) {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "Your password is incorrect";
  }

  //incorrect email
  if (err.message === "incorrect email") {
    errors.password = "Your email is incorrect";
  }

  // duplicate error
  if (err.code === 11000) {
    errors.email = "email is already registered";
  }

  // Validatiion errors  
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

// create the jwt token
const maxAge =  3 * 24 * 60 * 60; // 3 days in seconds //"1h" //
const createToken = (id) => {
  return jwt.sign({ id }, secrets, {
    expiresIn: maxAge,
  });
};

const deleteRoute = (req, res) => {
  User.deleteMany({}, function (err, user) {
    if (err)
      return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("Successfully removed all users");
  });
};

const homeRoute = (req, res) => {
  res.render("index");
};

const secretRoute = (req, res) => {
  res.render("secrets");
};

const register = (req, res) => {
  res.render("register");
};

const login = (req, res) => {
  const { email, password } = req.body;
  res.render("login");
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.create({
      email,
      password,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    req.flash("success", "Registration Successful");

    res.redirect("secrets");
  } catch (err) {
    const errors = handleErrors(err);
    req.flash("error", errors.password);
    if (err.code === 11000) {
      req.flash("error", "email is already registered");
    }
    res.redirect("register");
  }
};

const loginUser = async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    req.flash("success", "Login Successful");
    res.redirect("secrets");
  } catch (err) {
    const errors = handleErrors(err);
    if (errors.password) {
      req.flash("error", errors.password);
    }
    if (errors.email) {
      req.flash("error", errors.email);
    }
    res.redirect("login");
  }
};

const logout = (req, res) => {
  res.cookie("jwt", " ", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  register,
  login,
  registerUser,
  loginUser,
  homeRoute,
  deleteRoute,
  secretRoute,
  logout,
};
