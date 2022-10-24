const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getMembers,
  acceptUser,
} = require("../controllers/authController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/profile/update").put(isAuthenticatedUser, updateProfile);
router.route("/members").get(isAuthenticatedUser, getMembers);

router.route("/superadmin/user/reset/:id").get(isAuthenticatedUser, authorizeRoles('superadmin'), resetPassword);
router.route('/superadmin/users').get(isAuthenticatedUser, authorizeRoles('superadmin'), allUsers);
router.route('/superadmin/user/accept/:id').get(isAuthenticatedUser, authorizeRoles('superadmin'), acceptUser);
router.route('/superadmin/user/:id')
                                .get(isAuthenticatedUser, authorizeRoles('superadmin'), getUserDetails)
                                .put(isAuthenticatedUser, authorizeRoles('superadmin'), updateUser)
                                .delete(isAuthenticatedUser, authorizeRoles('superadmin'), deleteUser);

module.exports = router;
