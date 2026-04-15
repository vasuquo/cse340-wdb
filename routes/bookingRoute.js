const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const bookingController = require("../controllers/bookingController")
const bookValidate = require('../utilities/booking-validation')


//route to account management view
router.get("/", utilities.checkLogin, 
    utilities.handleErrors(bookingController.buildMgtView))


//route to account management view
router.get("/new", utilities.checkLogin, 
    utilities.handleErrors(bookingController.buildBookingView))


// Get booking services for AJAX route 
router.get("/getServices/:service_id", 
    utilities.handleErrors(bookingController.getServicesJSON)
)

// Route to initiate creation of bookin records
router.post("/create", 
    bookValidate.bookingRules(),
    bookValidate.checkBookingData,
    utilities.handleErrors(bookingController.createBooking))



module.exports = router