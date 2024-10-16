const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: { 
      type: String, 
      required: true 
    },
    serving_size: { 
      type: Number,
       required: true 
      },
    measurementIn: { 
      type: String,
       required: true 
      }, 
    calories: { 
      type: Number, 
      required: true 
    },
    protein: { 
      type: Number, 
      required: true 
    },
    carbs: { 
      type: Number, 
      required: true 
    },
    fats: { 
      type: Number, 
      required: true
     },
    category: { 
      type: String, 
      required: true
     },  
   
  });
  
  module.exports = mongoose.model('Food', foodSchema);
  