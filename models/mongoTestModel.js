var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
    name: { type: String, default: 'firstName' },
    isTest: { type: Boolean, default: true },
    image: { type: String, default: true }
});

module.exports = mongoose.model('test', testSchema);