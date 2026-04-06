const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build account login and registration view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

//Route to account registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//route to account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManager))

//route to update information view
router.get("/menu", utilities.checkLogin, 
    utilities.handleErrors(accountController.buildUpdateView))

// Route to edit account details
router.get("/edit/:account_id", 
    utilities.handleErrors(accountController.editAccount))

// Route to edit account details
router.get("/change/:account_id", 
    utilities.handleErrors(accountController.changePassword))



// Route to initiate login 
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to initiate registration of data from the registration form
router.post("/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Route to update account data
router.post("/update",
    regValidate.accountUpdateRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccount)
)    

// Route to update account password
router.post("/change",
    regValidate.changePasswordRules(),
    utilities.handleErrors(accountController.updatePassword)
)    


module.exports = router