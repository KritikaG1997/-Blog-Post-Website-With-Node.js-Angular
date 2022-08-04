const mongoose = require('mongoose');

const LikeDislike = new mongoose.Schema({
    
    UserId:{
        type:mongoose.Schema.Types.ObjectId, ref:'UserDetails'
    },
    PostId:{
        type:mongoose.Schema.Types.ObjectId, ref:'postsbyuser'
    },
    Like: {
        type: Number
    }
},
    {timestamps:true
});


//This  is table schema for storing comments

let likedislike = mongoose.model('LikeTab', LikeDislike);

module.exports = likedislike;