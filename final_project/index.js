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
if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});

/*
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user is logged in
    if (req.session && req.session.user) {
      // Get the user object from the session
      const user = req.session.user;
  
      // Check if the user has a valid access token
      if (user.accessToken) {
        // Verify the access token using the JWT library
        jwt.verify(user.accessToken, 'accessToken', (err, decoded) => {
          if (err) {
            // Access token is invalid or expired, send 403 Forbidden status
            return res.status(403).json({ message: "User not authenticated" });
          } else {
            // Access token is valid, store the user object in the request
            req.user = decoded.data;
            next();
          }
        });
      } else {
        // User does not have a valid access token, send 403 Forbidden status
        return res.status(403).json({ message: "User not authenticated" });
      }
    } else {
      // User is not logged in, send 403 Forbidden status
      return res.status(403).json({ message: "User not logged in" });
    }
  });
*/
/*
app.use("/customer/auth/*", function auth(req, res, next) {
    // Middleware which tells that the user is authenticated or not
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "accessToken", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({ message: "User not authenticated" })
            }
        });
    } else {
        return res.status(403).json({ message: "INDEX- User not logged in" })
    }
});
*/
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
