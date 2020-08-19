var express = require('express');
var router = express.Router();
const synth = require('../controllers/synthController')
const texts = require('../public/texts/text')

/* GET home page. */
router.get('/', synth.show_insight_array, synth.space_insight_array, (req, res, next)=>{
  res.render('layout', {
    global_insight: "1. Analyse générale",
    global_insight_intro: texts.global_insight_intro,
    show_count: req.show_count,
    location_count: req.location_count,
    country_count: req.country_count,
    locality_count: req.locality_count,
    country_average: req.country_average.toFixed(2),
    average_country_distance: Math.round(req.average_country_distance),
    average_locality_distance: Math.round(req.average_locality_distance),
    national_count: req.get_space_by_name.national_count,
    foreign_count: req.get_space_by_name.foreign_count,
    international_count: req.get_space_by_name.international_count  
  })
})

module.exports = router;
