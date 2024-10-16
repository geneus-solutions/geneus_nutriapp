const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
    date: { 
      type: Date, 
      required: true
     },
    weight: { 
      type: Number
     },
    calories_consumed: {
       type: Number
       },
    protein_consumed: { 
      type: Number
     },
    carbs_consumed: {
       type: Number 
      },
    fats_consumed: {
       type: Number 
      },
 
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model('Progress', progressSchema);
  