const express = require("express");
const app = express();
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
app.set("view engine", "ejs");



// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "Connet key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const authRoutes = require("./routes/authRoutes");

app.use(authRoutes);





const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
connectDB();
