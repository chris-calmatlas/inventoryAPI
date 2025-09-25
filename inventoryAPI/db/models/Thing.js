const mongoose = require('mongoose');
const { Schema, model } = mongoose

// Generic Thing schema
const thingSchema = new Schema({
    // properties
    name: { type: String, required: true},
    description: { type: String },
    count: {
        current: { type: Number, required: true, min: 0, default: 0},
        target: { type: Number, min: 0},
        expected: { type: Number, min: 0 }
    },
    identifiers: [{ type: String }],
},  
{   // options
    timestamps: true,
});

thingSchema.methods.findOneDuplicate = async function() {
    return await this.constructor.findOne({ 
        name: this.name, 
        description: this.description, 
        _id: { $ne: this._id } 
    })
    .then((duplicate) => duplicate);
}

thingSchema.methods.errorOnDuplicate = async function() {
    return await this.findOneDuplicate().then((duplicate) => {
        if (duplicate) {
            const err = new Error('Duplicate found, no changes made');
            err.name = 'DuplicateError';
            err.duplicate = duplicate;
            return err;
        }
    });
}

// Return error if duplicate found
thingSchema.pre('save', function(next) {
    this.errorOnDuplicate().then((err) => err ? next(err) : next());
});

const Thing = model('Thing', thingSchema);

module.exports = Thing;