'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var characterSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  name: String,
  //spells: If I could somehow make this spell-list, that would be nice.
  class: String,
  level: Number,
  race: String,
  backstory: String,
  //weapon: String,
  str: Number,
  dex: Number,
  con: Number,
  int: Number,
  wis: Number,
  cha: Number,
  //TODO: Add feats, equipment, and maybe see if spells can be dependent on character. 
  picture: String,
  //wanted this to be an image object but that's not working so I guess it will have to be a link.

} );

module.exports = mongoose.model( 'Character', characterSchema );

