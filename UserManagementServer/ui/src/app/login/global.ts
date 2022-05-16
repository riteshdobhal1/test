//Captcha Flags
const CaptchaFeature:boolean = true;
const MaxLoginAttemptForCaptcha = 4;
const QaTestingCaptcha = false; 

//constants
const QaCaptchaKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const DevCaptchaKey = '6LdkUZgUAAAAAEkHQAmoTX0nDq5v4BVKJHVt6fjq';
const sitekey = QaTestingCaptcha ? QaCaptchaKey: DevCaptchaKey;


//2FA Flags
const resendOtpTime = 30;
const resendAttemptLimit = 5;
const otpExpiryTime = "10 minutes";

//constants
const secondsInterval = 1000;
const successShowTime = 5000;
const resendAttempt = 0;

//Text Msg
const ResendLimitMsg = "You have exceeded the resend OTP limit."
const userDisabledMsg =  "You have reached the maximum login attempts.  Your account has been blocked for the next 24 hours.  An e-mail has been sent.  Try logging in after 24 hours or contact your administrator for further assistance."
const userDisbleMsgLogin = "You have reached the maximum login attempts.  Your account has been blocked for the next 24 hours.  An e-mail has been sent.  Try logging in after 24 hours or contact your administrator for further assistance."
const resendSuccessMsg = "Success! Your One-Time security code has been sent";




export { QaTestingCaptcha, QaCaptchaKey, DevCaptchaKey, CaptchaFeature, 
    MaxLoginAttemptForCaptcha, sitekey, resendOtpTime, resendAttempt, resendAttemptLimit, secondsInterval, successShowTime, otpExpiryTime, 
    ResendLimitMsg, userDisabledMsg, userDisbleMsgLogin, resendSuccessMsg }