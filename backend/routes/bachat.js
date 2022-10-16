const express = require("express");
const router = express.Router();

const {
    getMonthData, createBachat, getAllMonths, submitRequest, getSubmitDetails, getUnverifiedUsers, verifySubmission,
} = require("../controllers/bachatController")


const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");


router.route("/month/:month").get(isAuthenticatedUser, getMonthData);
router.route("/create").get(createBachat);
router.route("/allmonths").get(isAuthenticatedUser,getAllMonths);
router.route("/submitcurrentmonth").get(isAuthenticatedUser, submitRequest);
router.route("/submitdetails").get(isAuthenticatedUser, getSubmitDetails);
router.route("/getunverifiedusers").get(isAuthenticatedUser, authorizeRoles('admin'), getUnverifiedUsers);
router.route("/verifysubmission").get(isAuthenticatedUser, authorizeRoles('admin'), verifySubmission);

module.exports = router;