const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const isValid = (username) => {
    //Check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username; 
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

regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in auth_users"});
}

if (authenticatedUser(username,password)) {
  let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60  });
  req.session.authorization = {
    accessToken,username
}
return res.status(200).send("User successfully logged in");
}
else {
  return res.status(401).json({message: "Invalid Login. Check username and password"});
}
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


/*
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

*/


regd_users.put("/auth/review/:isbn",async (req, res) => {

      //Write your code here
      const isbn = req.params.isbn;
      const username = req.session.authorization.username	
      let book = books[isbn]
      if (book) {
          let review = req.query.review;
          let reviewer = req.session.authorization['username'];
          if(review) {
             // book["reviews"][reviewer] = review;
              book["reviews"] = review
              books[isbn] = await book;
          }
          res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
      }  else{
          res.send("Book not found");
      }
      
  
  });

  regd_users.delete("/auth/review/:isbn", async (req, res) => {
    const username = req.session.authorization.username
     const isbn = req.params.isbn
     // If the book was found
     if (books[isbn]) {
         let book = await books[isbn] // waiting for promise
         delete book.reviews[username]
         return res.status(200).send("Review successfully deleted")
     } else {
         return res.status(404).json({message: "ISBN not found"})
     }
 })


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
