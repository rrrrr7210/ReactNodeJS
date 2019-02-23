const mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  passport = require("passport"),
  users = require("./router/users"),
  index = require("./router/index"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  path = require("path");

// Passport Config
require("./config/passport")(passport);

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Express body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// // Express session
// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true
//   })
// );

// Passport middleware
app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use("/", index);
app.use("/users", users);

// Connect Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
