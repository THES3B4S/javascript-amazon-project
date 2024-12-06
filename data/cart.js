export let cart = JSON.parse(localStorage.getItem("cart"))

    if (!cart) {
        cart =
            [
                {
                    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                    quantity: 2,
                },
                {
                    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                    quantity: 1,
                }
            ];
    }


export function addToCart(productId, units) {
    let matchingCartItem;
    cart.forEach(cartItem =>{
        if (cartItem.id === productId){
            matchingCartItem = cartItem;
        }
    });
    if (matchingCartItem) {
        matchingCartItem.quantity += units;
    } else {
        cart.push(
            {
                id: productId,
                quantity: units
            }
        );
    }

    localCartSave();
}

export function removeFromCart(productId) {
    cart.splice(cart.findIndex(cartItem => cartItem.id === productId), 1);

    localCartSave();
}

export function updateCartQuantity(productId){
        let cartQuantity;
        if (productId){
            cartQuantity = cart.find(cartItem => cartItem.id === productId);
            return cartQuantity.quantity;
        }
        cartQuantity = cart.reduce((acc, cur) => acc + cur.quantity, 0);
        return cartQuantity
}

function localCartSave(){
    localStorage.setItem("cart", JSON.stringify(cart));
}