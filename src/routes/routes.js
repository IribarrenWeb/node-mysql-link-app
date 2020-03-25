const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('index');
})

// router.get('/hola/:param',(req,res) => {
//     let param = req.params.param
//     res.send(param)
// })

module.exports = router