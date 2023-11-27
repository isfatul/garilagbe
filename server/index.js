const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({secret:"mysecret", resave:false, saveUninitialized:false}));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(cookieParser("mysecret"));

app.use(passport.initialize());
app.use(passport.session());




app.get('/', (req, res) => {
    res.send('Hello World');
}); 

app.listen(4001, () => {
    console.log('Server started on port 4001');
    }
);