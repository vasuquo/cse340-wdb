/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const session = require("express-session")
const pool = require('./database/')
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const errorController = require("./controllers/errorController")
const utilities = require("./utilities/")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")




/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(cookieParser())


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


/* ***********************
 * Routes
 *************************/

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//View Engine and Templates
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

app.use(static)

// Index route
// app.get("/", baseController.buildHome)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.get("/inv", utilities.handleErrors(baseController.buildInventory))
app.get("/oop", utilities.handleErrors(errorController.helloWorld))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) 
  { 
    message = err.message
  } 
  else {
     message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  let custom = utilities.getCustomError(message)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    custom,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})