const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserShema = new Schema({
    email: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    status: {
        type: Object,
        required: true,
        default: 'disabled'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserShema)