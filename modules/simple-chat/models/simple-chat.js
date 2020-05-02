const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SimpleChatShema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    lastMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        require: true
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('SimpleChat', SimpleChatShema)