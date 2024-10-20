require('dotenv').config();
const mongoose = require('mongoose');

const ConnectToMongoDB = () => {
    mongoose.connect(process.env.MONGODBURL).then( () => {
        console.log("Connect to database successfully...");
    }).catch( (error) => {
        console.log(error);
    })
}

module.exports = ConnectToMongoDB;