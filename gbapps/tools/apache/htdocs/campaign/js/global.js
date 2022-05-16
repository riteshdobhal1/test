angular.module('gbCampaignApp.globalservices', [])
.factory('GlobalService', ['$http', '$location',
    function($http, $location) {
        return {
            adminEmail : '',
            UMSDOMAIN : '',
            LOGIN_URL : '',

            mainTitle : "Register for Free Glassbeam Analytics Product Trial",
            INVALIDEMAIL : "Please enter valid email.",
            MINLENPASSWORD : "Password should be minimum four character long.",
            REGISTRATIONSUCCESS : "<h3>You have been successfully registered.</h3><br>"+
                                    " As a final step, we have sent a verification mail to your E-mail ID <a class='gb-link-smallest'>$$</a>.<br>"+
                                    " Please click on the verification link in that E-mail to complete the registration process.<br>"+
                                    "<i class='gb-font-smallest'> Check your spam folder in case you don't see a mail from us in the next few minutes.</i>",
            PASSWORDMISSMATCH : "Password not matching!",
            PAGE_TITLE : "Register for Free Glassbeam Analytics Product Trial",
            CONTACTADMIN : "Unable to create user. Please contact <a class='gb-link-smallest' href='mailto:$#$adminEmail$#$'>$#$adminEmail$#$</a>",

            INVALIDTOKEN : "<h3>Looks like the link you just used to verify is not valid.</h3><br>"+
                                    " Either the E-mail ID used to register is not the same as the E-mail ID in the verification link or<br>"+
                                    " the Token ID in the link has been tampered with.<br>"+
                                    " Please check your link again or contact <a class='gb-link-smallest' href='mailto:$#$adminEmail$#$'>Glassbeam Support</a>",

            USERVERIFIED : "<h3>Your account has been verified. Welcome to Glassbeam!</h3><br>" +
                                    "You will receive a welcome E-mail now with your access information and details to get started.<br>" +
                                    "You will be automatically redirected to our Login Page in 10 seconds.<br>"+
                                    " If you do not get redirected, <a class='gb-link-smallest' href='$#$LOGIN_URL$#$'>click here to Login</a>",

            USERVERIFIEDALREADY :  "You are already registered with us. You will be redirected to our <a class='gb-link-smallest' href='$#$LOGIN_URL$#$'> login </a>page",
            USERALREADYEXISTS : "<h3>You are already registered with us.</h3><br>"+
                                " You will be redirected to our <a class='gb-link-smallest' href='$#$LOGIN_URL$#$'> login </a>page",
            
            NOUSER : "<h3>Looks like the link you just used to verify is not valid.</h3><br>"+
                            " Either the E-mail ID used to register is not the same as the E-mail ID in the verification link or<br>"+
                            " the Token ID in the link has been tampered with.<br>"+
                            " Please check your link again or contact <a class='gb-link-smallest' href='mailto:$#$adminEmail$#$'>Glassbeam Support</a>",    
            
            OTHERERROR :  "System Error. Please contact <a class='gb-link-smallest' href='mailto:$#$adminEmail$#$'>$#$adminEmail$#$</a>",

            USERALREADYEXISTS_REG : "<h3>Looks like you are already Registered with Glassbeam.</h3><br>"+
                                    " Please click on the link below to login.<br>"+
                                    " If you have forgotten your password, click on the \"Forgot Password\" link after you click on Login",
            PROSPECTEXISTS_REG : "You are already registered user but you have not verfied your account.<br>"+
                            " To get the verification email again, please click ",
            REGENERATEDEMAIL : "<h3>You have been successfully registered.</h3><br>"+
                                    " As a final step, we have sent a verification mail to your E-mail ID <a class='gb-link-smallest'>$$</a>.<br>"+
                                    " Please click on the verification link in that E-mail to complete the registration process.<br>"+
                                    "<i class='gb-font-smallest'> Check your spam folder in case you don't see a mail from us in the next few minutes.</i>",

            getValue : function(key, value) {
                //replace other keys from the string
                //Get key
                var msg = this[key];
                if(!msg){
                    return this.getValue('OTHERERROR');
                }
                var userKeys = msg.match(/\$#\$(.*?)\$#\$/g);
                if(userKeys && userKeys.length > 0) {
                    for(var i=0;i < userKeys.length; i++){
                        var internalKey = userKeys[i].split('$#$').join('')
                        var internalValue = this[internalKey];
                        msg = msg.replace(userKeys[i], internalValue);
                    }
                }

                if(value){                    
                    msg = msg.replace("$$", value);
                    return msg;
                }
                return msg;
            },
            setValue : function(key, value) {
                if(key){
                    this[key] = value;
                }
                
            }
        }
    }
])
