const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const JWT_SECRET = 'itsverysecret'
app.use("/customer/auth/*", function auth(req,res,next){
  try {
    req.decoded = jwt.verify(req.headers.authorization, JWT_SECRET)
    return next();
  }
  
  catch(error) {
    if (error.name === 'TokenExpireError') {
      return res.status(419).json({
        code: 419,
        message: 'The token is expired.'
      });
    }
   return res.status(401).json({
     code: 401,
     message: 'The token is invalid.'
   });
  }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
