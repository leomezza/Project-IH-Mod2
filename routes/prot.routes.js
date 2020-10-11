const express = require('express');
const router = express.Router();
const Book = require('../models/Book.model');
const User = require('../models/User.model');

const protRoutes = require('../middlewares/protRoutes');

router.use(protRoutes);

router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.session.currentUser._id);
    const userID = user._id.toString();
    const userBooks = user.books;

    const data = await Book.find({ '_id': { $in: userBooks } });

    data.forEach(book => {
      const bookEval = book.evaluation;
      const bookReadSt = book.readStatus;


      const filteredEval = bookEval.filter(eval => {
        const userIdFromEval = eval.userId.toString();
        return userIdFromEval === userID;
      });
      book.evaluation = filteredEval;

      const filteredReadSt = bookReadSt.filter(stat => {
        const userIdFromRdSt = stat.userId.toString();
        return userIdFromRdSt === userID;
      });
      book.readStatus = filteredReadSt;

    });

    const mostRead = await Book.aggregate([
      { $match: { readStatus: { $elemMatch: { status: { $eq: "Finished" } } } } },
      {
        "$addFields": {
          "readStatusFinished": {
            "$filter": {
              input: "$readStatus",
              as: "item",
              cond: { $regexMatch: { input: "$$item.status", regex: /Finished/ } }
            }
          }
        }
      },
      { "$project": { "readStatusFinished": 1, "title": 1, "size": { "$size": "$readStatusFinished" } } },
      { "$sort": { "size": -1 } },
    ]);

    const mostRec = await Book.aggregate([
      { $match: { evaluation: { $elemMatch: { eval: { $eq: "Up" } } } } },
      {
        "$addFields": {
          "evaluationUp": {
            "$filter": {
              input: "$evaluation",
              as: "item",
              cond: { $regexMatch: { input: "$$item.eval", regex: /Up/ } }
            }
          }
        }
      },
      { "$project": { "evaluationUp": 1, "title": 1, "size": { "$size": "$evaluationUp" } } },
      { "$sort": { "size": -1 } },
    ]);

    console.log('Dashboard page');

    res.render('dashboard', { loggedUser: req.session.currentUser, data, mostRead, mostRec });
  } catch (error) {
    console.log(error);
  }
});

router.post('/addbook', async (req, res) => {
  const { coverURL, title, author, isbn_10, isbn_13, summary, eval, status } = req.body;

  const isBookInDB = await Book.findOne({ isbn_13: { $eq: isbn_13 } });

  const createdUserId = req.session.currentUser._id;

  if (isBookInDB) {
    const addBook = {
      evaluation: { userId: createdUserId, eval },
      readStatus: { userId: createdUserId, status },
    };

    await Book.findByIdAndUpdate(isBookInDB._id, { $push: addBook });
    await User.findByIdAndUpdate(req.session.currentUser._id, { $push: { books: isBookInDB._id } });

    console.log('Existing book has been added to the user');

  } else {
    const authorToArray = author.split(',');

    const newBook = new Book({
      createdUserId,
      title,
      author: authorToArray,
      isbn_10,
      isbn_13,
      coverURL,
      summary,
      evaluation: { userId: createdUserId, eval },
      readStatus: { userId: createdUserId, status },
    });

    await newBook.save();
    await User.findByIdAndUpdate(req.session.currentUser._id, { $push: { books: newBook._id } });

    console.log('New book has been added to the user and DB');

  }

  res.redirect('/dashboard');
});

router.post('/editbook', async (req, res) => {
  const { isbn_13, eval, status } = req.body;

  const userID = req.session.currentUser._id;

  await Book.findOneAndUpdate({ "isbn_13": isbn_13, "evaluation.userId": userID },
    { $set: { "evaluation.$.eval": eval } });

  await Book.findOneAndUpdate({ "isbn_13": isbn_13, "readStatus.userId": userID },
    { $set: { "readStatus.$.status": status } });

  console.log('A book has been edited');

  res.redirect('/dashboard');
});

router.post('/delbook', async (req, res) => {
  const { isbn_13 } = req.query;
  const bookToRemove = await Book.findOne({ "isbn_13": isbn_13 });

  const userID = req.session.currentUser._id;

  await User.findByIdAndUpdate(userID, { $pull: { books: bookToRemove._id } });
  await Book.findOneAndUpdate({ "isbn_13": isbn_13, "evaluation.userId": userID },
    { $pull: { evaluation: { userId: userID } } });
  await Book.findOneAndUpdate({ "isbn_13": isbn_13, "readStatus.userId": userID },
    { $pull: { readStatus: { userId: userID } } });

  console.log('A book has been removed from the user list');

  res.redirect('/dashboard');
});

module.exports = router;
