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
  const title = bookDetails.title;
  const author = bookDetails.authors[0].name;
  const cover = book[isbnFound].thumbnail_url;
  const summary = bookDetails.description;


  const str = `<div class="book-info">
        <div class="title">Title:<span>${title}</span></div>
        <div class="author">Author:<span>${author}</span></div>
        <div class="isbn">ISBN:<span>${isbnToSearch}</span></div>
        <div class="summary">Summary:<span>${summary}</span></div>
        <div class="cover"><img src="${cover}" alt="Cover not available"></div>
        </div>`;

  document.getElementById('book-result').innerHTML = str;
}

document.getElementById('isbn-search').addEventListener('click', async event => {
  event.preventDefault();
  const isbnToSearch = document.getElementById('isbn-num').value;
  console.log(isbnToSearch);

  const { data } = await bookSearch(isbnToSearch);
  drawBook(data, isbnToSearch);
});
