const UserModel = require("./userModel");
require("dotenv").config();
const sendEmailOTP = require("../../helper/emailHelper");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const otpStore = new Map();

const register = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;

        // Check if at least one contact method is provided
        if (!email && !phone_number) {
            return res.status(400).json({
                status: "fail",
                message: "Email or phone number is required.",
            });
        }

        // Build query dynamically based on provided values
        const query = [];
        if (email) query.push({ email });
        if (phone_number) query.push({ phone_number });

        // Check if user already exists
        const existingUser = await UserModel.findOne({ $or: query });

        if (existingUser) {
            let message = "User already exists.";

            if (email && existingUser.email === email) {
                message = "Email already exists.";
            } else if (phone_number && existingUser.phone_number === phone_number) {
                message = "Phone number already exists.";
            }

            return res.status(400).json({
                status: "fail",
                message,
            });
        }

        // Generate OTP and expiration
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 2 * 60 * 1000; // 2 minutes

        const key = email || phone_number;

        // Store OTP and user data temporarily (e.g., in memory or Redis)
        otpStore.set(key, {
            otp,
            expiresAt: otpExpires,
            userData: {
                name,
                email: email || null,
                phone_number: phone_number || null,
                password,
            },
        });

        // Send OTP
        if (email) {
            await sendEmailOTP(otp, email, name); // Send OTP to email
            return res.status(200).json({
                otp,
                status: "success",
                message: "OTP sent to email. Please verify to complete registration.",
            });
        }

        // If only phone number provided, send OTP to phone (optional SMS support)
        // await sendSMSOtp(otp, phone_number); // Optional if SMS integration is available

        return res.status(200).json({
            otp,
            status: "success",
            message: "OTP sent to phone. Please verify to complete registration.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "fail",
            message: "Internal server error.",
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, phone_number, otp } = req.body;

        const identifier = email || phone_number;

        console.log(identifier)

        if (!identifier || !otp) {
            return res.status(400).json({ status: "fail", message: "Email or phone number and OTP are required." });
        }



        const record = otpStore.get(identifier);

        console.log("Record from store:", record);

        if (!record) {
            return res.status(400).json({ status: "fail", message: "No OTP found. Please register again." });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(identifier);
            return res.status(400).json({ status: "fail", message: "OTP expired." });
        }


        if (String(record.otp).trim() !== String(otp).trim()) {
            return res.status(400).json({ status: "fail", message: "Invalid OTP." });
        }

        const { name, email: userEmail, phone_number: userPhone, password } = record.userData;
        const active = true
        const user = new UserModel({
            name,
            email: userEmail,
            phone_number: userPhone,
            password,
            isActive: active
        });

        await user.save();

        // Clean up
        otpStore.delete(identifier);

        res.status(201).json({ status: "success", message: "User verified and registered successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "fail", message: "Internal server error." });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, phone_number, password } = req.body;


        const existsUser = await UserModel.findOne({
            $or: [{ email }, { phone_number }]
        });

        if (!existsUser) {
            return res.status(404).json({
                status: "fail",
                msg: "User not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, existsUser.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                status: "fail",
                msg: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: existsUser._id },
            process.env.JWTKEY,
            { expiresIn: "7d" }
        );

        // If everything is fine, return success
        return res.status(200).json({
            status: "success",
            msg: "Login successful",
            token: token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong",
            error: error.message
        });
    }
};


module.exports = {
    register,
    verifyOTP,
    loginUser
}