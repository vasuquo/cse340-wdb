const bookingModel = require("../models/booking-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.bookingRules = () => {
    return [
        body("service_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please choose a service."),

        body("inv_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please choose a vehicle."),

        body("booking_period")
        .trim()
        .escape()
        .notEmpty()
        .isDecimal()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid number."), 

        body("booking_date")
        .trim()
        .escape()
        .notEmpty()
        .isDate()
        .withMessage("Please provide a valid date."), 
    ]
  }

  /* ******************************
 * Check data and return errors or continue to booking
 * ***************************** */
validate.checkBookingData = async (req, res, next) => {
    const { booking_date, booking_period, account_id, inv_id, service_id } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let servicesList = await utilities.buildServiceList()
        let inventoryList = await utilities.buildInventoryList()
        res.render("booking/create-booking", {
          errors,
          title: "Create Booking",
          nav,
          booking_date, 
          booking_period, 
          account_id, 
          inv_id, 
          service_id,
          servicesList,
          inventoryList,
        })
        return
      }
      next()

}
 
module.exports = validate