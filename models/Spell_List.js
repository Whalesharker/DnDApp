'use strict';
const mongoose = require( 'mongoose' );
const Spell = require('./Spell');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var ListSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  spellIndex: String,
  spellID: {type:Schema.Types.ObjectId,ref:'Spell'},
  //spell : Spell
  //I think this is a spell object?
} );

module.exports = mongoose.model( 'Spell_List', ListSchema );
