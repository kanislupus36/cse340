const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Get specific vehicle details by inventory ID
 * ************************** */
invCont.getVehicleDetails = async function (req, res, next) {
  const inv_id = req.params.inventoryId
    const data = await invModel.getVehicleById(inv_id)
    const details = await utilities.formatVehicleData(data)
    let nav = await utilities.getNav()
    const vehicleYear = data.inv_year
    const vehicleMake = data.inv_make
    const vehicleModel = data.inv_model
    
    res.render("./inventory/classification", {
        title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
        nav,
        details
    })
}

module.exports = invCont