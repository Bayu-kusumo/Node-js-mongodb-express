if (process.env.NODE_ENV !== "production") {
   require('dotenv') .config()
}


const express = require('express');
const router = express.Router();
const fs = require('fs');
const passport = require('passport');
const User =  require('../models/users');
const bcrypt = require('bcrypt');




//route

//login routes
router.get('/', (req,res)=>{
    res.render('login', {
        title: 'Login Page'
    });
});

//check user
router.post("/", async (req,res)=>{
    try {
        const user = await User.findOne({name: req.body.name});
        if(!user){
            res.send("User Cannot be found");
        }

        //matching password
        const matchingPassword = await bcrypt.compare(req.body.password, user.password);
        if(matchingPassword){
            res.redirect('/home');
        } else {
            res.send('Wrong Password');
        }
    } catch (error) {
    console.log(error);
    }
})


//Register page Routes
router.get('/register', (req,res)=>{
    res.render('register', {
        title: 'Register'
    })
});



//get all user
router.get('/home', async (req,res)=>{
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (error) {
        res.json({
            message: "Error"
        });
    }
});


//Post
//post redirect
router.get('/add', (req,res)=>{
    res.render('add_user',{
        title: 'Add User',
    });
});

router.post('/add', async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({       
        name: req.body.name,
        email: req.body.email,
        phone : req.body.phone,
        password: hashedPassword
    });
    await user.save();
    req.session.message = {
        type: 'success',
        message: 'User Succesfully Added'
    }
    } catch (error) {
     res.json({message: error.message})   ;
    }
    res.redirect('/home');
})



//routing edit
router.get('/edit/:id', async(req,res)=>{
    let id= req.params.id;
    const user = await User.findById(id);
    if (user==null){
        res.redirect('/home');
    } else {
        res.render('edit_user', {
            title: 'Edit User',
            user: user
        });
    }
});

router.post('/edit/:id', async(req,res)=>{
    let id = req.params.id.trim();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword
        });
        res.redirect('/home');
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})


//delete user
router.get('/delete/:id', async(req,res)=>{
    let id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
    } catch (error) {
        res.json({message: 'Delete users failed'});
    }
    res.redirect('/home');
})


module.exports=router;