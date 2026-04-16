const utilities = require("../utilities/")
const bookingModel = require("../models/booking-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Build Booking Management view
* *************************************** */
async function buildMgtView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("booking/booking-mgt", {
    title: "Vehical Rental and Tour Ride",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Build Booking view
* *************************************** */
async function buildBookingView(req, res, next) {
  let nav = await utilities.getNav()
  let servicesList = await utilities.buildServiceList()
  let inventoryList = await utilities.buildInventoryList()
  res.render("booking/create-booking", {
    title: "Create Booking",
    nav,
    errors: null,
    servicesList,
    inventoryList
  })
}

/* ****************************************
*  Return booking service by service_id as JSON
* *************************************** */
async function getServicesJSON (req, res, next) {
  const service_id = parseInt(req.params.service_id)
  const serviceData = await bookingModel.getServicesByServiceId(service_id)
  if (serviceData[0].service_id) {
    return res.json(serviceData)
  } else {
    next(new Error("No data return"))
  }
}

/* ****************************************
*  Process Booking
* *************************************** */
async function createBooking(req, res) {
  let nav = await utilities.getNav()
  const { booking_description, booking_date, booking_period, booking_amount, account_id, inv_id, service_id } = req.body

  const bookResult = await bookingModel.createBooking(
    booking_description,
    booking_date, 
    booking_period, 
    booking_amount, 
    account_id, 
    inv_id, 
    service_id
  )

  if (bookResult) {
    req.flash(
      "notice",
      `Congratulations, you have made your booking. Now go to payment.`
    )
    res.status(201).render("booking/payment", {
      title: "Make Payment", nav, errors: null
    })
  } else {
    req.flash("notice", "Sorry, the booking failed.")
    let servicesList = await utilities.buildServiceList()
    let inventoryList = await utilities.buildInventoryList()
    res.status(501).render("booking/create-booking", {
      title: "Create Booking",
      nav,
      errors: null,
      servicesList,
      inventoryList
    })
  }
}



module.exports = {buildBookingView, buildMgtView, createBooking, getServicesJSON}
