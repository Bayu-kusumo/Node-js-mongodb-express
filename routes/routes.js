//Imports
if (process.env.NODE_ENV !== "production") {
   require('dotenv') .config()
}
const express = require('express');
const router = express.Router();
const fs = require('fs');
const passport = require('passport');
const User =  require('../models/users');
const bcrypt = require('bcrypt');
const session = require('express-session');
//Imports END



//Functions
//Checking Authentication for update
function checkAuthenticated(req, res, next) {
    if (req.session.userid) {
        return next(); 
    }
    res.redirect('/'); 
}

//used for checking newest password
const checkProfilePassword = (async (req,res)=>{
    const id = req.session.userid;
    const user = await User.findById(id);
    const oldPass = user.password;

    const confirmOldPass =await bcrypt.hash(req.body.oldPassword);
    const newpass = req.body.password;
    const confirmNewPass= req.body.confirmPassword;

    const matchingPassword = await bcrypt.compare(confirmOldPass, oldPass);

    try {
        if (newpass != confirmNewPass && !matchingPassword){
            res.json({Message: "Password isnt correct!"});
        }
    } catch (error) {
        console.log(error);
    }
})
    
//Functions ENDS


//route

//login routes
router.get('/', (req,res)=>{
    res.render('login', {
        title: 'Login Page'
    });
});

// check user
router.post("/", async (req,res)=>{
    try {
        const user = await User.findOne({name: req.body.name});
        const username = await User.findOne({username: req.body.username});
        if(!user || !username){
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
//Login Ends


//Register

//Register page Routes
router.get('/register', (req,res)=>{
    res.render('register', {
        title: 'Register'
    })
});
//Register END


//Home Page

//To make a list of users in database
router.get('/home', async (req,res)=>{
    try {
        const users = await User.find().exec();
        const loggedInUser = await User.findById(req.session.userid);
        const nameUser = loggedInUser.name
        res.render('index', {
            title: 'Home Page',
            users: users,
            user: nameUser
        });
    } catch (error) {
        res.json({
            message: error
        });
        console.log(error);
    }
});
//Home Page END


//Profile

//Display User Profile
router.get('/profile',checkAuthenticated, async(req,res)=>{
    try {
        const loggedInUser = await User.findById(req.session.userid);
        const nameUser = loggedInUser.name;
        res.render('profile', {
            title: 'User Profile',
            user: nameUser,
            userdata: loggedInUser
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: error
        })
    }
})

//Update Profile
router.post('/updateProfile', checkAuthenticated, async(req,res)=>{
    let id = req.session.userid;
    let hashedPassword = '';
    try {
        const password = req.body.password;
        if (!password){
            checkProfilePassword
            const user = await User.findById(id);
            hashedPassword = user.password;
        } else {
            hashedPassword =await bcrypt.hash(req.body.password, 10);
        }
        await User.findByIdAndUpdate(id,{
                username: req.body.username,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                company: req.body.company,
                bio: req.body.bio,
                birthday: req.body.birthday,
                website: req.body.website,
                TwitterSocialLink: req.body.TwitterLink,
                FacebookSocialLink: req.body.FacebookLink,
                GoogleSocialLink: req.body.GoogleLink,
                LinkedInSocialLink: req.body.LinkedInLink,
                InstagramSocialLink: req.body.InstagramLink
            })
    res.redirect('/home');
    } catch (error) {
        res.redirect('/');
        console.log(error);
    }
})

//Profile END




//Add User

//Add User Redirect
router.get('/add', checkAuthenticated, async(req,res)=>{
    let id = req.session.userid;
    const user = await User.findById(id);
    res.render('add_user',{
        title: 'Add User',
        user: user.name
    });
});

//Save New User
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

//Add User END



//Update User 

//Route to update user
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

//Save updated User
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

//Update User END



// Delete User

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

//Delete User END



//Logout

//Destroying session from login
router.get('/logout', (req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error)
    }
})

//Logout END

//Export Modules
module.exports=router;