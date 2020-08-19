var MongoClient = require('mongodb').MongoClient;
var lc = require('../controllers/locationController');
const assert = require('assert');
var express = require('express');
var router = express.Router();

router.get('/trend/:place?', lc.location_trend, lc.location_total_per_year, (req, res, next)=>{
    // append total documentary per year in the trend object
    var n = req.trend;
    for(const y in req.trend.data){
        let year = req.trend.data[y].date;
        req.trend.data[y]['total_per_year'] = req.count[year]
    }
    res.send(req.trend)
})
router.get('/insight/:type?', lc.insight)
    
router.get('/geo_json/:place?', lc.geo_json, (req, res, next)=>{
    res.send(req.geo_json)
})

router.get('/:name?', lc.location_list)

module.exports = router