const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        minLength: [3, 'category name must be at least 3 characters'],
        maxLength: [18, 'category name must be at most 18 characters'],
    },
}, {
    timestamps: true
}
);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;