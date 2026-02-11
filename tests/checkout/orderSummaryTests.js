import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { cart, loadFromStorage } from '../../data/cart.js';
import { loadProducts } from '../../data/products.js';

describe('test suite: renderOrderSummary', () => {
    let productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    let productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

    beforeAll((done) => {
        loadProducts(() => {
            done();
        });
    });

    beforeEach(() => {
        document.querySelector('.test-container').innerHTML = `
            <div class="order-summary"></div>
            <div class="payment-summary"></div>
            <div class="checkout-header-middle-section">
                Checkout (<a class="return-to-home-link" href="index.html"> </a>)
            </div>
        `;

        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: productId1,
                quantity: 1,
                deliveryOptionId: '1'
             }, {
                productId: productId2,
                quantity: 2,
                deliveryOptionId: '2'
             }])
        });
        loadFromStorage();

        renderOrderSummary();
    });

    afterAll(() => {
        document.querySelector('.test-container').innerHTML = '';
    });

    it('displays the cart', () => {
        expect(
            document.querySelectorAll('.cart-item-container').length
        ).toEqual(2);
    });

    it('removes a product', () => {
        document.querySelector(`.delete-link-${productId1}`).click();
        expect(
            document.querySelectorAll('.cart-item-container').length
        ).toEqual(1);
        expect(
            document.querySelector(`.cart-item-container-${productId1}`)
        ).toEqual(null);
        expect(
            document.querySelector(`.cart-item-container-${productId2}`)
        ).not.toEqual(null);
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productId2);
    });
});