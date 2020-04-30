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
    image: {
        type: String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autoPopulate: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', PostShema)