const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
    name: {
       type: String,
        required: true 
      },
    calories: {
       type: Number 
      },
    protein: {
       type: Number 
      },
    carbs: { 
      type: Number 
    },
    fats: { 
      type: Number 
    },
    user_id: {
       type: Schema.Types.ObjectId,
        ref: 'User',
         required: true 
        }
  });
  
  module.exports = mongoose.model('Goal', goalSchema);