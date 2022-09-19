const mongoose = require('mongoose');


const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI,{

    }).then(con =>{
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    }).catch((err)=>console.log(err))
}

module.exports = connectDatabase