'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

var SpellSchema = Schema( {
    userId: {type:Schema.Types.ObjectId, ref:'User'},
    index: String,
    name: String,
    desc: Array,
    higher_level: Array,
    range: Mixed,
    components: Array,
    material: String,
    ritual: Boolean,
    duration: Mixed,
    concentration: Boolean,
    casting_time: Mixed,
    level: Mixed,
    //attack_type: String,
    //damage_type: Mixed,
    //There are other fields but they are lists, I may have to implement them later.
    //https://www.dnd5eapi.co/api/spells/acid-arrow For reference to the fields.
} );

module.exports = mongoose.model( 'Spell', SpellSchema );
