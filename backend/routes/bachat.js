const express = require("express");
const router = express.Router();

const {
    getMonthData, createBachat,
} = require("../controllers/bachatController")


const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");


router.route("/month/:month").get(isAuthenticatedUser, getMonthData);
router.route("/create").get(createBachat);

module.exports = router;