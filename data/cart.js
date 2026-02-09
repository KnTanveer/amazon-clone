export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [{
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '1'
    }]
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const previousTimeout = {};

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
          quantity: quantityValue,
          deliveryOptionId: '1'
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

  saveToStorage();
}

export function removeFromCart(productId) {
    let newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId != productId) {
            newCart.push(cartItem);
        }
    })

    cart = newCart;
    saveToStorage();
}

export function calculateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    }) 

    matchingItem.quantity = newQuantity;
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingcartItem;

  cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
          matchingcartItem = cartItem;
      }
  });

  matchingcartItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}