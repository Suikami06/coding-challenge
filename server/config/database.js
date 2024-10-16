const mongoose = require('mongoose');
require("dotenv").config();


exports.DbConnect = () => {

    mongoose.connect(process.env.DATABASE_URL,
        {
    
            useNewUrlParser:true,
            useUnifiedTopology:true,
    
        }
    )
    .then(()=>{
    
        console.log("database connection is successful");
    })
    .catch((err)=>{
    
    
        console.log("connection failed");
        console.error(err);
        process.exit(1);
        
    });


};

