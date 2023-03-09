const express = require('express');
const jwt = require('jsonwebtoken');
//let books = require("./booksdb.js");
const regd_users = express.Router();

let books = {
    1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": "Just made a review for testing" },
    2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
    3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
    4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
    5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
    6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
    7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {} },
    8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
    9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {} },
    10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

let users = [{ "username": "22", "password": "22" }];

const isValid = (username) => {
    //Check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;   // chanved = to ===
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

regd_users.get("/dump", (req, res) => {
    if (authenticatedUser) {
        return res.send({ users });
    }
    return res.status(400).json({ message: "Missing username or password" });
});

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password" });
    }

    const user = authenticatedUser(username, password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    let accessToken = jwt.sign({
        data:user
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken     // have to be same aslet token = req.session.authorization['accessToken']; 
    }
    // res.json({ accessToken });
    return res.status(200).send("User successfully logged in");
});
/*
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { comment } = req.body;

    //const isbn = req.params.isbn;
    const book = books[isbn];

    // Find the book with the given ISBN
    //const book = Object.values(books).find((book) => book.isbn === isbn);

    // Return a 404 Not Found status if the book is not found
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Create a new review object
   // const review = { comment: comment };
    const review = {
        "username": "user3",
        "text": "This book was okay.",
        "date": "2022-03-12"
      };
    // Add the review to the book's reviews array
    book.reviews.push(review);

    // Return the updated book object as a JSON response
    res.json(book);
});
*/

regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username, comment } = req.body;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const review = {
        username,
        text: comment,
        date: new Date().toISOString()
    };

   // if (!book.reviews) {
      //  book.reviews = [review];
   // } else {
        books.push(book);
  //  }

    return res.json(book);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
