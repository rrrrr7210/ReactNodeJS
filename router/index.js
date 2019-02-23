const express = require("express"),
  router = express.Router(),
  User = require("../models/User"),
  bcrypt = require("bcrypt"),
  isEmpty = require("../helpers/is-empty"),
  passport = require("passport"),
  jwt = require("jsonwebtoken"),
  keys = require("../config/keys"),
  validateRegister = require("../helpers/registerValidation"),
  validateLogin = require("../helpers/loginValidate");

// Pages
router.get("/", (req, res) => res.send("INDEX PAGE"));

router.get("/login", (req, res) => res.send("LOGIN PAGE"));

router.get("/register", (req, res) => res.send("REGISTER PAGE"));

router.get("/getCurrentUser/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      res.json(user);
    })
    .catch(err => console.log(err));
});

// Register Post
router.post(
  "/register",

  (req, res) => {
    const { errors, isValid } = validateRegister(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          errors.email = "Email already in use!";
          return res.status(400).json(errors);
        } else {
          // Validate success
          const { name, email, password, password2 } = req.body;

          const newUser = new User({
            name,
            email,
            password
          });

          // Hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(res.send("success"))
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(err => console.log(err));
  }
);

// Login Post
router.post("/login", (req, res, next) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      // Check for user
      if (!user) {
        errors.email = "User not found!";
        return res.status(404).json(errors);
      } else {
        // Check Password
        bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              // User Matched
              const payload = {
                id: user.id,
                name: user.name,
                email: user.email
              };

              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                }
              );
            } else {
              errors.password = "Password incorrect";
              return res.status(400).json(errors);
            }
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
