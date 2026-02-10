import { addToCart, cart, loadFromStorage } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

describe('test suite: addToCart', () => {
    it('adds an existing product to the cart', () => {
        const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
        document.querySelector('.test-container').innerHTML = `
            <input class="product-quantity-selector-${productId}" value="1"/>
            <div class="label-added-${productId}"></div>
        `;

        spyOn(localStorage, 'setItem')
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: productId,
                quantity: 1,
                deliveryOptionId: '1'
            }])
        });

        loadFromStorage();
        addToCart(productId);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart[0].quantity).toEqual(2);
    });

    it('adds a new product to the cart', () => {
        const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
        document.querySelector('.test-container').innerHTML = `
            <input class="product-quantity-selector-${productId}" value="1"/>
            <div class="label-added-${productId}"></div>
        `; 

        spyOn(localStorage, 'setItem') 
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });

        loadFromStorage();
        addToCart(productId);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart[0].quantity).toEqual(1);
    });
});