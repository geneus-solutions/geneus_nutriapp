const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jagadishsail:TC1dEeuv7MiMRaS3@cluster0.dccge.mongodb.net/test',{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
})