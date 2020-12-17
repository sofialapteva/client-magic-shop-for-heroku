const profileLog = document.querySelectorAll('.profile');
const goodsLog = document.querySelectorAll('.goods');
const ordersLog = document.querySelectorAll('.orders');

const menu = [profileLog, goodsLog, ordersLog];

menu.forEach((el) => {
  el[0].addEventListener('click', (event) => {
    const { id } = event.target.dataset;
    el[1].removeAttribute('class');
    menu.filter((a) => a[0].dataset.id !== id).forEach((b) => {
      b[1].setAttribute('class', 'hidden');
    });
  });
});
