const express = require("express");
const User = require("../model/userTable");
const fs = require("fs")
const bcrypt = require("bcrypt");
const commentTable = require("../model/commentTab");
const LikeSchema = require("../model/LikesSchema");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const companyWallet = require("../model/companyWallet");
const usersPost = require("../model/postTable");

const saltRounds = 10;
const app = express();

app.use(cookie())
app.use(express.json());

exports.signUp = async (req, res) => {
    // console.log("234567890")
    try {
        // console.log(req.body)
        companyBalance = await companyWallet.findOne()
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.user_email)) {
            User.findOne({ user_email: req.body.user_email }).exec(async (err, user) => {
                if (user) {
                    return res.status(401).send({ status: "error", message: "User is already exits with this email address", error: err })
                };
                var gender = req.body.user_gender.toLowerCase();
                var role = req.body.role.toLowerCase();

                if (req.body.user_password.match(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,12})"))) {
                    if (req.body.user_password.length >= 8 && req.body.user_password.length <= 12) {
                        if (req.body.user_password === req.body.confirm_password) {
                            var Payload = {
                                user_name: req.body.user_name,
                                user_email: req.body.user_email,
                                user_gender: gender,
                                role: role,
                                user_profilePic: req.file.path,
                                user_location: req.body.user_location,
                                user_password: await bcrypt.hash(req.body.user_password, saltRounds),
                                walletAMount: 10,

                            };
                            let userModel = new User(Payload);
                            await userModel.save()
                            companyBalance.balance = companyBalance["balance"] - 10
                            companyBalance.save()
                            return res.status(201).send({
                                message: "Your account has created.....",
                            });

                        } else {
                            return res.status(401).send({
                                message: "confirm password is not matched....."
                            });
                        };

                    } else {
                        console.log("special")
                        return res.status(401).send({
                            message: "password length should be minimum 8 or maximum 12"
                        })
                    }


                } else {
                    console.log("special")
                    return res.status(401).send({
                        message: "password should have([@,#,$,&],[0-9],[A-z].....)"
                    })
                };

            });
        }
        else {
            return res.status(401).send({
                message: "this email address is not valid...."
            });
        };
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
};

exports.login = async (req, res) => {
    try {
        var userDetails = await User.findOne({ user_email: req.body.user_email });
        // console.log(userDetails)

        if (userDetails) {
            bcrypt.compare(req.body.user_password, userDetails["user_password"], (err, data) => {

                if (data) {

                    var token = jwt.sign({ Email: userDetails["user_email"], ID: userDetails["_id"] }, "loginToken", {

                        expiresIn: '365d'
                    });
                    return res.status(200).cookie("token", token).send({
                        message: "you login successfully....",
                        cookie: token,
                        user_role: userDetails["role"]
                    });

                } else {
                    return res.status(563).send
                        ({ message: "Password dosen't matched..." });
                };

            });
        } else {
            return res.status(530).send({
                message: "This Email is not exits",
            });
        };
    }
    catch (error) {
        return res.status(401).send({
            message: "something went wrong...."
        });
    };
};

exports.usersList = async (req, res) => {
    // console.log(req.query)
    try {
        let { page, limit } = req.query
        // console.log(page,"fhsdhfd",limit)
        User
            .find({})
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .exec((err, users) => {
                // console.log(products)
                User.count().exec(function (err, count) {
                    // console.log(count)
                    if (err) return next(err)
                    return res.status(200).send({
                        data: users,
                        total: count,

                    });
                });
            });
    }
    catch (err) {
        return res.status(400).send(err);
    };
};

exports.specificUser = async (req, res) => {
    try {
        // console.log(req.user)
        let userDetails = await User.findOne({ _id: req.user.ID });

        if (userDetails) {

            return res.status(200).send({
                data: userDetails,
                message: "userDetails",
            });
        }
        else {
            return res.status(530).send({
                message: "user not founded"
            })
        };
    }
    catch (err) {
        res.status(400).send(err);
    };
};

exports.userDelete = async (req, res) => {
    try {
        var userDetails = await User.findOne({ _id: req.user.ID });

        if (userDetails["_id"] == req.params.id) {
            var userAllPosts = await usersPost.find({ UserId: req.params.id });

            if (userDetails["googleID"] == "") {
                var ProfilePath = userDetails["user_profilePic"];
                console.log(ProfilePath, "rtyui")
                fs.unlinkSync(ProfilePath)
            }
            if (userAllPosts) {
                for (let i of userAllPosts) {

                    PicturePath = i["Picture"]
                    fs.unlinkSync(PicturePath)
                    var allComments = await commentTable.find({ PostId: i["_id"] });
                    var allLikes = await LikeSchema.find({ PostId: i["_id"] });
                    for (let j of allComments) {
                        commentTable.deleteOne(j, function (err) {
                            if (err) throw err;
                            console.log("comments")
                        });
                    }

                    for (let k of allLikes) {
                        LikeSchema.deleteOne(k, function (err) {
                            if (err) throw err;
                            console.log("likes")
                        });
                    }

                    usersPost.deleteOne(i, function (err) {
                        if (err) throw err;
                        console.log("done")
                    });
                };
            }

            userDetails.deleteOne(userDetails, function (err, result) {

                if (err) throw err;
                if (result != 0) {
                    return res.status(200).send({

                        message: "Your Account Has Deleted.."
                    });
                }
                else {
                    return res.status(401).
                        send({
                            message: "Account has not deleted.."
                        });
                };

            });
        }
        else if (userDetails["role"] == "admin") {
            var userData = await User.findOne({ _id: req.params.id });
            // console.log(userData)
            var userAllPosts = await usersPost.find({ UserId: req.params.id });

            if (userDetails["googleID"] == "") {
                var ProfilePath = userData["user_profilePic"];
                // console.log(ProfilePath)
                fs.unlinkSync(ProfilePath)
            }
            if (userAllPosts) {
                for (let i of userAllPosts) {

                    PicturePath = i["Picture"]
                    fs.unlinkSync(PicturePath)
                    var allComments = await commentTable.find({ PostId: i["_id"] });
                    var allLikes = await LikeSchema.find({ PostId: i["_id"] });
                    for (let j of allComments) {
                        commentTable.deleteOne(j, function (err) {
                            if (err) throw err;
                            console.log("comments")
                        });
                    }

                    for (let k of allLikes) {
                        LikeSchema.deleteOne(k, function (err) {
                            if (err) throw err;
                            console.log("likes")
                        });
                    }
                    usersPost.deleteOne(i, function (err) {
                        if (err) throw err;
                        console.log("done")
                    })
                };
            }
            userData.deleteOne(userData, function (err, result) {
                if (err) throw err;
                if (result != 0) {
                    return res.status(200).send({

                        message: "Your Account Has Deleted.."
                    });
                }
                else {
                    return res.status(401).
                        send({
                            message: "Account has not deleted.."
                        });
                };
            });
        }
        else {
            return res.status(563).send({
                message: "sorry you can not delete this account only Admin can..."
            });
        };
    }
    catch (err) {
        console.log(err)
        res.status(400).send({
            message: "something went wrong"
        });
    };
}

exports.editProfile = async (req, res) => {

    try {

        var findUser = await User.findOne({ _id: req.user.ID });

        if (findUser["_id"] == req.params.id) {
            var gender = req.body.user_gender.toLowerCase();

            var PicturePath = findUser["user_profilePic"];
            // console.log(PicturePath)
            fs.unlinkSync(PicturePath)

            var Payload = {
                user_name: req.body.user_name,
                user_gender: gender,
                user_profilePic: req.file.path,
                user_location: req.body.user_location
            };

            const options = { "upsert": false };
            User.updateOne(findUser, Payload, options)
                .then(result => {
                    const { matchedCount, modifiedCount } = result;
                    if (matchedCount && modifiedCount) {
                        return res.status(200).send({ message: `Successfully updated the item.` })
                    }
                })
                .catch((err) => {
                    return res.status(401).send
                        ({ message: `Failed to update the item:${err}` })
                });
        }
        else {
            res.status(563).send({
                message: "You can not Edit this account only admin can"
            })
        }

    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

exports.userSearch = async (req, res) => {
    const searchQuery = req.query.name;
    // console.log(searchQuery)
    User.find({ user_name: { '$regex': searchQuery, '$options': 'ig' } })
        .then((data) => {

            res.send(data)
        }).
        catch((err) => {
            // console.log("kritika it is a error")
            res.send(err)
        })
}

exports.ChangePassword = async (req, res) => {
    try {
        var findUser = await User.findOne({ _id: req.user.ID });

        bcrypt.compare(req.body.oldPassword, findUser["user_password"], async (err, data) => {
            if (data) {
                if (req.body.user_password.match(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,12})"))) {
                    if (req.body.user_password.length >= 8 && req.body.user_password.length <= 12) {

                        if (req.body.user_password === req.body.confirm_password) {

                            const payload = {
                                user_password: await bcrypt.hash(req.body.user_password, saltRounds),
                            }
                            // console.log(payload)
                            const options = { "upsert": false };
                            User.updateOne(findUser, payload, options)    
                                .then(result => {
                                    const { matchedCount, modifiedCount } = result;
                                    if (matchedCount && modifiedCount) {
                                        return res.status(200).send({ message: "You Password has been changed successfully" })
                                    }
                                })
                                .catch((err) => {
                                    return res.status(401).send
                                        ({ message: `Failed to update the item:${err}` })
                                })
                        } else {
                            return res.status(401).send({
                                message: "confirm password is not same....."
                            });
                        };

                    } else {
                        return res.status(401).send({
                            message: "password length should be minimum 8 or maximum 12"
                        })
                    }


                } else {
                    return res.status(401).send({
                        message: "password should have([@,#,$,&],[0-9],[A-z].....)"
                    })
                };
            }
            else {
                return res.status(401).send({
                    message: "Please enter correct Current password.."
                })
            }

        })

    }
    catch (err) {
        return res.status(530).send({ message: err.message })
    }
}