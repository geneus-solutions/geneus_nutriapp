const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    breakfast: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    lunch: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    dinner: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    snacks:[
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, {
 timestamps : true   
}
);


const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
