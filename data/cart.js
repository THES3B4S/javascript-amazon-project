export let cart = [
    {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
    },
    {
        id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
    }
];

export function addToCart(productId) {
    let matchingCartItem;
    const valueSelect = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    cart.forEach(cartItem =>{
        if (cartItem.id === productId){
            matchingCartItem = cartItem;
        }
    });
    if (matchingCartItem) {
        matchingCartItem.quantity += valueSelect;
    } else {
        cart.push(
            {
                id: productId,
                quantity: valueSelect
            }
        );
    }
}

export function removeFromCart(productId) {
    cart.splice(cart.findIndex(cartItem => cartItem.id === productId), 1);
}