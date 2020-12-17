const express = require('express');

const router = express.Router();
const Good = require('../models/good');
const City = require('../models/city');

// все товары
router.get('/', async (req, res) => {
  const goods = await Good.find({
    status: 'в продаже',
  }).populate('city');
  const city = await City.find();
  res.render('shop', { goods, city });
});

router.get('/:id', async (req, res) => {
  await Good.updateOne(
    { _id: req.params.id },
    { status: 'забронировано', buyer: req.session.userId },
  );
  res.redirect('/shop');
});

// товары по запросу
router.post('/search', async (req, res) => {
  let goods;
  if (req.body.name) {
    goods = await Good.find({
      name: { $in: req.body.name.toUpperCase() },
      city: req.body.city,
      status: 'в продаже',
    }).populate('city');
  } else {
    goods = await Good.find({
      city: req.body.city,
      status: 'в продаже',
    }).populate('city');
  }
  let error;
  if (goods.length === 0) {
    error = 'Товаров по запросу не найдено';
  }
  const city = await City.find();
  res.render('shop', { goods, city, error });
});

module.exports = router;
