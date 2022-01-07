const express = require('express')
const mongoose = require('mongoose');
const url = 'mongodb://localhost/userData';
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')



dotenv.config({ path: './config.env'})
//start express
const app = express() 

//connection with database
mongoose.connect(url, { useNewUrlParser: true })
const con = mongoose.connection

//create connection
con.on('open', () => {
    console.log(' server connected..')
})

//middleware
app.use(express.json()) 

//Pssing Cookie 
app.use(cookieParser())

//create Route
const employeeesRouter = require('./routes/employees')
app.use('/', employeeesRouter);

//server listen
app.listen(5001, () => { 
console.log('we are live on port 4007')
})