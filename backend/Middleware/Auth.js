const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    // console.log("45678")
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    // console.log(authHeader);
    if (authHeader) {
        // sliceToken = authHeader.slice(13, authHeader.length - 9)
        // console.log(sliceToken)
        jwt.verify(authHeader, "loginToken", (err, user) => {
            if (err) {
                res.status(404).send({
                    message:"Sorry! You are not able to do this before login.." 
                })
            }
            else {
                
                req.user = user;
                // console.log(user)
                next()
            };
        });
    } else {
        return res.status(530).send("User Not Recognized...");
    };
};

/* this our middleware function in this we are verifying the token which we have created while login 
 this middleware we are using for authonticate the user is right or wrong*/
