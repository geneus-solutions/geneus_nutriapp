const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
    firstName: { 
      type: String,
       required: true
       },
    lastName: {
       type: String,
        required: true
       },
    age: { 
      type: Number 
    },
    DOB: {
       type: Date
       },
    gender: {
       type: String
       },
    height: { 
      type: Number
     },
    weight: { 
      type: Number
     },
    country: {
       type: String
       },
    user_id: { 
      type: Schema.Types.ObjectId,
       ref: 'User',
        required: true 
      }
  });
  
  module.exports = mongoose.model('PersonalInfo', personalInfoSchema);
  