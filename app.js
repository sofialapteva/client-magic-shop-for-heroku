// modules//
const express = require('express');
const session = require('express-session');
require('dotenv').config();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
// imports//
const userRouter = require('./routes/user');
const shopRouter = require('./routes/shop');
// mongoose
const uri = process.env.URI || 'mongodb://localhost:27017/magic';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// server
const app = express();
// middlewares//
app.set('views', 'views');
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    key: 'online-magic-cookies',
    store: new MongoStore({
      mongooseConnection: mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET || 's2dnk4Nvk2s',
    cookie: { secure: false },
  }),
);

app.use((req, res, next) => {
  res.locals.userId = req.session?.userId;
  next();
});

app.use('/user', userRouter);
app.use('/shop', shopRouter);

app.get('/', (req, res) => {
  res.redirect('/shop');
});
const port = process.env.PORT || 3000;
app.listen(port);
