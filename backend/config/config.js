const mongoose = require('mongoose');
require('dotenv').config()
const mongoDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{           
        });
        console.log(`Mongodb Connected ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
}

module.exports = mongoDB;