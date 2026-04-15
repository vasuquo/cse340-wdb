const invModel = require("../models/inventory-model")
const bookingModel = require("../models/booking-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
//      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification select list
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* **************************************
* Build the vehicle details view HTML
* ************************************ */
Util.buildInventoryDetails = async function(data){
  let details
  if(data.length > 0){
    details = '<div class="row">'
      details += '<section class="image-section">'
      details += '<img src="' + data[0].inv_image 
      +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
      +'" />'
      details += '</section>'      
      details += '<section class="price-section">'
      details += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + ' Details: </h2>'
      details +=  '<h3>Description:<span>'+ '  ' + data[0].inv_description + '</span></h3>'       
      details += '<h3 id="price">'
      details += 'Price: $<span>' 
      + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</span></h3>'  
      details += '<h3>Make: <span>'
       + data[0].inv_make +'</span></h3>' 
       details += '<h3>Model: <span>'
      + data[0].inv_model + '</span></h3>' 
      details += '<h3>Color: <span>'
      + data[0].inv_color + '</span></h3>' 
      details += '<h3>Year: <span>'
      + data[0].inv_year + '</span></h3>'
      details += '<h3>Milage: <span>'
      + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</span></h3>'          
    details += '</section>' 
    details += '</div>'          
    
  } else { 
    details += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return details
}

/* **************************************
* Build custom error view
* ************************************ */
Util.getCustomError = function(message){
  let custom
  custom = '<div class="error-container">'
  custom += '<p>' + message + '</p></div>'
  return custom
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    res.locals.type = accountData.account_type
    res.locals.account_id = accountData.account_id
    res.locals.status = "Logout"
    res.locals.statusUrl = "/account/logout"  
    res.locals.fname = accountData.account_firstname
    res.locals.user = accountData.account_firstname + " " + accountData.account_lastname
    next()
   })
 } else {
   res.locals.status = "My Account"
   res.locals.statusUrl = "/account/login"
   res.locals.user = ""
   res.locals.fname = ""
   res.locals.accountUrl = ""
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
      next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Chect Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    if (res.locals.type === "Admin" || res.locals.type === "Employee") {
        next()
      } else {
        req.flash("notice", "Your are not permitted to access this option")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }    
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

}

/* **************************************
* Build the services select list
* ************************************ */

Util.buildServiceList = async function (service_id = null) {
    let data = await bookingModel.getServices()
    let servicesList =
      '<select name="service_id" id="servicesList" required>'
    servicesList += "<option value=''>Choose a Service</option>"
    data.rows.forEach((row) => {
      servicesList += '<option value="' + row.service_id + '"'
      if (
        service_id != null &&
        row.service_id == service_id
      ) {
        servicesList += " selected "
      }
      servicesList += ">" + row.service_description + "</option>"
    })
    servicesList += "</select>"
    return servicesList
  }


  /* **************************************
* Build the Inventory select list
* ************************************ */

Util.buildInventoryList = async function (inv_id = null) {
  let data = await invModel.getInventory()
  let inventoryList =
      '<select name="inv_id" id="inventoryList" required>'
    inventoryList += "<option value=''>Choose a vehicle</option>"
    data.rows.forEach((row) => {
      inventoryList += '<option value="' + row.inv_id + '"'
      if (
        inv_id != null &&
        row.inv_id == inv_id
      ) {
        inventoryList += " selected "
      }
      inventoryList += ">" + row.inv_make + " " + row.inv_model + "</option>"
    })
    inventoryList += "</select>"
    return inventoryList
}




module.exports = Util