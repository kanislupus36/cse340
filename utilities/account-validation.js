const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("Please, input a valid email"),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
  // All errors, if any, will be stored into the errors array.
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
          errors,
          title: "Login",
          nav,
          account_email, // stick this
      })
      return
  }
  next()
}

/*  **********************************
  *  Update Account Data Validation Rules
  * ********************************* */
validate.updateRules = () => {
  return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
          .trim()
          .escape()
          .notEmpty()
          .isEmail()
          .normalizeEmail() // refer to validator.js docs
          .withMessage("A valid email is required.")
          .custom(async (account_email, { req }) => {
              const account_id = req.body.account_id
              const emailExists = await accountModel.checkExistingEmail(account_email, account_id)
              if (emailExists) {
                  throw new Error("Email exists. Please log in or use different email")
              }
          }),

      // valid email is required and cannot already exist in the DB
      body("account_firstname")
          .trim()
          .escape()
          .notEmpty()
          .isString(),

      // valid email is required and cannot already exist in the DB
      body("account_lastname")
          .trim()
          .escape()
          .notEmpty()
          .isString(),
  ]
}

validate.checkUpdateData = async (req, res, next) => {
  const { account_email, account_firstname, account_lastname } = req.body
  let errors = []
  //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
  // All errors, if any, will be stored into the errors array.
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/management", {
          errors,
          title: "Login",
          nav,
          account_email, // stick this
          account_firstname, // stick this
          account_lastname // stick this
      })
      return
  }
  next()
}

validate.passwordRules = () => {
  return [
      // password is required and must be strong password
      body("account_password")
          .trim()
          .notEmpty()
          .isStrongPassword({
              minLength: 12,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1,
          })
          .withMessage("Password does not meet requirements."),
      // todo : add custom to avoid same password
  ]
}

validate.checkUpdatePassword = async (req, res, next) => {
  const { account_password, account_id } = req.body
  let errors = []
  //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
  // All errors, if any, will be stored into the errors array.
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const accountData = accountModel.getAccountById(account_id)
      res.locals.accountData = accountData // what to stick
      res.render("account/account-update", {
          errors,
          title: "Update Password",
          nav,
      })
      return
  }
  next()
}
  
  module.exports = validate