export let cart = [];

export function addToCart(productId) {
  const quantityValue = Number(document.querySelector('.product-quantity-selector-' + productId).value);
  const addedButton = document.querySelector('.label-added-' + productId);
  let matchingcartItem;

  cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
          matchingcartItem = cartItem;
      }
  });

  if (matchingcartItem) {
      matchingcartItem.quantity += quantityValue;
  } else {
      cart.push({
          productId,
          quantity: quantityValue
      });
  }

  addedButton.classList.add('added-to-cart-show')

  if (previousTimeout[productId]) {
    clearTimeout(previousTimeout[productId])
  }

  let addedTimeout = setTimeout(() => {
    addedButton.classList.remove('added-to-cart-show')
  },2000)

  previousTimeout[productId] = addedTimeout;
}