// Подключаем mongoose.
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/magic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const City = require('./models/city');

const city = [
  { city: 'Москва' },
  { city: 'Екатеринбург' },
  { city: 'Иваново' },
  { city: 'Новосибирск' },
];

City.insertMany(city).then(() => {
  mongoose.connection.close();
});
