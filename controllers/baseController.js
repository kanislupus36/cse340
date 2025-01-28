const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav, errors: null,})
}

baseController.internalError = async function (req, res, next) {
  try {
    throw new Error('Intentional 500 error for testing'); // Generate the error
  } catch (error) {
    next(error); // pass the error down to the error middleware
  }
}

module.exports = baseController