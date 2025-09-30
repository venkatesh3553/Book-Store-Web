const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisterUser',
        required: true
    },
    id: { type: String,required: true},
    title: { type: String, required: true },
    subtitle: { type: String },
    price: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    count: { type: Number, default: 1 },
   addbutton: { type: Boolean, default: true }
}, { timestamps: true });

// Unique per user
booksSchema.index({ userId: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Books', booksSchema);