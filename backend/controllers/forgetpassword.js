const express = require("express");
const User = require("../model/userTable");
const otp = require("../model/otpTable"); 
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
app.use(cookie());   
app.use(express.json());

  
exports.forgetpassword = async (req, res) => {
    console.log(req.body)
    try {
        var userDetails = await User.findOne({ user_email: req.body.user_email });   
        if (userDetails) {
            // console.log(userDetails)
            var otpCode = Math.floor(1000 + Math.random() * 9000);  
            const otpData = new otp({ 
                email: req.body.user_email,
                code: otpCode,
                expireIn: new Date().getTime() + 300 * 1000
            });
            
            await otpData.save()
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'kritika19@navgurukul.org',
                    pass: 'lovekrishna'
                }
            });

            transporter.sendMail({
                to: req.body.user_email,
                from: 'kritika19@navgurukul.org',
                subject: 'your one Time password',
                text: `${otpCode}`
            });
            var token = jwt.sign({ Email: userDetails["user_email"], Id: userDetails["_id"] }, "userVerify", {

                expiresIn: '1h'
            });
            return res.cookie("validation", token).send({
                status: "token created",
                message: "OTP created successfully",
                cookie: token
            });


        } else {
            return res.status(530).send({
                message: "User is not exits with this email id"
            });
        };
    }
    catch (err) {
        res.status(400).send(err)
    }
};

exports.otpverification = async (req, res) => {

    try {
        const userData = await otp.findOne({ _id: req.userVerify.Id } && { code: req.body.otp });
        console.log(userData)
        
        if (userData) {

            let currentTime = new Date().getTime();
            let timeLimit = userData["expireIn"] - currentTime;

            if (timeLimit < 0) {
                return res.status(400).send({
                    message: "OTP is expired"
                });
            }
            else {
                let user = await User.findOne({ user_email: req.userVerify.Email });
                let password = req.body.password;
                let reConfirm = req.body.reConfirm;

                if (password.match(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))) {
                    if (password === reConfirm) {

                        var haspassword = await bcrypt.hash(password, saltRounds);
                        // console.log(haspassword)
                        user.user_password = haspassword
                        user.save();
                        return res.status(200).send({
                            message: "Your password has been changed successfully"
                        });
                    }
                    else {
                        return res.status(563).send({
                            message: "both password are not same"
                        })
                    };

                }
                else {
                    return res.status(400).send({
                        message: "password shoul have [0-9],[@,$,#],[A-z]"
                    });
                };

            };
        }
        else {
            return res.status(402).send({
                message: "otp is invalid"
            });
        };
    }
    catch (err) {
        res.status(400).send(err)
    }

};
