const express = require('express');
const { register,login,logout, getMyProfile, changePassword,updateProfile, resetPassword, forgetPassword,addToPlaylist,removeFromPlaylist, createMerchantUser, getAllMerchant } = require('../controllers/UserController');
const { isAuthenticated, isMerchantAdmin, isAdmin} = require('../middleware/IsAuthenticated');
const branchController = require("../controllers/branchController");
const userRoleController = require("../controllers/userRoleController");
const branchUserController = require("../controllers/branchUserController");
const currencyController = require("../controllers/currencyController");
const dailyRateController = require('../controllers/dailyRateController');

const router = express.Router();


router.route('/register').post(register);
router.route('/create-merchant').post(createMerchantUser);
router.route('/login').post(login);
router.route('/logout').get(isAuthenticated,logout);
router.route('/me').get(isAuthenticated,getMyProfile);
router.route('/get-all-merchant').get(isAuthenticated,isAdmin, getAllMerchant);
router.route('/change-password').put(isAuthenticated,changePassword);
router.route('/update-profile').put(isAuthenticated,updateProfile);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:token').post(resetPassword);



/*****branch routs here *********/

router.post("/branches", isAuthenticated,isMerchantAdmin, branchController.createBranch);
router.get("/branches",isAuthenticated,isMerchantAdmin,  branchController.getAllBranches);
router.get("/branches/:id",isAuthenticated,isMerchantAdmin,  branchController.getBranchById);
router.put("/branches/:id",isAuthenticated,isMerchantAdmin,  branchController.updateBranchById);
router.delete("/branches/:id",isAuthenticated,isMerchantAdmin,  branchController.deleteBranchById);


//*****User Role Routes*****//
router.post("/create-role", isAuthenticated,isAdmin, userRoleController.createRole );
router.get("/get-role", isAuthenticated, userRoleController.getRole);
router.put("/assign-role", isAuthenticated, isMerchantAdmin, userRoleController.assignRolesToBranchUser);


//****Branch User Routes****//
router.post("/create-branch-user", isAuthenticated, isMerchantAdmin, branchUserController.createUser);
router.post("/login-branch-user", branchUserController.loginBranchUser);
router.get("/get-my-user", isAuthenticated, isMerchantAdmin, branchUserController.getMyUsers);


/***********currencies routes *****************/
router.post('/currencies', currencyController.createCurrency);
router.get('/currencies', currencyController.getAllCurrencies);
router.get('/currencies/:id', currencyController.getCurrencyById);
router.put('/currencies/:id', currencyController.updateCurrencyById);
router.delete('/currencies/:id', currencyController.deleteCurrencyById);

//****Daily Rate Route****//
router.post("/daily-rate", isAuthenticated, isMerchantAdmin, dailyRateController.setDailyRate);

module.exports = router;
