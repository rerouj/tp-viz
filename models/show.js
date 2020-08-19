var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ShowSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    id: String,
    title: String,
    publicationDate: String,
    summary: String,
    mediaURL: String,
    imageURL: String,
    scripts :Array,
  }, 
  {collection: "tp_show_lite"}
);

module.exports = mongoose.model('Show', ShowSchema);