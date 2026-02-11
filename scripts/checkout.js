import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
// import '../data/cart-oop.js';
// import '../data/cart-class.js';
// import '../backend/backend.js';

loadProducts(() => {
    renderOrderSummary();
    renderPaymentSummary();
})
