const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver Management view
* *************************************** */
async function buildManager(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/manager", {
    title: "Account Management View",
    nav,
    errors: null
  }) 
}

/* ****************************************
*  Build Account Update view
* *************************************** */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update-view", {
    title: "Account Update View",
    nav,
    errors: null
  }) 
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login", nav, errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout
 * ************************************ */
async function accountLogout(req, res) {
    res.clearCookie("jwt")
    req.flash("notice", "Logged out successfully")
    res.redirect("/account/login")
}

/* ***************************
 *  Build edit account view
 * ************************** */
async function editAccount(req, res) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const itemData = await accountModel.getAccountById(account_id)
  const itemName = `${itemData.account_firstname} ${itemData.account_lastname}`
  res.render("./account/edit-account", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
  })
}

/* ***************************
 *  Build Change Password view
 * ************************** */
async function changePassword(req, res) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const itemData = await accountModel.getAccountById(account_id)
  const itemName = `${itemData.account_firstname} ${itemData.account_lastname}`
  res.render("./account/change-password", {
    title: "Change Password for " + itemName,
    nav,
    errors: null,
    account_id  
  })
}


/* ***************************
 *  Update account Data
 * ************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const {account_id, account_firstname, account_lastname, 
    account_email} = req.body

  const updateResult = await accountModel.updateAccount(
    account_id, account_firstname, account_lastname, 
    account_email
  )

  if (updateResult) {
    req.flash("notice", `Account successfully updated.`)
    res.redirect("/account/menu")
  } else {
    const itemName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit-account", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    account_id, 
    account_firstname, 
    account_lastname, 
    account_email, 
    })
  }
}

/* ***************************
 *  Change password
 * ************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const {account_id, account_password} = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/change-password", {
      title: "Change Password ",
      nav,
      errors: null,
      account_id, 
    })
  }

  const updateResult = await accountModel.updatePassword(
    account_id, hashedPassword
  )

  if (updateResult) {
    req.flash("notice", `Password changed successfully.`)
    res.redirect("/account/menu")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/change-password", {
    title: "Change Password ",
    nav,
    errors: null,
    account_id 
    })
  }
}



module.exports = { accountLogin, accountLogout, 
  buildLogin, buildRegister, buildManager, 
  buildUpdateView, changePassword,
  editAccount, registerAccount, updateAccount, updatePassword }