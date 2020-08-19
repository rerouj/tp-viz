var Location = require('../models/location');
var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var SpaceSchema = Schema(
  {
    _id: String,
    show: String,
    show_title: String,
    space: [{location: {type: Schema.Types.ObjectId, ref:'Location'}}],
    locality_space: [{location: {type: Schema.Types.ObjectId, ref:'Location'}}],
    region_space: [{location: {type: Schema.Types.ObjectId, ref:'Location'}}],
    country_space :[{location: {type: Schema.Types.ObjectId, ref:'Location'}}],
    locations_name: Array,
    distance: {
        country_coord_dist: Number,
        km_btw_country: Number,
        city_coord_dist: Number,
        city_km_dist: Number
    }
  }, 
  {collection: "space"}
);

module.exports = mongoose.model('Space', SpaceSchema);