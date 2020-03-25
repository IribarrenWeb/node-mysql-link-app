// Init variables
const express = require('express');
const morgan = require('morgan');
const router = require('./routes/routes');
const engine = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MSS = require('express-mysql-session');
const {database} = require('./keys');
const {isLogin,notLogin} = require('./lib/helpers');


// Initializations
const app = express();
const passport = require('./lib/passport');

// Settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views/'))

app.engine('hbs',engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/helpers')
}))
app.set('view engine','hbs');


// Middlewares
app.use(session({
    secret: 'linkapp',
    resave: false,
    saveUninitialized: false,
    store: new MSS(database)
}))
app.use(flash())
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/links',isLogin);


// Global variables
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
});


// Routes
app.use(router);
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname,'public')))

app.use('*',(req,res) => {
    res.render('404')
})

// Listen
app.listen(app.get('port'),()=>{
    console.log('servidor conectado');
})