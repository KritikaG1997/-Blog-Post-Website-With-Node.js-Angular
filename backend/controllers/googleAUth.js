// const { userDetailsById, signUp } = require("../controllers/signupAndLogin");
const User = require("../model/userTable");
const axios = require('axios');
const fs =  require("fs");
const jwt = require("jsonwebtoken");

exports.googleLogin = async (req, res) => {
    try {
        const user_info = req.user._json;
        // console.log(user_info)

        const userData = await User.findOne({ user_email: user_info.email });

        if (userData) {

            var token = jwt.sign({ Email:userData["user_email"],ID: userData["_id"] }, "loginToken", {
                expiresIn: '365d'
            });   


            res.cookie('token', token, {
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 24 * 356
            });

            res.redirect('http://localhost:4200/googleLogin');
   
        } else {

            axios.get(user_info.picture, { responseType: "stream" })
                .then (async(response) => {
                    const pic = response.data.pipe(fs.createWriteStream("uploads/todays_picture.png")).path

                    const infoOfUser = {
                        googleID: user_info.sub,
                        user_name: user_info.name,
                        user_email: user_info.email,
                        user_profilePic: pic,
                    };

                    let userModel =  new User(infoOfUser);   
                    console.log(userModel)  
                    await userModel.save();

                    res.redirect('http://localhost:4200/login');
                })
                .catch((error) => {
                    console.log(error);
                });  

        }

    } catch (err) {
        console.log(err);
    };

};


