const express = require('express');
const router = express.Router();
const db = require('../database');
const {baseUrl} = require('../keys');
// const {isLogin} = require('../lib/helpers');


/**
 * ADD VIEW AN METHOD ROUTES
 */
router.get('/add', (req,res) => {
    let nameform = 'Add a link',
    edit = false
    res.render('links/form',{nameform,edit});
})

router.post('/add', async (req,res) => {
    const {name,description,url} = req.body;

    const newLink = {
        name,
        description,
        url,
        user_id: req.user.id
    };  
    try {
        let response = await db.query('INSERT INTO links set ?',[newLink]);
        req.flash('success','Link created successfully');
        res.redirect(baseUrl + 'links');
    } catch (error) {
        res.send('fatal error')
    }
})



/**
 * SHOW ALL ROUTE
 */
router.get('/',  async (req,res) => {
    try {
        const links = await db.query('SELECT * FROM links WHERE status=? AND user_id = ? ORDER BY created_at DESC',[true,req.user.id]);
        res.render('links/list',{links});
    } catch (error) {
        
    }
})



/**
 * DELETE ROUTE
 */
router.get('/delete/:id',  async (req,res) => {
    let id = parseInt(req.params.id);
    console.log(typeof id);
    try {
        const links = await db.query('UPDATE links SET status = ? WHERE id = ? AND user_id = ?',[0,id,req.user.id]);
        if(links.affectedRows !== 1){
            req.flash('error','The link is no exist');
        }else{
            req.flash('success','Link was deleted successfully');
        }
    } catch (error) {
        req.flash('error','Problem in the server.');
    }
    res.redirect(baseUrl + 'links');
})



/**
 * ROUTS TO EDIT VIEW AN UPDATE METHOD
 */
router.get('/edit/:id',  async (req,res) => {
    let {id} = req.params,  
    nameform = 'Update a link',
    edit = true;
    try {
        const link = await db.query('SELECT * FROM links WHERE id = ? AND status = 1 AND user_id = ?',[parseInt(id),req.user.id]);
        if(link.length == 1){
            res.render('links/form',{nameform,edit,link: link[0],method: 'PUT'})
        }else{
            req.flash('error','Problem with the data');
            res.redirect(baseUrl + 'links');
        }
    } catch (error) {
        res.send('Fatal error  ' + error);        
    }
})
router.post('/edit/:id', async (req,res) => {
    let {id} = req.params;
    const {name,url,description} = req.body;
    const updateLink = {
        name: name,
        url: url,
        description: description
    };

    try {
        const response = await db.query('UPDATE links SET ? WHERE id = ? AND status = 1 AND user_id = ?',[updateLink,id,req.user.id]);
        console.log(response);
        if (response.affectedRows === 1) {
            req.flash('success', 'Link was update successfully');
            res.redirect(baseUrl + 'links')
        }else{
            req.flash('error','Problem update the data');
            res.redirect(baseUrl + 'links');
        }
    } catch (error) {
        res.send(error)
    }
})


/**
 * TRASH LINKS ROUTE
 */
router.get('/trash',async (req,res) => {
    try {
        const links = await db.query('SELECT * FROM links WHERE status = 0 AND id = ?',req.user.id)
        res.render('links/trash',{links});
    } catch (error) {
        req.flash('error','There is an error in server.');
        res.redirect('back');
    }
})

module.exports = router;