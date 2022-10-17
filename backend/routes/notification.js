const express = require("express");
const router = express.Router()

const { newNotification, getAllnotifications, seeNotification, seeAllNotifications } = require('../controllers/notificationController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route('/notification/create').post(isAuthenticatedUser, authorizeRoles('admin'), newNotification)
router.route('/allnotifications').get(isAuthenticatedUser, getAllnotifications)
router.route('/seenotification').get(isAuthenticatedUser, seeNotification)
router.route('/seeallnotifications').get(isAuthenticatedUser, seeAllNotifications)

module.exports = router