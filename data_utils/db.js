var MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const connexion = MongoClient.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

module.exports = connexion;