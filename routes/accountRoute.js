// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));
router.get('/account-update/:accountId', utilities.handleErrors(accountController.getUpdateAccountView));
router.post('/account-update', regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccountView));
router.get("/logout", utilities.handleErrors(accountController.logOutUser));
router.post('/password', regValidate.passwordRules(), regValidate.checkUpdatePassword, utilities.handleErrors(accountController.passwordUpdateHandler));



// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.checkLoginData,
  regValidate.loginRules(),
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;