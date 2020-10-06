const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  imageAvatar: { type: String, default: './images/default-avatar.svg' },
  secretQuestion: { type: String, required: true, enum: ['What was your childhood nickname?', 'What is the name of your favorite childhood friend?', 'What was the name of your first pet?', 'What is your mothers maiden name?'] },
  secretAnswer: { type: String, required: true },
  books: {type: [String] },
},
{
  timestamps: true,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
