'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var BugSchema = Schema( 
{
  name: String,
  desc: String,
} );

module.exports = mongoose.model( 'BugSchema', BugSchema );

