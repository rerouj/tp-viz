var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017/apptp-db';
mongoose.connect(mongoDB, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify : false
    });

// CONNECTION EVENTS
// on success
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + mongoDB);
  }); 
    
// on error
mongoose.connection.on('error',function (err) { 
    console.log('Mongoose default connection error: ' + err);
    }); 

// on disconnection
mongoose.connection.on('disconnected', function () { 
    console.log('Mongoose default connection disconnected'); 
    });

// if process ends 
process.on('SIGINT', function() {   
    mongoose.connection.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
        }); 
    }); 

require('../models/location')
require('../models/show')