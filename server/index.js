const express = require('express');
const app = express();
const {DbConnect} = require("./config/database");
const transactionRoutes = require("./routes/transactions")
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
var cors = require("cors");

app.use(
    cors(
        {
            origin: "*",
        }
    )
);

app.use('/api/v1',transactionRoutes);

app.listen(PORT,()=>{
    console.log(`app is listening at port no. ${PORT}`)
});

DbConnect();





