var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
var port = process.env.PORT || 5000;

var nav = [{
        Link: '/Dash', 
        Text: 'Dashboard' 
        }, {
        Link: '/Admin', 
        Text: 'Admin'
    },
    {Link: '/dummy',
Text: 'dummy text'}

];

var authRouter = require('./src/routes/authRoutes')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'library', resave: true, saveUninitialized: true }));
require('./src/config/passport')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/Auth', authRouter);

app.get('/', function(req, res) { 
    if (!req.user) {
        res.render('index', {title: 'UPS SMT - Homepage', 
            nav:nav
        });
    } else { 
        res.render('Admin', {title: 'UPS SMT - Admin', 
            nav:nav,
            user: req.user
        }); 
    }
});
app.get('/signUp', function(req, res) { 
    res.render('signUp', {title: 'UPS SMT - Sign Up!', 
    nav:nav
    });
});
app.get('/logout', function(req, res) {
    console.log("logging out!");
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
app.listen(port, function() { 
    console.log('Your server is running on port ' + port);
});