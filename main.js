//imports
//import express
const express = require('express');
const app = express();


//import mongoose
const mongoose = require('mongoose');

//import session
const session = require('express-session');


//import dotenv
require('dotenv').config();

const flush = require('connect-flash');

//inisialisasi port dari .env namun jika tidak terhubung akan menggunakan port 4000
const PORT = process.env.PORT || 4000;

//import path
const path = require('path');

//import bcrypt
const bcrypt = require('bcrypt');

//JsonWebToken
const jwt = require('jsonwebtoken');



//cookie
const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser');
//imports end



// database Connection
// connection to dburl in env file
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true });
const db = mongoose.connection;

//if the connection error
db.on('error', (error)=>{
    console.log(error);
});
//if successfully connected
db.once('open', ()=>{
    console.log('connected to the Database');
})

//menampilkan img
app.use('/images', express.static(path.join(__dirname, 'images')));

//middlewares
app.use(express.urlencoded({ extended: false }));//digunakan untuk menghubungkan data dari html ke js
app.use(express.json());

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
// app.use(session({
//     secret: 'secret key',
//     cookie: {maxAge: 6000},
//     saveUninitialized: false,
//     resave: false
// }))
// app.use(flush());

// app.use((req,res,next)=>{
//     res.locals.message;
//     delete req.session.message;
//     next();
// })

//set view engine
app.set('view engine', 'ejs');

// //Routing to routes.js
app.use("/", require('./routes/routes'));
app.use('/auth', require('./routes/auth'));



//cookie
//send cookie
// app.get('/get-cookie', (req,res)=>{
//     // res.setHeader('Set-Cookie', 'newUser=true');

//     res.cookie('newUser', false);
//     res.cookie('isEmployee', true, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});

//     res.send('you got the cookies!')
// });

app.listen(PORT)
console.log(`webserver is running at port ${PORT}`);