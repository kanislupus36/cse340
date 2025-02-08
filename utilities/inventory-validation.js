const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}
/*  *****************************************
  *  Add Classification Data Validation Rules
  * ***************************************** */
validate.addClassificationRules = () => {
    return [
        // classification_name is required and must be an alphanumeric string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9\s]*$/) // enforce the pattern on the server-side as well
            .withMessage("Please provide an alphanumeric classification name"), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue to adding classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
    // All errors, if any, will be stored into the errors array.
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/classification", {
            errors,
            title: "Registration",
            nav,
            classification_name,
        })
        return
    }
    next()
}


validate.addInventoryRules = () => {
    return [
        // inv_make is required and must be a string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isString()
            .matches(/^[a-zA-Z\s]*$/) // enforce the pattern on the server-side as well
            .withMessage("Please provide a valid make."),

        // inv_model is required and must be a string
        body("inv_model")
            .notEmpty()
            .isString()
            .matches(/^[a-zA-Z\s]*$/) // enforce the pattern on the server-side as well
            .withMessage("Please provide a valid model."),

        // inv_year is required and must be a string
        body("inv_year")
            .notEmpty()
            .isNumeric()
            .matches(/\d{4}/) // enforce the pattern on the server-side as well
            .withMessage("Please provide a valid year."),

        // inv_make is required and must be a string
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isString()
            .withMessage("Please provide a valid description."),

        // inv_image is required and must be a string
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .isString()
            .withMessage("Please provide a valid image url."),

        // inv_thumbnail is required and must be a string
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .isString()
            .withMessage("Please provide a valid thumbnail url."),

        // inv_price is required and must be a string
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a valid price."),

        // inv_miles is required and must be a string
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a valid miles amount."),

        // inv_color is required and must be a string
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid color."),

        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please select a classification name."),
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
    // All errors, if any, will be stored into the errors array.
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            // stick these
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classificationSelect,
        })
        return
}
next()


}
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
    let errors = []
    //  calls the express-validator "validationResult" function and sends the request object (containing all the incoming data) as a parameter. 
    // All errors, if any, will be stored into the errors array.
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            nav,
            // stick these
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classificationSelect,
            inv_id,
        })
        return
}
next()
}


module.exports = validate