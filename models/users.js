const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    created:{
        type: Date,
        required: true,
        default: Date.now
    },
    username: {
        type: String,
        required: false
    },
    company:{
        type: String,
        required: false
    },
    bio:{
        type: String,
        required: false
    },
    birthday:{
        type: Date,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    TwitterSocialLink:{
        type: String,
        required: false
    },
    FacebookSocialLink:{
        type: String,
        required: false
    },
    GoogleSocialLink:{
        type: String,
        required: false
    },
    LinkedInSocialLink:{
        type: String,
        required: false
    },
    InstagramSocialLink:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);