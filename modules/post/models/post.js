const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostShema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    creator: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', PostShema)