const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Create a new user object
  const newUser = { username, password };
  users.push(newUser);
  return res.status(201).json("User created");
});
/*************** */
const listBooks = async () => {
  try {
    const getBooks = await Promise.resolve(books)
    if (getBooks) {
      return getBooks
    } else {
      return Promise.reject(new error('Books not found'))
    }
  } catch (error) {
    console.log(error)
  }
}

// Get the book list available in the shop
/*
public_users.get('/', function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});
*/
public_users.get('/', async (req, res) => {
  const listBook = await listBooks()
  res.json(listBook)
});
/**************** */

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);

  } else {
    res.status(400).json({ "message": "Books not found" });
  }
});
*/

const getByISBN = async (isbn) => {
    const book = books[isbn];
    if (book) {
      return Promise.resolve(book);  // Promise really not needed
    } else {
      return Promise.reject(new Error("Book with the ISBN not found!"));
    }
};

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await getByISBN(isbn);
    res.json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/*************  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = [];

  for (const bookId in books) {
    const book = books[bookId];
    if (book.author === author) {
      authorBooks.push(book);
    }
  }

  if (authorBooks.length > 0) {
    res.json(authorBooks);
  } else {
    res.status(400).json({ "message": "No books found for the specified author" });
  }
});*/

const getAuthorBooks = async (author) => {
  const authorBooks = [];
  if (!Array.isArray(books)) {
    books = Object.values(books);
  }
  for (const book of books) {
    if (book.author === author) {
      authorBooks.push(book);
    }
  }
  if (authorBooks.length > 0) {
    return authorBooks;
  } else {
    throw new Error("No books found for the specified author");
  }
};

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const authorBooks = await getAuthorBooks(author);
    res.json(authorBooks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const getBooksDetails = async (title) => {
  const authorBooks = [];
  //const book = books[author];
  if (!Array.isArray(books)) {
    books = Object.values(books);
  }
  for (const book of books) {
    if (book.title === title) {
      authorBooks.push(book);
    }
  }
  if (authorBooks.length > 0) {
    return authorBooks;
  } else {
    throw new Error("No books found for the specified title");
  }
  }

  public_users.get('/title/:title', async (req, res)=> {
    //Write your code here
    const titleOfBook = req.params.title;
    try{
        const searchResult= await getBooksDetails(titleOfBook);
        res.json(searchResult);
    }catch(error){
        res.status(404).json({ message: error.message });
    }
  });

/*
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  for (const bookId in books) {
    const book = books[bookId];
    if (book.title === title) {
      return res.json(book);
    }
  }
  res.status(400).json({ "message": "Book not found" });
});
*/
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookReviews = books[isbn];
  if (bookReviews) {
    return res.json(bookReviews.reviews);
  }
  return res.status(400).json({ message: "Reviews not found" });
});

module.exports.general = public_users;
