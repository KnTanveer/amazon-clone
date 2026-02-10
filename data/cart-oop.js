function Cart(localStorageKey) {
    const cart = {
        cartItems: undefined,
    
        loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));
    
        if (!this.cartItems) {
            this.cartItems = [{
                productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                quantity: 1,
                deliveryOptionId: '1'
            }]
            }
        },
    
        saveToStorage() {
            localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
        },
        
        previousTimeout: {},

        addToCart(productId) {
            const quantityValue = Number(document.querySelector('.product-quantity-selector-' + productId).value);
            const addedButton = document.querySelector('.label-added-' + productId);
            let matchingcartItem;
            
            this.cartItems.forEach((cartItem) => {
                if (productId === cartItem.productId) {
                    matchingcartItem = cartItem;
                }
            });
            
            if (matchingcartItem) {
                matchingcartItem.quantity += quantityValue;
            } else {
                this.cartItems.push({
                    productId,
                    quantity: quantityValue,
                    deliveryOptionId: '1'
                });
            }
            
            addedButton.classList.add('added-to-cart-show')
            
            if (this.previousTimeout[productId]) {
                clearTimeout(this.previousTimeout[productId])
            }
            
            let addedTimeout = setTimeout(() => {
                addedButton.classList.remove('added-to-cart-show')
            },2000)
            
            this.previousTimeout[productId] = addedTimeout;
            
            this.saveToStorage();
        },
        removeFromCart(productId) {
            let newCart = [];
            
            this.cartItems.forEach((cartItem) => {
                if (cartItem.productId != productId) {
                    newCart.push(cartItem);
                }
            })
            
            this.cartItems = newCart;
            this.saveToStorage();
        },
        
        calculateCartQuantity() {
            let cartQuantity = 0;
            this.cartItems.forEach((cartItem) => {
                cartQuantity += cartItem.quantity;
            });
            return cartQuantity;
        },
        
        updateQuantity(productId, newQuantity) {
            let matchingItem;
            
            this.cartItems.forEach((cartItem) => {
                if (productId === cartItem.productId) {
                    matchingItem = cartItem;
                }
            }) 
            
            matchingItem.quantity = newQuantity;
            this.saveToStorage();
        },
        
        updateDeliveryOption(productId, deliveryOptionId) {
            let matchingcartItem;
            
            this.cartItems.forEach((cartItem) => {
                if (productId === cartItem.productId) {
                    matchingcartItem = cartItem;
                }
            });
            
            matchingcartItem.deliveryOptionId = deliveryOptionId;
            
            this.saveToStorage();
        }
    };

    return cart;
}

const cart = Cart('cart-oop');
const buisnessCart = Cart('cart-buisness')

cart.loadFromStorage();
