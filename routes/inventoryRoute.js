// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryDetailsById));

// Route build view for adding new inventories
 router.get("/classification", utilities.handleErrors(invController.buildClassification))


// Route build view for adding new inventories
router.get("/vehicle", utilities.handleErrors(invController.buildInventory))

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Get inventory for AJAX route 
router.get("/getInventory/:classification_id", 
//    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON)
)

// Route to modify inventory items
router.get("/edit/:inv_id", 
    utilities.handleErrors(invController.editInventory))

// Route to delete an item from inventory
router.get("/delete/:inv_id",
    utilities.handleErrors(invController.deleteIView))

  

// Route to store classification data from the classification form
router.post("/classification", 
    inventoryValidate.classificationRules(),
    inventoryValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))

// Route to store classification data from the classification form
router.post("/vehicle", 
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory))

// Route to update vehicle data
router.post("/update",
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkInventoryUpdateData,
    utilities.handleErrors(invController.updateInventory)
)    
        
// Route to delete an item from inventory
router.post("/delete",
    utilities.handleErrors(invController.removeInventory)
)    








module.exports = router;
