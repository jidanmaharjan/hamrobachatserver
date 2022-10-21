const express = require("express");
const router = express.Router()

const { changeOverall, getOverall } = require("../controllers/overallController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route('/getoverall').put(isAuthenticatedUser,getOverall)
router.route('/changeoverall').put(isAuthenticatedUser,authorizeRoles('admin'),changeOverall)

module.exports = router