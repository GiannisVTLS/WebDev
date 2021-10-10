const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    workid: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    review: {
        type: String
    }
}, {timestamps: true})

const Favorite = mongoose.model('Favorite', bookSchema)

module.exports = Favorite