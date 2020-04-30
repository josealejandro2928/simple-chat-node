const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PinShema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    pin: {
        type: Number,
        required: true
    },
    expiredAt: {
        type: Date,
        require: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Pin', PinShema)