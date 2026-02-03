import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct;
    
    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product; 
        }
    })
    
    cartSummaryHTML += `
    <div class="cart-item-container cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Update
                </span>
                <input type="number" class="quantity-input quantity-input-${matchingProduct.id}">
                <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Save
                </span>
                <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            <div class="delivery-option">
                <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                    FREE Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                    $4.99 - Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Monday, June 13
                </div>
                <div class="delivery-option-price">
                    $9.99 - Shipping
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    `;
});

document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        updateCartQuantity()

        document.querySelector(`.cart-item-container-${productId}`).remove();
        updateCartQuantity();
    });
});

function updateCartQuantity() {
    let cartQuantity = calculateCartQuantity();

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity
    });
  
  document.querySelector('.return-to-home-link').innerHTML = `${cartQuantity} items`;
}

document.querySelectorAll('.update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        cart.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                document.querySelector(`.quantity-input-${productId}`).textContent = cartItem.quantity;
            }
        })
        document.querySelector(`.cart-item-container-${productId}`).classList.add('is-editing-quantity');
    })
})

document.querySelectorAll('.save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        
        const newQuantity = Number(document.querySelector(`.quantity-input-${productId}`).value); 
        document.querySelector(`.quantity-input-${productId}`).textContent = newQuantity;
        
        if (newQuantity < 0 || newQuantity >= 1000) {
            alert('Product must be at least 1 and less than 1000');
            return
        } 
            updateQuantity(productId, newQuantity);
            document.querySelector(`.cart-item-container-${productId}`).classList.remove('is-editing-quantity')
            document.querySelector(`.quantity-label-${productId}`).innerHTML = newQuantity   

            updateCartQuantity();
    })
})
