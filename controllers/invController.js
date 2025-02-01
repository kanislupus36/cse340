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
    errors: null,
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildInventoryItem = async function (req, res, next) {
  try {
    const item_id = req.params.itemId
    // the below returns the data.rows
    const item = await invModel.getInventoryItemDetail(item_id)
    // build page for itemId
    const card = await utilities.buildItemDetailView(item)
    // maintain the same nav though we need to make another call to db
    let nav = await utilities.getNav()
    const className = item.inv_make + " " + item.inv_model
    res.render("./inventory/item", {
      title: className + " vehicle",
      nav,
      card,
      errors: null,
    })
  } catch (error) {
    console.error("Error ", error.message)
    next(error)
  }
}

invCont.addNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  try {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const data = await invModel.insertNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    console.log(data.rows[0]);
    req.flash("success", 'Great! Inventory for ' + inv_make + ' ' + inv_model + ' created!')
    res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the new inventory.')
    let select_classification = await utilities.buildClassificationList(req.body.classification_id)
    console.log("66", select_classification)
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Classification",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      select_classification,
      errors: null,
    })
  }
}
      

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const data = await invModel.insertClassification(classification_name)
    const className = data.rows[0].classification_name
    // getNav after insert to make sure it has been updated
    nav = await utilities.getNav()
    req.flash("success", 'Great! ' + className + ' classification created!')
    res.render("./inventory/management", {
      title: className + " vehicles",
      title: "Management",
      nav,
      errors: null,
    })
  } catch (error) {
    let nav = await utilities.getNav()
    req.flash("notice", 'Sorry, there was an error processing the new classification.')
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}
/* ***************************
 *  Build the basic for the management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } catch (error) {
    console.error("Error ", error.message)
    next(error)
  }
}
/* ***************************
 *  Add inventory classification form view
 * ************************** */
invCont.buildClassificationForm = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    console.error("Error ", error.message)
    next(error)
  }
}

/* ***************************
 *  Build add inventory item form
 * ************************** */
invCont.buildInventoryForm = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let select_classification = await utilities.buildClassificationList();
    console.log("select_classification", select_classification)
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      select_classification,
      errors: null,
    })
  } catch (error) {
    console.error("Error ", error.message)
    next(error)
  }
}

module.exports = invCont