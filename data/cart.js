export const cart = [];

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