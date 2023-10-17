const express = require('express');
const { register,login,logout, getMyProfile, changePassword,updateProfile, resetPassword, forgetPassword,addToPlaylist,removeFromPlaylist } = require('../controllers/UserController');
const { isAuthenticated } = require('../middleware/IsAuthenticated');
const branchController = require("../controllers/branchController");

const router = express.Router();


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(isAuthenticated,logout);
router.route('/me').get(isAuthenticated,getMyProfile);
router.route('/change-password').put(isAuthenticated,changePassword);
router.route('/update-profile').put(isAuthenticated,updateProfile);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:token').post(resetPassword);



/*****branch routs here *********/

router.post("/branches", branchController.createBranch);
router.get("/branches", branchController.getAllBranches);
router.get("/branches/:id", branchController.getBranchById);
router.put("/branches/:id", branchController.updateBranchById);
router.delete("/branches/:id", branchController.deleteBranchById)

module.exports = router;
