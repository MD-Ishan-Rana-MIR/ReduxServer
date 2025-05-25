const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ishanrana094@gmail.com',
    pass: 'wihm ltib egbe hgdn'
  }
});

/**
 * Send OTP to email using nodemailer
 * @param {Object} param0 
 * @param {string} param0.otp - The OTP code
 * @param {string} param0.email - Recipient email
 * @param {string} param0.name - Recipient name
 * @returns {Promise<Object>}
 */
const sendEmailOTP = async ( otp, email, name )=> {
  try {
    const mailOptions = {
      from: {
        name: 'Your App Name',
        address: 'ishanrana094@gmail.com'
      },
      to: email,
      subject: 'Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Account Verification</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid #007bff;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              Thank you for signing up! Please use the verification code below to complete your account setup.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #007bff; color: white; font-size: 32px; font-weight: bold; padding: 15px 25px; border-radius: 8px; letter-spacing: 8px; display: inline-block;">
                ${otp}
              </div>
            </div>
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⏰ <strong>Important:</strong> This code expires in <strong>2 minutes</strong>. Please enter it quickly to verify your account.
              </p>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              If you didn't request this verification code, please ignore this email or contact our support team.
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      `,
      text: `
        Hi ${name},
        
        Thank you for signing up! Your verification code is: ${otp}
        
        This code expires in 2 minutes. Please enter it quickly to verify your account.
        
        If you didn't request this verification code, please ignore this email.
        
        ---
        This is an automated message, please do not reply.
      `
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Email OTP sent successfully',
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Error sending email OTP:', error);

    return {
      success: false,
      message: 'Failed to send email OTP',
      error: error.message
    };
  }
}



module.exports = sendEmailOTP