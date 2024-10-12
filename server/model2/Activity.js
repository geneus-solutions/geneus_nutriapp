const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    activity_level: { 
      type: String 
    },  
    user_id: {
       type: Schema.Types.ObjectId, ref: 'User',
        required: true 
      }
  });
  
  module.exports = mongoose.model('Activity', activitySchema);
  