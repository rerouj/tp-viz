const spc = require('../controllers/spaceController');
const sc = require('../controllers/showController');
const lc = require('../controllers/locationController');


exports.show_insight_array = [
    sc.show_count,
    lc.location_count,
    lc.country_count,
    lc.locality_count
]

exports.space_insight_array = [
    spc.space_count, 
    spc.country_average, 
    spc.average_country_distance, 
    spc.average_locality_distance, 
    spc.get_space_by_name
]
