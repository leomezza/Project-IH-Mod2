const express = require('express');
const router = express.Router();
const Book = require('../models/Book.model');
const User = require('../models/User.model');

// const protRoutes = require('../middlewares/protRoutes');

// router.use(protRoutes);

router.get('/dashboard', async (req, res) => {
  try {
    const data = await Book.find();

    const test = await Book.aggregate([
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

    console.log(test);

    const mostRead = await Book.find({ readStatus: { $elemMatch: { status: { $eq: "Finished" } } } });
    const mostRec = await Book.find({ evaluation: { $elemMatch: { eval: { $eq: "Up" } } } });

    console.log('Dashboard page');

    res.render('dashboard', { data, mostRead, mostRec });
  } catch (error) {
    console.log(error);
  }
});

router.post('/addbook', async (req, res) => {
  const { coverURL, title, author, isbn_10, isbn_13, summary, eval, status } = req.body;

  const createdUserId = '5f78792c5704ea07d17ff120';

  const authorToArray = author.split(',');
  console.log(authorToArray);

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

  res.redirect('/dashboard');
});

module.exports = router;
