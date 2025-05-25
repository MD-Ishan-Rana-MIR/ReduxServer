const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        phone_number: { type: String, unique: true, sparse: true },
        password: { type: String, required: true,},
        isBand: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false },
        otp: { type: String, select: false },
        otpExpiry: { type: Date, select: false },
        otpType: { type: String, enum: ["email", "phone"], select: false },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Generate OTP with 2-minute expiry
userSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    this.otpType = this.email ? "email" : "phone";
    return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (enteredOTP) {
    if (!this.otp || !this.otpExpiry) {
        return { success: false, message: "OTP not found or expired." };
    }

    if (this.otp !== enteredOTP) {
        return { success: false, message: "Invalid OTP." };
    }

    if (this.otpExpiry < new Date()) {
        return { success: false, message: "OTP has expired." };
    }

    // OTP verified
    this.otp = undefined;
    this.otpExpiry = undefined;
    this.otpType = undefined;
    return { success: true };
};

// Check if user is verified
userSchema.methods.isVerified = function () {
    return !this.otp && !this.otpExpiry;
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
