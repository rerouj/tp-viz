var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var locationRouter = require('./routes/location');
var showRouter = require('./routes/show');
var spaceRouter = require('./routes/space');
var graphRouter = require('./routes/graph')
var md = require('markdown-it')();

var app = express(),
    db = require('./db/db');

//const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/apptp-db', {useNewUrlParser: true, useUnifiedTopology: true});
//
//const Location = mongoose.model('Locations', { archive_name: String }, 'locations_dep');
//
//const mars = new Location({ archive_name: 'Mars' });
//mars.save().then(() => console.log('mars saved'))
//test = Location.findOne({archive_name: 'ABIDJAN'},'archive_name alias', (err, docs)=>{
//  console.log(err, docs)
//});
//var t = 100;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/location', locationRouter);
app.use('/show', showRouter);
app.use('/space', spaceRouter);
app.use('/graph', graphRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
