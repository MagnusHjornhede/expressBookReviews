const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Middleware which tells that the user is authenticated or not
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({ message: "User not authenticated" })
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" })
    }

    /*
     const token = req.headers.authorization?.split(" ")[1];
     // Check for token
     if (!token) {
       return res.status(401).json({ message: "Authentication failed. Token not provided." });
     }
     
     try {
       const decoded = jwt.verify(token, "secret_key");
       const userId = decoded.userId;
       const user = users.find((user) => user.id === userId);
   
       if (!user) {
         return res.status(401).json({ message: "Authentication failed. User not found." });
       }
   
       req.user = user;
       next();
     } catch (error) {
       return res.status(401).json({ message: "Authentication failed. Invalid token." });
     }*/
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
