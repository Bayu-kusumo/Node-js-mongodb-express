const bcrypt = require('bcrypt');
const User = require('../models/users');
const session = require('express-session');
const express = require('express');
const app = express();
require('dotenv').config();

const existingUser = async(req,res)=>{
    const user = await User.findOne({name: req.body.name});
    return user
};


const confirmPass = async (password, confirmPassword) => {
    return password === confirmPassword;
};

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true
// }))

exports.register= ( async(req,res)=>{
        try {
            const passwordMatch = await confirmPass(req.body.password, req.body.passwordConfirm);
            const existing = await existingUser(req,res);
            if (existing){
                return res.send("Username is Already used, please use another Username");
            }
            if(!passwordMatch){
                return res.send('Password Does not match!!');
                }
            hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword
            });
            console.log(user);
            await user.save();
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }   );

    exports.login=(async(req,res)=>{
        try {
            const user = await User.findOne({name: req.body.name});
            if(!user){
                res.send("User Cannot be found");
            }
        
            const matchingPassword = await bcrypt.compare(req.body.password, user.password);

            if(matchingPassword){
                req.session.userid=user._id;
                res.redirect('/home');
                console.log(user._id);
            } else {
                res.send('Wrong Password');
            }
        } catch (error) {
        console.log(error);
        }
    })