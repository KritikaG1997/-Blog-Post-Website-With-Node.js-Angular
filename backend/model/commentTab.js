const mongoose = require('mongoose');

const Usercomment = new mongoose.Schema({
    
    UserId:{
        type:mongoose.Schema.Types.ObjectId, ref:'UserDetails'
    },
    PostId:{
        type:mongoose.Schema.Types.ObjectId, ref:'postsbyuser'
    },
    Comment: {
        type: String
    },
},
    {timestamps:true
});


//This  is table schema for storing comments   

let comments = mongoose.model('Usercomment', Usercomment);

module.exports = comments;