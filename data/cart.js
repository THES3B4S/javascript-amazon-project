export let cart = JSON.parse(localStorage.getItem("cart"))

    if (!cart) {
        cart =
            [
                {
                    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                    quantity: 2,
                    idDelivery: '1',
                },
                {
                    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                    quantity: 1,
                    idDelivery: '2',
                }
            ];
    }


export function addToCart(productId, units) {

        const unitsLeft = units - updateCartQuantity(productId)
    let matchingCartItem; //variable para guardar el matching item que nos otorgara el bloque de abajo
    cart.forEach(cartItem =>{
        if (cartItem.productId === productId){ //si encuentras el product id en el carrito, asignalo a la var de arriba
            matchingCartItem = cartItem;
        }
    });
    if (matchingCartItem) { //ejecuta si el valor es truthy (existe el matchingCartItem)
            if ((matchingCartItem.quantity + unitsLeft) < 0){ //verifica si la suma de las unidades negativas ingresadas por el input son mayores a las habidas en el carrito, en caso de que sea asi
                removeFromCart(matchingCartItem.productId); // elimina el producto del carrito
            } else if (units === 0){ // en caso de que units(input) sea 0 no hacer nada
                return
            }else {
                matchingCartItem.quantity += unitsLeft; // de lo contrario concatena las unidades. se espera unidades positivas..
            }
    } else { // si el producto no se encontro en el carrito agrega el producto al carrito y asigna por defecto el envio gratis
        cart.push(
            {
                productId: productId,
                quantity: units,
                idDelivery: '1'
            }
        );
    }

    localCartSave(); //guarda en memoria local los cambios de la variable cart
}

export function removeFromCart(productId) { //funcion que acepta como parametro el product.id
    cart.splice(cart.findIndex(cartItem => cartItem.productId === productId), 1); //recorre el carrito y en el parametro 1 va el index, en este caso encontramos el index con findIndex(condicion). parametro 2 campos a borrar: 1

    localCartSave(); //guarda en memoria local los cambios de la variable cart
}

export function updateCartQuantity(productId){ // funcion que acepta como parametro el product.id
        let cartQuantity; // declaramos variable para poder retornarla y asignarla en bloques internos
        if (productId){ // si recibio un parametro truthy ejecuta el bloque de abajo
            cartQuantity = cart.find(cartItem => cartItem.productId === productId); // encuentra el carrito que coincida con el productid otorgado por el parametro
            if (cartQuantity) { // si el valor es truthy
                return cartQuantity.quantity; // devuelve la cantidad de productos encontrados en el carrito por productid
            } else { // en caso de no encontrar nada devolver false
                return false
            }
        }
        cartQuantity = cart.reduce((acc, cur) => acc + cur.quantity, 0); // hace una suma de todos los productos del carrito en caso de que no se pase ningun parametro
        return cartQuantity // retorna la suma total del carrito
}

export function localCartSave(){ //funcion para pasar el objeto cart como un JSON string, para despues guardarlo en local, cuando lo usemos tenemos que hacer un JSON.parse
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function loadCart(Fn){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://supersimplebackend.dev/cart');
    xhr.send()
    xhr.addEventListener('load', () => {
        console.log(xhr.response)
        Fn()
    })
}