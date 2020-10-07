const express = require('express');
const router = express.Router();
const Book = require('../models/Book.model');
const User = require('../models/User.model');

const protRoutes = require('../middlewares/protRoutes');

router.use(protRoutes);

router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.session.currentUser._id);
    const userBooks = user.books;

    const data = await Book.find({ '_id': { $in: userBooks } });

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

    console.log('mostRead:', mostRead);

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

    console.log('mostRec:', mostRec);

    // const mostRead = await Book.find({ readStatus: { $elemMatch: { status: { $eq: "Finished" } } } });
    // const mostRec = await Book.find({ evaluation: { $elemMatch: { eval: { $eq: "Up" } } } });

    console.log('Dashboard page');

    res.render('dashboard', { data, mostRead, mostRec });
  } catch (error) {
    console.log(error);
  }
});

router.post('/addbook', async (req, res) => {
  const { coverURL, title, author, isbn_10, isbn_13, summary, eval, status } = req.body;

  const isBookInDB = await Book.findOne({ isbn_13: { $eq: isbn_13 } });

  console.log('Is book in DB: ', isBookInDB);

  const createdUserId = req.session.currentUser._id;

  if (isBookInDB) {
    const addBook = {
      evaluation: { userId: createdUserId, eval },
      readStatus: { userId: createdUserId, status },
    };

    await Book.findByIdAndUpdate(isBookInDB._id, { $push: addBook });
    await User.findByIdAndUpdate(req.session.currentUser._id, { $push: { books: isBookInDB._id } });

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

  }

  res.redirect('/dashboard');
});

module.exports = router;
