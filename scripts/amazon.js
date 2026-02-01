import { cart } from '../data/cart.js'
import { products } from '../data/products.js';

let productsHTML = '';

products.forEach((product) => {
    productsHTML += ` 
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container">
            <select class="product-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart label-added-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`
});

document.querySelector('.products-grid').innerHTML = productsHTML;

let previousTimeout = {};
document.querySelectorAll('.add-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantityValue = Number(document.querySelector('.product-quantity-selector-' + productId).value);
        const addedButton = document.querySelector('.label-added-' + productId);

        let matchingItem;

        cart.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });

        if (matchingItem) {
            matchingItem.quantity += quantityValue;
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

        console.log(cart);
    });
})