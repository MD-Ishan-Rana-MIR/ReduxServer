// Validation middleware for request data

/**
 * Validate registration request
 */
export const validateRegister = (req, res, next) => {
    const { name, email, phone_number, password } = req.body;

    // Validate required fields
    if (!name || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name and password are required'
        });
    }

    // Validate email or phone number
    if (!email && !phone_number) {
        return res.status(400).json({
            success: false,
            message: 'Either email or phone number is required'
        });
    }

    // Validate email format if provided
    if (email && !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Validate phone number format if provided
    if (phone_number && !isValidPhoneNumber(phone_number)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid phone number format'
        });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        });
    }

    next();
};

/**
 * Validate OTP verification request
 */
export const validateOTP = (req, res, next) => {
    const { userId, otp } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
        return res.status(400).json({
            success: false,
            message: 'OTP must be a 6-digit number'
        });
    }

    next();
};

/**
 * Validate OTP resend request
 */
export const validateResendOTP = (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    next();
};

// Helper functions
function isValidEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    return /^\+?[1-9]\d{1,14}$/.test(phoneNumber);
}

function isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}


