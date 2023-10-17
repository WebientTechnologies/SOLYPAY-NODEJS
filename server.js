const express = require('express');
const { dbconnect } = require('./config/database');
const { config } = require("dotenv");
config();

const cloudinary = require('cloudinary');
cloudinary.v2.config({
    cloud_name : 'dyrmjjb6i',
    api_key:"993336669154165",
    api_secret:"rrkTzfYBq9DtDRv8lEBbn52kHY0"
})

const app = express();

app.use(express.json());
app.use(express.urlencoded(
    {
        extended:true
    }
    ));

dbconnect();

module.exports= app;