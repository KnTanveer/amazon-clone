import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        let matchingProduct;
        
        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product; 
            }
        })
        
        const deliveryOptionId = cartItem.deliveryOptionId;
        let deliveryOption;

        deliveryOptions.forEach((option) => {
            if (option.id === deliveryOptionId) {
                deliveryOption = option;
            }
        });

        const today = dayjs();
        const deliveryDate = today.add( deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D')

        cartSummaryHTML += `
        <div class="cart-item-container cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
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
                ${deliveryOptionsHTML(matchingProduct ,cartItem)}
                </div>
            </div>
            </div>
        `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';
        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add( deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D')
            const priceString = deliveryOption.priceCents == 0 ? 'Free' : `${formatCurrency(deliveryOption.priceCents)}`
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId 

            html += `
                <div class="delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} - Shipping
                    </div>
                    </div>
                </div>
            `
        })
        return html;
    };

    document.querySelector('.order-summary').innerHTML = cartSummaryHTML;
    updateCartQuantity();

    document.querySelectorAll('.delete-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            document.querySelector(`.cart-item-container-${productId}`).remove();
            updateCartQuantity();
        });
    });

    function updateCartQuantity() {
        let cartQuantity = calculateCartQuantity();
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
            
            if (newQuantity < 1 || newQuantity >= 1000) {
                alert('Product must be at least 1 and less than 1000');
                return
            } 
                updateQuantity(productId, newQuantity);
                document.querySelector(`.cart-item-container-${productId}`).classList.remove('is-editing-quantity')
                document.querySelector(`.quantity-label-${productId}`).innerHTML = newQuantity   

                updateCartQuantity();
        });
    });

    document.querySelectorAll('.delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
        });
    });
}

renderOrderSummary();
