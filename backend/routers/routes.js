const express = require("express");
const control = require("../controllers/signupAndLogin");
const contPost = require("../controllers/posts");
const likeComment = require("../controllers/LikeAndComment");
const changePassword = require("../controllers/forgetpassword");
const route = express.Router();
const multerFile = require("../controllers/multerFile");
const Middleware = require("../Middleware/Auth");
const postAllDetails = require("../controllers/getAllPostDetails");
const otpToken = require("../Middleware/otptokenvalid");
const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const clientId = "793944497120-afajjr6cerjgvm2hrvlc0m6eihho5i0r.apps.googleusercontent.com"
const clientKey = "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";
const  { googleLogin } = require("../controllers/googleAUth");

route.use(passport.initialize());

route.post("/signup", multerFile.single('testimage'), control.signUp);

route.post("/login", control.login);

route.post("/forgetpassword", changePassword.forgetpassword);

route.post("/otpverification", otpToken, changePassword.otpverification);   

route.post("/createPost", multerFile.single('testimage'), Middleware, contPost.createPost);

route.get("/likePost/:id",Middleware, likeComment.likePost); 
 
route.post("/Comment/:id", Middleware,likeComment.Comment);

route.delete("/deleteComment/:id", Middleware, likeComment.deleteComment);

route.put("/editPost/:id", Middleware, multerFile.single('testimage'), contPost.editPost);

route.delete("/deletePost/:id", Middleware, contPost.deletePost);

route.get("/usersPosts", postAllDetails.usersPosts);

route.get("/userComments/:id", likeComment.userComments);

route.get("/postList/:id",contPost.postList);

route.get("/usersList",control.usersList);

route.put("/editProfile/:id",multerFile.single('testimage'), Middleware,control.editProfile);

route.get("/specificUser",Middleware,control.specificUser);

route.delete("/userDelete/:id",Middleware,control.userDelete);

route.get("/specificUserPost/:id",Middleware,contPost.specificUserPost);

route.get("/userSearch",control.userSearch);

route.get("/postSearch",contPost.postSearch);

route.post("/ChangePassword",Middleware,control.ChangePassword);

passport.use(
    new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientKey,
        callbackURL: '/auth/google/callback'
        
    },
    (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        return done(null, profile)
    })
);

route.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
    })
);

route.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/failed" }),
	googleLogin
);


route.get("/failed", (req, res) => {
    res.send("Failed")
})

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

module.exports = route;