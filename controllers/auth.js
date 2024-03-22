const bcrypt = require('bcrypt');
const User = require('../models/users');

const existingUser = async(req,res)=>{
    const user = await User.findOne({name: req.body.name});
    return user
};


const confirmPass = async (password, confirmPassword) => {
    return password === confirmPassword;
};


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