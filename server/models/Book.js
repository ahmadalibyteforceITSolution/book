const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'علمائے کرام'
  },
  publisher: {
    type: String,
    default: 'مکتبہ کتاب و سنت'
  },
  category: {
    type: String,
    default: 'متفرق کتب'
  },
  subCategory: {
    type: String,
    default: 'عام کتب'
  },
  bookNumber: {
    type: String,
    default: ''
  },
  pages: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 0
  },
  sizeFormatted: {
    type: String,
    default: '0 KB'
  },
  description: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  dateAdded: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'book', // Explicitly match user's MongoDB Compass collection 'book'
  bufferCommands: false,
  suppressReservedKeysWarning: true
});

module.exports = mongoose.model('Book', bookSchema);
