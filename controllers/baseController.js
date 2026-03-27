const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
//  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

baseController.buildInventory = async function(req, res){
  const nav = await utilities.getNav()
//  req.flash("notice", "This is a flash message.")
  res.render("inventory/management", {title: "Inventory Management", nav})
}


module.exports = baseController