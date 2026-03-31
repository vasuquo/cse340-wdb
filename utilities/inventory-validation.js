const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification form Validation Rules
  * ********************************* */
 validate.classificationRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("A valid classification name is required."),
    ]
 }


/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [
      // inv_make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle make."), // on error this message is sent.
  
      // inv_model is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle model."), // on error this message is sent.

      // inv_year is required and must be number
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a vehicle year."), // on error this message is sent.

      // inv_description is required and must be string
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a description."), // on error this message is sent.

      // inv_image is required and must be string
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide image path."), // on error this message is sent.

      // inv_thumbnail is required and must be string
      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide image path."), // on error this message is sent.

      // inv_price is required and must be number
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()      
        .withMessage("Please provide a valid price."), // on error this message is sent.

      // inv_miles is required and must be number
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()  
        .withMessage("Please provide vehicle mileage."), // on error this message is sent.

      // inv_color is required and must be string
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide vehicle color."), // on error this message is sent.
      
      // classification_id is required and must be number
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid classification id."), // on error this message is sent.

    ]
  }

  /* ******************************
 * Check data and return errors or continue to Classification Form
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,            
    })
    return
  }
  next()
}

  
 /* ******************************
 * Check data and return errors or continue to inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color,      
    })
    return
  }
  next()
}

module.exports = validate