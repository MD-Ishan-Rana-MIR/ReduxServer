const express = require("express");
const { register, verifyOTP, loginUser, userProfile } = require("./authController");
const verifyToken = require("../../middlewares/middleware");

const router = express.Router();

router.post("/registration", register);
router.post("/otpVerify", verifyOTP);
router.post("/loginUser", loginUser);
router.get("/profile", verifyToken,userProfile);

module.exports = router

