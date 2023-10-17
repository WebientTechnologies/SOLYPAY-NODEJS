const express = require('express');
const { dbconnect } = require('./config/database');
const { config } = require("dotenv");
config();


const app = express();

app.use(express.json());
app.use(express.urlencoded(
    {
        extended:true
    }
    ));

dbconnect();

module.exports= app;