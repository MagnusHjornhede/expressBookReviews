const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //Check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username = username;
  })
  if (userswithsamename.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //Check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    // Return 401 Unauthorized status if the user is not authenticated
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = { username: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  // Return the JWT token as a JSON response
  res.json({ accessToken: accessToken });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;  // req.params.isbn ?
  const { rating, comment } = req.body;
  
  // Find the book with the given ISBN
  const book = books.find((book) => book.isbn === isbn);
  
  // Return a 404 Not Found status if the book is not found
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Create a new review object
  const review = { rating: rating, comment: comment };
  
  // Add the review to the book's reviews array
  book.reviews.push(review);
  
  // Return the updated book object as a JSON response
  res.json(book);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
