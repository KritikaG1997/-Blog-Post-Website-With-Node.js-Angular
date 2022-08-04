const express = require("express");
const User = require("../model/userTable")
const usersPost = require("../model/postTable");
const commentTable = require("../model/commentTab");
const LikeSchema = require("../model/LikesSchema");
const company = require("../model/companyWallet");
const fs = require("fs");
const app = express();
app.use(express.json());

// In this API we are creating our post which user want to create after login only user can create it.

exports.createPost = async (req, res) => {

    try {
    //    console.log(req.user)
        companyBalance = await company.findOne()

        var userDetails = await User.findOne({ _id: req.user.ID });
        // if (userDetails["role"]=="admin") return res.send('admin can not create post!..')
        if (userDetails) {

            var wordCount = req.body.Blog.match(/(\w+)/g).length;
            if (wordCount <= 200) {
                const postData = {
                    UserId: userDetails["_id"], 
                    Title: req.body.Title,
                    Blog: req.body.Blog,
                    Picture: req.file.path,
                    Like: 0,  
                    Comment: 0
                };

                const userAmount = { walletAMount: userDetails["walletAMount"] - 5 }
                // console.log(userAmount)
                const compBalance = { balance: companyBalance["balance"] + 5 }
                // console.log(compBalance)
                const options = { "upsert": false };
                company.updateOne(companyBalance, compBalance, options)
                    .then(result => {
                        console.log("wallet", result)
                    })
                    .catch((err) => {
                        console.log("oh wallet!", err)
                    })
                User.updateOne(userDetails, userAmount, options)
                    .then(result => {
                        console.log(result)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                let data = new usersPost(postData);
                await data.save();

                return res.status(201).send({
                    message: "Post created successfully...."
                });
            }
            else {
                return res.status(411).send({
                    message: "Blog size should be equal 200 or less than 200...."
                });
            };
        } else {
            return res.status(530).send({
                message: "user not Authorization"
            });

        }
    }
    catch (err) {
        console.log(err)
    };

};

// With this API user can see all post without login or signup

exports.postList = async (req, res) => {
    // console.log(req.params)
    try {
        await usersPost.find({ _id: req.params.id }).populate("UserId").exec((err, result) => {
            if (err) {

                return res.send("data is not there");
            }
            else {
                return res.send(result);
            };
        });
    }
    catch (err) {
        console.log(err)
    };
}

exports.specificUserPost = async (req, res) => {
    try {
        var userDetails = await usersPost.find({ UserId: req.user.ID })

        if (userDetails) {

            return res.status(200).send({
                message: "userDetails",
                data: userDetails
            })
        }
        else {
            return res.status(530).send({
                message: "user not founded"
            })
        }
    }
    catch (err) {
        console.log(err)
    };

};

// Only Admin can update the post which he created

exports.editPost = async (req, res) => {

    try {
        console.log(req.params.id)
        console.log(req.body)
        if (!req.file) return res.send('File not uploaded')

        let user = await User.findOne({ _id: req.user.ID });
        // console.log(user,"23456789asdfghjkzxcvbnm")
        if (user["role"]=="admin") return res.send("admin can not edit this post only post's admin can !..")
        let userData = await usersPost.findOne({ _id: req.params.id });
        // console.log(userData)
        if (userData["UserId"] == req.user.ID && user["role"] !== "admin") {

            PicturePath = userData["Picture"]
            fs.unlinkSync(PicturePath) 

            const payload =
            {
                Blog: req.body.Blog,
                Picture: req.file.path
            }
            console.log(payload)

            const options = { "upsert": false };

            usersPost.updateOne(userData, payload, options)
                .then(result => {
                    console.log("wallet", result)
                })
                .catch((err) => {
                    console.log("oh wallet!", err)
                })

            return res.status(200).send({
                message: "success",
                data: userData
            });

        }
        else {
            return res.status(530).send({
                message: "Only Admin Can Edit The Post"
            });
        };
    }
    catch (err) {
        console.log(err)
    };
};

//In this post's admin only can delete the post
  
exports.deletePost = async (req, res) => {

    try {
        
        var user = await User.findOne({ _id: req.user.ID });
       
        var userDetails = await usersPost.findOne({ _id: req.params.id });
        
        // console.log(userDetails)
        if (userDetails["UserId"] == req.user.ID) {
            // console.log("67890")
            PicturePath = userDetails["Picture"]
            fs.unlinkSync(PicturePath)
            var allComments = await commentTable.find({ PostId: userDetails["_id"] });
            var allLikes = await LikeSchema.find({ PostId: userDetails["_id"] });

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

            usersPost.deleteOne(userDetails, function (err, result) {
                if (err) throw err;
                if (result != 0) {
                    console.log("done")
                    return res.status(200).send({
                        message: "Your Post Has Deleted.."  
                    });
                }
                else {
                    return res.status(204).
                        send({
                            message: "document has not deleted"
                        });
                };
            });
        }
        else if (user["role"] == "admin") {
           
            PicturePath = userDetails["Picture"]
            fs.unlinkSync(PicturePath)
            var allComments = await commentTable.find({ PostId: userDetails["_id"] });
            var allLikes = await LikeSchema.find({ PostId: userDetails["_id"] });
           
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

            usersPost.deleteOne(userDetails, function (err, result) {
                if (err) throw err;
                if (result != 0) {

                    return res.status(200).send({
                        message: "Your Post Has Deleted.."
                    });
                }
                else {
                    return res.status(204).
                        send({
                            message: "document has not deleted"
                        });
                };
            });
        }
        else {

            return res.status(530).send({
                message: "Only Admin Can Delete The Post"
            });
        };
    }
    catch (err) {
        res.status(400).send({
            message: "soething went wrong",
            error:err
        });
    };
};

exports.postSearch = async (req, res) => {
    try {
        const searchQuery = req.query.title;

        if (req.query.title == '') {
            await usersPost.find().then((result) => {
                return res.send(result);
            })
                .catch((err) => {
                    return res.send(err);
                });
        }
        usersPost.find({ Title: { $regex: searchQuery, $options: '$i' } })
            .then((data) => {
                // console.log(data)
                return res.send(data)
            }).
            catch((err) => {
                // console.log("kritika it is a error")
                return res.send(err)
            })
    }
    catch (err) {
        res.status(400).send({
            message: "soething went wrong"
        });
    };
}


