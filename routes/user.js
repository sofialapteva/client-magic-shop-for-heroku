/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const sha256 = require('sha256');
const nodemailer = require('nodemailer');

const router = express.Router();
const User = require('../models/user');
const Good = require('../models/good');
const Order = require('../models/order');
const City = require('../models/city');

// рендерим страницу профиля с информацией о профиле и списком карточек
router.get('/', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findOne({ _id: req.session.userId }).populate(
      'city',
    );
    const userGoods = await Good.find({ userId: req.session.userId });
    const userOrders = await Order.find({ buyer: req.session.userId }).populate(
      'goods',
    );
    return res.render('profile', { user, userGoods, userOrders });
  }
  res.redirect('/user/register');
});

// регистрация
router
  .route('/register')
  .get(async (req, res) => {
    const city = await City.find();
    res.render('register', { city });
  })
  .post(async (req, res) => {
    const city = await City.find();
    if (req.body.password1 !== req.body.password2) {
      res.render('register', { city, repeatePassword: true });
    } else {
      const sameEmail = await User.findOne({ email: req.body.email });
      if (sameEmail) {
        return res.render('register', {
          city,
          error: 'Данный email уже прикреплен к другой учетной записи.',
        });
      }
      const newUser = new User({
        email: req.body.email.toLowerCase(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: sha256(req.body.password1),
        city: req.body.city,
      });
      await newUser.save();
      req.session.userId = newUser._id;
      res.redirect('/shop');
    }
  });

// вход
router
  .route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
      password: sha256(req.body.password),
    });
    if (user) {
      req.session.userId = user._id;
      res.redirect('/shop');
    } else {
      return res.render('login', {
        error: 'Неправильный логин или пароль. Попробуйте снова.',
      });
    }
  });

// выход
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/user/login');
});

// добавить, удалить и (возможно) изменить товар
router
  .route('/goods')
  .get((req, res) => {
    res.render('good');
  })
  .post(async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.session.userId });
      const newGood = new Good({
        name: req.body.name.toUpperCase(),
        img: req.body.img,
        price: req.body.price,
        worn: req.body.worn,
        city: user.city,
        userId: user._id,
      });
      await newGood.save();
      res.redirect('/user');
    } catch (e) {
      res.send('Ошибка');
    }
  })
  .delete(async (req, res) => {
    await Good.deleteOne({ _id: req.body.id });
    res.json('ok');
  });

// .patch(async (req, res) => {
// тут может быть логика редактирования карточки
// });

// посмотреть корзину, отправить заказ, очистить корзину
router
  .route('/cart')
  .get(async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId });
    const goodsInCart = await Good.find({ status: 'забронировано' });
    const sum = goodsInCart.reduce((acc, el) => acc + el.price, 0);
    res.render('cart', { goodsInCart, sum, user });
  })
  .post(async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId });
    await Good.updateMany(
      { status: 'забронировано', buyer: user._id },
      { status: 'продано' },
    );
    const soldGoods = await Good.find({ status: 'продано', buyer: user._id }, { _id: true }).populate('userId');
    const newOrder = new Order({
      buyer: user._id,
      goods: soldGoods,
      createdAt: new Date(),
    });
    await newOrder.save();
    const mail = async (sellerEmail) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
          user: 'nodesend@mail.ru',
          pass: 'JsIsTh3B3st',
        },
      });
      await transporter.sendMail({
        from: '"Magic: The Gathering Shop" <nodesend@mail.ru>',
        to: `${sellerEmail}`,
        subject: 'Ваш товар был куплен',
        html: 'Товар, размещенный вами на сайте Magic: The Gathering Shop, был куплен ',
      });
    };
    soldGoods.forEach((el) => {
      mail(el.userId.email);
    });

    res.json('ok');
  })
  .delete(async (req, res) => {
    await Good.updateMany(
      { status: 'забронировано', buyer: req.session.userId },
      { status: 'в продаже' },
    );
    res.json('ok');
  });

module.exports = router;
