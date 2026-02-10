import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { calculateDeliveryDate, deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

 export function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingProduct = getProduct(productId);
        
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const dateString = calculateDeliveryDate(deliveryOption);

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
                    ${matchingProduct.getPrice()}
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
                    <span class="delete-quantity-link link-primary delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
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
            const dateString = calculateDeliveryDate(deliveryOption);
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
            renderPaymentSummary();

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

            const cartItem = cart.find(item => item.productId === productId);
            const input = document.querySelector(`.quantity-input-${productId}`);

            input.value = cartItem.quantity;             
            document.querySelector(`.cart-item-container-${productId}`).classList.add('is-editing-quantity');
        })
    })

    document.querySelectorAll('.save-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const input = document.querySelector(`.quantity-input-${productId}`);
            const newQuantity = Number(input.value);
            
            if (newQuantity < 1 || newQuantity >= 1000) {
                alert('Product must be at least 1 and less than 1000');
                return
            } 
                updateQuantity(productId, newQuantity);
                document.querySelector(`.quantity-label-${productId}`).innerHTML = newQuantity   
                document.querySelector(`.cart-item-container-${productId}`).classList.remove('is-editing-quantity')

                updateCartQuantity();
                renderPaymentSummary();
        });
    });

    document.querySelectorAll('.delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
};