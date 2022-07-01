'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var characterSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  name: String,
  //spells: If I could somehow make this spell-list, that would be nice.
  class: String,
  level: Number,
  race: String,
  //backstory: String,
  //weapon: String,
} );

module.exports = mongoose.model( 'Character', characterSchema );

