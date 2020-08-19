//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017/apptp-db';
mongoose.connect(mongoDB, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify : false
    });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + mongoDB);
  }); 
    
// If the connection throws an error
mongoose.connection.on('error',function (err) { 
    console.log('Mongoose default connection error: ' + err);
    }); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () { 
    console.log('Mongoose default connection disconnected'); 
    });

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {   
    mongoose.connection.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
        }); 
    }); 

require('../models/location')
require('../models/show')