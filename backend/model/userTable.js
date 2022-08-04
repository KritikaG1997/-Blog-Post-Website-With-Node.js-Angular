const mongoose = require('mongoose');

const userData = new mongoose.Schema({
    googleID:{
        type:Number,
        default: 0
    },
    user_name:{
        type: String,
        required: true
    },
    user_email:{
        type: String,
        required: true
    },
    user_gender:{
        type: String,
        
    },
    user_profilePic:{
        type: String  
      },
    user_location:{
        type:String,
        default:"India"
    },
    user_password:{
        type: String,
       
    },
    walletAMount:{
        type: Number,
        default: 10
    },
    role:{
        type:String,
    }

},
    {timestamps:true
});

const postdata = mongoose.model('UserDetails',userData);


module.exports = postdata;


// table schema for storing the user data while signup in database