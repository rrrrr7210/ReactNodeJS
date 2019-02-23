const isEmpty = require("./is-empty"),
  Validator = require("validator");

module.exports = function validateLogin(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters!";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid email!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
