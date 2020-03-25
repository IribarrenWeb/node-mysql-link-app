const {format} = require('timeago.js');
const {baseUrl} = require('../keys');
const bcrypt = require('bcryptjs');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp)
}

helpers.hash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const phash = await bcrypt.hash(password,salt);

    return phash; 
}

helpers.match = async (password, phash) => {
    try {
        return await bcrypt.compare(password,phash);
    } catch (error) {
        console.log(error)        
    }
}

helpers.isLogin = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect(baseUrl + 'login');
}

helpers.notLogin = (req,res,next) => {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect(baseUrl + 'profile');
}

helpers.baseUrl = baseUrl;

module.exports = helpers;