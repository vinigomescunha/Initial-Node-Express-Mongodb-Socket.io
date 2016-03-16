var mongoose = require('mongoose');

//mongoose.connection.readyState;
var cardsSchema = new mongoose.Schema({

    title: {
        type: String,
        default: '--no title--'
    },
    content: {
        type: String,
        default: '...'
    },
    slug: {
        type: String
    },
    date: {
        type: String
    },
    uid: {
       type: String
   }
});

cardsSchema.pre('save', function(next) {

    console.log('Saving....');
    this.date = new Date().toISOString();
    next();
});

cardsSchema.pre('update', function(next) {

    console.log('Updating...');
    this.date = new Date().toISOString();
    next();
});

cardsSchema.pre('find', function(next) {

    console.log('Pre Find');
    next();
});

cardsSchema.pre('findOne', function(next) {

    console.log('Pre Find One');
    next();
});

cardsSchema.post('find', function(doc) {

    console.log('Post Find');
});

cardsSchema.post('findOne', function(doc) {
    
    console.log('Post Find One');
});

module.exports = mongoose.model('Cards', cardsSchema);
