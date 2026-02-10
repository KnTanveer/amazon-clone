import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';

describe('test suite: renderOrderSummary', () => {
    ImageTrack('displays the cart', () => {
        document.querySelector('.test-container').innerHTML = `
            <div class="order-summary"></div>
        `;

    });
});