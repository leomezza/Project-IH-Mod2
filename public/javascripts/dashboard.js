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

  const allUserIsbn = [];
  document.querySelectorAll('.isbn_13in').forEach(isbn => allUserIsbn.push(isbn.innerText));
  console.log('All Books: ', allUserIsbn);
  console.log('Searched book:', isbn_13, 'typeof', typeof isbn_13);

  let str = '';

  if (allUserIsbn.includes(isbn_13)) {
    console.log('User already has this book');
    str = `<div class="book-info">
    <div class="coverURL"><img style="height: 100px;" src="${cover}" alt="Cover not available"></div>
    <div class="title">Title: <span>${title}</span></div>
    <div class="author">Authors: <ul>${authorsHTML}</ul></div>
    <div class="isbn_10">ISBN-10: <span>${isbn_10}</span></div>
    <div class="isbn_13">ISBN-13: <span>${isbn_13}</span></div>
    <div class="summary">Summary: <span>${summary}</span></div>
    <span class="bg-danger">You already have this book</span>
    <button class="btn btn-primary" style="display:none" id="book-add" data-toggle="modal" data-target="#add-book-form-modal">Add Book</button>
    </div>`;
  } else {
    console.log('User does not have this book yet');
    str = `<div class="book-info">
    <div class="coverURL"><img style="height: 100px;" src="${cover}" alt="Cover not available"></div>
    <div class="title">Title: <span>${title}</span></div>
    <div class="author">Authors: <ul>${authorsHTML}</ul></div>
    <div class="isbn_10">ISBN-10: <span>${isbn_10}</span></div>
    <div class="isbn_13">ISBN-13: <span>${isbn_13}</span></div>
    <div class="summary">Summary: <span>${summary}</span></div>
    <button class="btn btn-primary" id="book-add" data-toggle="modal" data-target="#add-book-form-modal">Add Book</button>
    </div>`;
  }

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
  if (cover === undefined) {
    cover = './images/Default-Book-Cover.jpg';
  } else {
    cover = cover.replace(/S\.jpg/, "L.jpg");
  };
  console.log(cover);
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

document.getElementById('new-book').addEventListener('click', async event => {
  const str = `<label for="isbn-num">Search book by ISBN:</label>
  <input type="string" name="isbn-num" id="isbn-num" />
  <button id="isbn-search" class="btn btn-primary">Search</button>`

  document.getElementById('book-search').innerHTML = str;

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
});

$('#book-search-modal').on('hidden.bs.modal', function (e) {
  document.getElementById('book-result').innerHTML = '';
  document.getElementById('add-book-form').innerHTML = '';
})

document.getElementById('close-modal').addEventListener('click', event => {
  document.getElementById('book-result').innerHTML = '';
  document.getElementById('add-book-form').innerHTML = '';
});

document.querySelectorAll('.book-info').forEach(book => {
  book.addEventListener('click', () => {
    const coverHTML = book.querySelector('.coverURL').innerHTML;
    const titleHTML = book.querySelector('.title').innerHTML;
    const authorsHTML = book.querySelector('.author').innerHTML;
    const isbn_10HTML = book.querySelector('.isbn_10').innerHTML;
    const isbn_13HTML = book.querySelector('.isbn_13').innerHTML;
    const isbn_13 = book.querySelector('.isbn_13in').innerHTML;
    const summaryHTML = book.querySelector('.summary').innerHTML;
    const evaluation = book.querySelector('.evaluationin').innerHTML;
    const readStatus = book.querySelector('.readStatusin').innerHTML;

    console.log(titleHTML);

    const str = `<form action="/editbook" method="post">
    <div class="coverURL">${coverHTML}</div>
  <div class="title">${titleHTML}</div>
  <div class="author">${authorsHTML}</div>
  <div class="isbn_10">${isbn_10HTML}</div>
  <div class="isbn_13">${isbn_13HTML}</div>
  <input type='hidden' name='isbn_13' value='${isbn_13}'>
  <div class="summary">${summaryHTML}</div>
  <div class="evaluation">Current Evaluation: <span class="evaluationin">${evaluation}</span></div>
  <div>
    <label for="eval">New Evaluation</label>
    <select name="eval" id="eval" required>
    <option value="Up">Thumbs Up</option>
    <option value="Down">Thumbs Down</option>
    <option value="None">Neutral</option>
    </select>
  </div>
  <div class="readStatus">Current Read Status: <span class="readStatusin">${readStatus}</span></div>
  <div>
    <label for="status">New Read Status</label>
    <select name="status" id="status" required>
    <option value="Reading">Reading</option>
    <option value="Interested">Interested</option>
    <option value="Finished">Finished</option>
    </select>
  </div>

  <div class="d-flex">
  <button type="submit" class="btn btn-primary px-1 mx-1">Edit</button></form>
  <form action="/delbook?isbn_13=${isbn_13}" method="post"><button class="btn btn-danger px-1 mx-1" id="delete-book" type="submit">Delete</button></form>
  </div>
</form>`;

    document.getElementById('book-edit').innerHTML = str;
    $('#book-edit-modal').modal('toggle')
  });
});
