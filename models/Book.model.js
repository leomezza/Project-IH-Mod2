const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = new Schema({
  createdUserId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  author: { type: [String], required: true },
  isbn: { type: Number, required: true },
  coverURL: { type: String, default: './images/Default-Book-Cover.jpg' },
  summary: { type: String, default: 'Summary not found' },
  evaluation: [{ userId: { type: Schema.Types.ObjectId, ref: 'user' }, eval: { type: String, enum: ['Up', 'Down', 'None'], default: 'None' } }],
  readStatus: [{ userId: { type: Schema.Types.ObjectId, ref: 'user' }, status: { type: String, enum: ['Reading', 'Interested', 'Finished'], default: 'Interested' } }],
},
  {
    timestamps: true,
  });

const Book = mongoose.model('book', bookSchema);

module.exports = Book;
