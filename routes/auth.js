const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth')

//post Register account

router.post('/register',authController.register);



module.exports=router;