// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build each item view 
router.get("/detail/:itemId", utilities.handleErrors(invController.buildInventoryItem));

//router.get("/management", utilities.handleErrors(invController.buildManagement));
// Route to add classification 

router.post("/classification", invValidate.addClassificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addNewClassification));
router.get("/add-classification", utilities.handleErrors(invController.buildClassificationForm));

router.get("/add-inventory", utilities.handleErrors(invController.buildInventoryForm));
router.post("/add-inventory", invValidate.addInventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addNewInventory));

router.get("/inv/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/", utilities.handleErrors(invController.buildManagement));

module.exports = router;