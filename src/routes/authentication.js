const express = require('express');
const router = express.Router();
const passport = require('../lib/passport');
const {baseUrl} = require('../keys');
const {isLogin, notLogin} = require('../lib/helpers');


router.get('/signup',notLogin,(req,res) => {
    let nameform = 'Signup',
    signup = true,
    textbutton = 'Get register'
    res.render('auth/form',{nameform,signup,textbutton});
})

router.post('/signup',notLogin,passport.authenticate('locale',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true  
}))

router.get('/profile',isLogin,(req,res)=>{
    res.render('profile');
})

router.get('/login',notLogin, (req,res) => {
    let nameform = 'Login',
    signup = false,
    textbutton = 'Get in'
    res.render('auth/form',{nameform,signup,textbutton});
})

router.post('/login',notLogin, async (req,res, next) => {
    passport.authenticate('locale.login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
})

router.get('/logout',isLogin ,(req,res) => {
    req.logOut();
    res.redirect(baseUrl + 'login')
})

module.exports = router;