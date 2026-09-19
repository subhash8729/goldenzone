const config = require('../config/env');

class OtpService {
  /**
   * Send OTP to customer/admin mobile number.
   * In this demo environment, it validates format and logs the DEV_OTP.
   * Easily replaceable with Twilio, MSG91, or Fast2SMS SDK calls in production.
   */
  async sendOtp(mobileNumber) {
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber.replace(/^\+91/, '').trim())) {
      throw new Error('Invalid mobile number format. Please provide a 10-digit number.');
    }

    const devOtp = config.devOtp || '987654';
    console.log(`📱 [OTP Service] Demo OTP for ${mobileNumber}: [${devOtp}]`);

    return {
      success: true,
      message: `OTP sent successfully to ${mobileNumber}`,
      demoNote: 'DEMO MODE: Use OTP 987654'
    };
  }

  /**
   * Verify provided OTP.
   * Compares against configured DEV_OTP.
   */
  async verifyOtp(mobileNumber, otp) {
    if (!mobileNumber || !otp) {
      return { success: false, message: 'Mobile number and OTP are required' };
    }

    const devOtp = String(config.devOtp || '987654').trim();
    const providedOtp = String(otp).trim();

    if (providedOtp !== devOtp) {
      return { success: false, message: 'Invalid OTP. Please enter the correct 6-digit code.' };
    }

    return { success: true, message: 'OTP verified successfully' };
  }
}

module.exports = new OtpService();
