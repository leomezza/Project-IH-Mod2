async function bookSearch(isbn) {
  try {
    const book = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`);
    console.log('The book: ', book);
    return book;
  } catch (err) {
    console.log(`Error while searching the book: ${err}`);
  }
}

function drawBook(book, isbnToSearch) {
  console.log(book);

  const isbnFound = `ISBN:${isbnToSearch}`;
  const bookDetails = book[isbnFound].details;
  let isbn_10 = bookDetails.isbn_10;
  if (isbn_10 === undefined && isbnToSearch.length === 10) {
    isbn_10 = isbnToSearch;
  } else if (isbnToSearch.length === 13) {
    isbn_10 = 'Not available';
  } else {
    isbn_10 = isbn_10[0];
  }
  const isbn_13 = bookDetails.isbn_13[0];
  const title = bookDetails.title;
  const author = bookDetails.authors;
  let authorsArray = [];
  author.forEach(element => authorsArray.push(element.name));
  let authorsHTML = '';
  authorsArray.forEach(element => {
    authorsHTML += `<li>${element}</li>`;
  });
  let cover = book[isbnFound].thumbnail_url;
  console.log('The cover is ', cover)
  if (cover === undefined) cover = './images/Default-Book-Cover.jpg';
  let summary = bookDetails.description;
  if (summary === undefined) summary = 'Not available';
  if (typeof summary != 'string') summary = summary.value;

  const str = `<div class="book-info">
  <div class="coverURL"><img src="${cover}" alt="Cover not available"></div>
  <div class="title">Title: <span>${title}</span></div>
  <div class="author">Authors: <ul>${authorsHTML}</ul></div>
  <div class="isbn_10">ISBN-10: <span>${isbn_10}</span></div>
  <div class="isbn_13">ISBN-13: <span>${isbn_13}</span></div>
  <div class="summary">Summary: <span>${summary}</span></div>
  <button id="book-add">Add Book</button>
  <button id="clear">Cancel</button>
  </div>`;

  document.getElementById('book-result').innerHTML = str;
}

function addBook(book, isbnToSearch) {
  const isbnFound = `ISBN:${isbnToSearch}`;
  const bookDetails = book[isbnFound].details;
  let isbn_10 = bookDetails.isbn_10;
  if (isbn_10 === undefined && isbnToSearch.length === 10) {
    isbn_10 = isbnToSearch;
  } else if (isbnToSearch.length === 13) {
    isbn_10 = 'Not available';
  } else {
    isbn_10 = isbn_10[0];
  }
  const isbn_13 = bookDetails.isbn_13[0];
  const title = bookDetails.title;
  const author = bookDetails.authors;
  let authorsArray = [];
  author.forEach(element => authorsArray.push(element.name));
  let cover = book[isbnFound].thumbnail_url;
  if (cover === undefined) cover = './images/Default-Book-Cover.jpg';
  let summary = bookDetails.description;
  if (summary === undefined) summary = 'Not available';
  if (typeof summary != 'string') summary = summary.value;

  const str = `<form action="/addbook" method="post">
  <input type='hidden' name='coverURL' value='${cover}'>
  <input type='hidden' name='title' value='${title}'>
  <input type='hidden' name='author' value='${authorsArray}'>
  <input type='hidden' name='isbn_10' value='${isbn_10}'>
  <input type='hidden' name='isbn_13' value='${isbn_13}'>
  <input type='hidden' name='summary' value='${summary}'>
  <div>
    <label for="eval">Evaluation</label>
    <select name="eval" id="eval" required>
    <option value="Up">Thumbs Up</option>
    <option value="Down">Thumbs Down</option>
    <option value="None">Neutral</option>
    </select>
  </div>

  <div>
    <label for="status">Read Status</label>
    <select name="status" id="status" required>
    <option value="Reading">Reading</option>
    <option value="Interested">Interested</option>
    <option value="Finished">Finished</option>
    </select>
  </div>

  <button type="submit">Add</button>

  <button type="button">Cancel</button>
</form>`;

  document.getElementById('add-book-form').innerHTML = str;
}

document.getElementById('isbn-search').addEventListener('click', async event => {
  event.preventDefault();
  const isbnToSearch = document.getElementById('isbn-num').value;
  console.log(isbnToSearch);

  const { data } = await bookSearch(isbnToSearch);
  drawBook(data, isbnToSearch);
  document.getElementById('book-add').addEventListener('click', async event => {
    addBook(data, isbnToSearch);
  });
});