const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserShema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    countryCode: {
        type: String,
    },
    isConnected: {
        type: Boolean,
        default: false

    },
    avatar: {
        type: String
    },
    msg: {
        type: String,
        default: 'I am here, I\'m using Simple Chat'
    },
    status: {
        type: String,
        required: true,
        default: 'disabled'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserShema)