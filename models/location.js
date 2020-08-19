var Show = require('../models/show');
var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var LocationSchema = Schema(
  {
    _id: Schema.Types.ObjectId,  
    archive_name: String,
    alias: String,
    show_id: [{mongo_id: {type: Schema.Types.ObjectId, ref: 'Show'}, rts_id: String}],
    geo_data: [{
      address_components:[{long_name: String, short_name: String, types: [String]}],
      geometry:[{location: {lat: Number, lng: Number}}],
      "types": Array
    }],
    wiki_data: Object,
    index: Number
  }, 
  {collection: "locations"}
);

module.exports = mongoose.model('Location', LocationSchema);