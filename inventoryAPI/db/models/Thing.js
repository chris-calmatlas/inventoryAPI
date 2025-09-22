const mongoose = require('mongoose');
const { Schema, model } = mongoose

// Generic Thing schema
const thingSchema = new Schema({
    // properties
    name: { type: String, required: true},
    description: { type: String },
    count: {
        current: { type: Number, required: true, min: 0 },
        target: { type: Number, min: 0},
        expected: { type: Number, min: 0 }
    },
    identifiers: [{ type: String }],
},  
{   // options
    timestamps: true 
});

const Thing = model('Thing', thingSchema);

module.exports = Thing;