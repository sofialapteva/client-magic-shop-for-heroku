const postButn = document.querySelector('#confirmOrder');
const deleteButn = document.querySelector('#clearCart');

postButn.addEventListener('click', async () => {
  const decision = confirm('Вы уверены, что хотите приобрести данные товары?');
  if (decision) {
    await fetch('/user/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    location.href = '/user';
  }
});

deleteButn.addEventListener('click', async () => {
  await fetch('/user/cart', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  location.href = '/user';
});
