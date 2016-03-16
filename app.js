var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//request params depend
var bodyParser = require('body-parser');
//request configuration
var config = require('./config/config');
// database connection
var mongoose = require('mongoose');
//session as cookie not only memory
var session = require('cookie-session');
//mongo connection
mongoose.connect('mongodb://' + config.host + ':' + config.port + '/' + config.db);
//instancialize express
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//set jade template engine
app.set('view engine', 'jade');
//favicon icon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//set cookie-session to login
app.use(
    session({ 
     secret: 'keyboard cat',  
     resave: false,
     saveUninitialized: true,
     cookie: { 
      maxAge: 60000 
    }
  })
);

//verify if is authenticate
isAuth = function (req, res, next) {

  if (!req.session.uid) {

    res.send('You are not authorized to view this page');
  } else {

    next();
  }
}

var routes = require('./controllers/index');
var users = require('./controllers/users');
var cards = require('./controllers/cards');

app.use('/', routes);
app.use('/users', users);
app.use('/cards', cards);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
