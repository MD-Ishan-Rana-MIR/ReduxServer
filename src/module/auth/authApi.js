const express = require("express");
const { register, verifyOTP, loginUser } = require("./authController");

const router = express.Router();

router.post("/registration", register);
router.post("/otpVerify", verifyOTP);
router.post("/loginUser", loginUser);

module.exports = router

