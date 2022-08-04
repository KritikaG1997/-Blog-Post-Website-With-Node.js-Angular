const mongoose = require('mongoose');

const connection = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const uri = "mongodb+srv://kritika_gaur:kritika123@cluster0.oiiaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connect = mongoose.connect(uri, connection).then(() => {
    console.log("Database connected ");
}).catch((err) => {
    console.log("Database not connected ");
    console.log(err);
})

module.exports = connect;

//Our Database connection file