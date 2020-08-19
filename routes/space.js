var spc = require('../controllers/spaceController');
const assert = require('assert');
var express = require('express');
var router = express.Router();

router.get('/insight', spc.space_count, spc.country_average, spc.average_country_distance, spc.average_locality_distance, spc.get_space_by_name, (req, res, next)=>{
    var obj = {
        space_count: req.space_count,
        country_average: req.country_average,
        average_country_distance: req.average_country_distance,
        average_locality_distance: req.average_locality_distance,
        swiss_space_count: req.get_space_by_name.national_count,
        international_count: req.get_space_by_name.international_count,
        foreign_count: req.get_space_by_name.foreign_count
    }
    res.send(obj)
})
router.get('/top10', spc.top10, (req, res, next)=>{
    var sub_set = req.top10.slice(0, 10)
    res.send(sub_set)
})

router.get('/:country?', spc.get_space_by_name, (req, res, next)=>{
    res.send(req.get_space_by_name);
});

module.exports = router