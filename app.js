var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

app.set('views engine', 'html');
app.set('views', path.resolve('views'));
app.engine('.html', require('ejs').__express);
app.use(cookieParser());

//请求提处理中间件，
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'zfpx'
}));
function checkLogin(req, res, next) {
    if (req.session.username) {
        if (req.path == '/user') {
            next()
        } else {
            res.redirect('/user')
        }
    } else {
        res.redirect('/login')
    }
}
app.use(checkLogin);
//登录页
app.get('/login', function (req, res) {
    res.render('login')
});
app.post('/login', function (req, res) {
    var user = req.body;
    console.log(user);
    if (user.username == user.password) {
        req.session.username = user.username;
        req.session.password = user.password;
        console.log(req.session);

        res.redirect('/user');
    } else {
        res.redirect('back')
    }
});
app.get('/set', function (req, res) {
    res.render('set', {date: req.session});
});
//用户主页
app.get('/user',checkLogin, function (req, res) {
    res.render('user', {username: req.session.username});
});
app.listen(1425);


