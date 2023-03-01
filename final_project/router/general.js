const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
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
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
  
    // Return the new user object
    return res.status(201).json({ user: newUser });
});
/*************** */
const listBooks = async () => {
	try{
		const getBooks = await Promise.resolve (books)
		if (getBooks) {
			return getBooks
		} else {
			return Promise.reject (new error('Books not found'))
		}
	} catch (error) {
		console.log (error)
	}
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});

public_users.get('/', async (req, res) => {
  const listBook = await listBooks()
  res.json(listBook)
});
/**************** */

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);

  } else {
    res.status(400).json({ "message": "Books not found" });
  }
});

const getByISBN=async(isbn)=>{
  try{
    const getISBN=await Promise.resolve(isbn);
    if(getISBN){
      return Promise.resolve(isbn)
    }
    else{
      return Promise.reject(new error("Book with the isbn not found!"));
    }
  }
  catch(error){
    console.log(error);
  }
}

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const returnedIsbn = await getByISBN(isbn);
  res.send(books[returnedIsbn]);
})

/************* */
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
  });

// Get all books based on title
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
