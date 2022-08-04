const commentTable = require("../model/commentTab");
const User = require("../model/userTable")
const usersPost = require("../model/postTable");
const LikeSchema = require("../model/LikesSchema");

// In this we are allowing to user do comment on his/her post on their faivorte post 

exports.likePost = async (req, res) => {
    try {

        var userDetails = await User.findOne({ _id: req.user.ID });

        if (userDetails) {

            var postId = await usersPost.findOne({ _id: req.params.id });
            var user = await User.findOne({ _id: postId["UserId"] });

            if (postId) {

                var findUserId = await LikeSchema.find({ UserId: userDetails["_id"] });

                if (!findUserId) {

                    const userLike = {
                        UserId: userDetails["_id"],
                        PostId: postId["_id"],
                        Like: 1
                    };

                    const givingAmount = { walletAMount: userDetails["walletAMount"] - 10 }
                    const gotAmount = { walletAMount: user["walletAMount"] + 10 }

                    const like = { Like: postId["Like"] + 1 }

                    const options = { "upsert": false };

                    usersPost.updateOne(postId, like, options)
                        .then(result => {
                            console.log("post", result)
                        })
                        .catch((err) => {
                            console.log("oh !", err)
                        })
                    User.updateOne(userDetails, givingAmount, options)
                        .then(result => {
                            console.log("gave", result)
                        })
                        .catch((err) => {
                            console.log("not give!", err)
                        })
                    User.updateOne(user, gotAmount, options)
                        .then(result => {
                            console.log("got", result)
                        })
                        .catch((err) => {
                            console.log("not get!", err)
                        })
                    var likes = new LikeSchema(userLike);
                    await likes.save()
                    return res.status(200).send({
                        status: ` You Have liked this post`,
                        data: likes
                    });

                } else if (findUserId) {

                    var findPostId = 0;
                    for (let i = 0; i < findUserId.length; i++) {
                        if (findUserId[i]["PostId"] == req.params.id) {
                            findPostId = findUserId[i]["PostId"];
                        };

                    };
                    if (!findPostId) {

                        const userLike = {
                            UserId: userDetails["_id"],
                            PostId: postId["_id"],
                            Like: 1
                        };

                        var likes = new LikeSchema(userLike);
                        await likes.save()

                        const givingAmount = { walletAMount: userDetails["walletAMount"] - 10 }
                        const gotAmount = { walletAMount: user["walletAMount"] + 10 }

                        const like = { Like: postId["Like"] + 1 }

                        const options = { "upsert": false };

                        usersPost.updateOne(postId, like, options)
                            .then(result => {
                                console.log("post", result)
                            })
                            .catch((err) => {
                                console.log("oh !", err)
                            })
                        User.updateOne(userDetails, givingAmount, options)
                            .then(result => {
                                console.log("gave", result)
                            })
                            .catch((err) => {
                                console.log("not give!", err)
                            })
                        User.updateOne(user, gotAmount, options)
                            .then(result => {
                                console.log("got", result)
                            })
                            .catch((err) => {
                                console.log("not get!", err)
                            })
                        return res.status(200).send({
                            message: `You Have liked this post`
                        });
                    }
                    else {
                        return res.status(403).send({
                            message: `user have already liked this post`
                        });
                    }

                } else {

                    return res.status(403).send({
                        message: `You have already liked this post`
                    });
                };
            }
            else {
                return res.status(404).send({
                    message: "This Post Id is not exits"
                });
            };
        }
        else {
            return res.status(404).send({
                message: "user not Authorization"
            });
        };
    }
    catch (err) {
        res.status(400).send({
            message: "something went wrong",
            error: err
        })

    }
};

exports.Comment = async (req, res) => {
    
    try {

        var userDetails = await User.findOne({ _id: req.user.ID });

        if (userDetails) {

            var wordCount = req.body.comment.match(/(\w+)/g).length;

            if (wordCount <= 100) {

                var searchId = await usersPost.findOne({ _id: req.params.id });
                var user = await User.findOne({ _id: searchId["UserId"] });

                if (searchId) {

                    var commentCount = searchId["Comment"] + 1;

                    var userComment = {
                        UserId: userDetails["_id"],
                        PostId: searchId["_id"],
                        Comment: req.body.comment
                    };
                    var comments = new commentTable(userComment);
                    await comments.save()
                    searchId.Comment = commentCount;
                    searchId.save()

                    givingAmount = { walletAMount: userDetails["walletAMount"] - 15 }

                    gotAmount = { walletAMount: user["walletAMount"] + 15 }
                    const options = { "upsert": false };

                    User.updateOne(userDetails, givingAmount, options)
                        .then(result => {
                            console.log("gave", result)
                        })
                        .catch((err) => {
                            console.log("not give!", err)
                        })
                    User.updateOne(user, gotAmount, options)
                        .then(result => {
                            console.log("got", result)
                        })
                        .catch((err) => {
                            console.log("not get!", err)
                        })

                    return res.status(200).send({
                        message: "you commented"
                    });
                }
                else {
                    return res.status(401).send({
                        message: "id not founded please enter right id"
                    });
                };
            }
            else {
                return res.status(411).send({
                    message: "comment should be less than or equal to 100 words"
                });
            };
        }
        else {
            return res.status(530).send({
                message: "user not Authorization"
            });
        };
    }
    catch (err) {
        res.status(400).send({
            message: "something wrong",
            error: err
        })
    }
};
// // If user want to delete the comment which he did so he can by this api

exports.deleteComment = async (req, res) => {

    try {
        // console.log(req.user.ID)
        var commitId = await commentTable.findOne({ _id: req.params.id });
        // console.log("...............................commitId")
        if (commitId["UserId"] == req.user.ID) {
            // console.log("rtyuio")
            var searchId = await usersPost.findOne({ _id: commitId["PostId"] });
            // console.log(searchId)  
            commentTable.deleteOne(commitId, function (err, result) {
                console.log(searchId)
                if (err) throw err;
                if (result != 0) {
                    var deleteCount = searchId["Comment"] - 1;
                    commentCount = { Comment: deleteCount };

                    const options = { "upsert": false };

                    usersPost.updateOne(searchId, commentCount, options)
                        .then(result => {
                            console.log("post", result)
                        })
                        .catch((err) => {
                            console.log("oh !", err)
                        })
                    return res.status(200).send({
                        message: "comment has deleted"
                    });
                }
                else {
                    return res.status(401).
                        send({
                            message: "Account has not deleted.."
                        });
                };
            })

        } else {
            return res.status(409).send({
                message: "sorry Who did this comment only that user can delete it.."
            });
        };

    }
    catch (err) {
        res.status(400).send({
            message: "soething went wrong"
        })
    }
};

exports.userComments = async (req, res) => {

    await commentTable.find({ PostId: req.params.id }).populate("UserId").exec((err, result) => {
        if (err) {

            return res.send("data is not there");
        }
        else {
            return res.send(result);
        };
    });
};
