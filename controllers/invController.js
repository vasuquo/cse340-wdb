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
 *  Build vehicle details view
 * ************************** */
invCont.buildInventoryDetailsById = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getDetailsByInventoryId(inventory_id)
  const details = await utilities.buildInventoryDetails(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_make + ' '+ data[0].inv_model
  res.render("./inventory/details", {
    title: className,
    nav,
    details,
  })
}

/* ****************************************
*  Deliver New Classification view
* *************************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver New Inventory view
* *************************************** */
invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationList
  })
}

/* ****************************************
*  Process classification data
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have created ${classification_name}. Proceed to add inventory.`
    )
    res.status(201).render("./inventory/add-inventory", {
      title: "Add Inventory", nav,
    })
  } else {
    req.flash("notice", "Sorry, classification creation failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ****************************************
*  Process Inventory data
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, inventory created . Proceed to add a new classification.`
    )
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification", nav,
    })
  } else {
    req.flash("notice", "Sorry, classification creation failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    })
  }
}



module.exports = invCont