class Cart {
    #localStorageKey;
    cartItems = [];

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
    }

    addToCart(productId, units) {
        const unitsLeft = units - this.updateCartQuantity(productId)
        let matchingCartItem; //variable para guardar el matching item que nos otorgara el bloque de abajo
        this.cartItems.forEach(cartItem => {
            if (cartItem.productId === productId) { //si encuentras el product id en el carrito, asignalo a la var de arriba
                matchingCartItem = cartItem;
            }
        });
        if (matchingCartItem) { //ejecuta si el valor es truthy (existe el matchingCartItem)
            if ((matchingCartItem.quantity + unitsLeft) < 0) { //verifica si la suma de las unidades negativas ingresadas por el input son mayores a las habidas en el carrito, en caso de que sea asi
                this.removeFromCart(matchingCartItem.productId); // elimina el producto del carrito
            } else if (units === 0) { // en caso de que units(input) sea 0 no hacer nada
                return
            } else {
                matchingCartItem.quantity += unitsLeft; // de lo contrario concatena las unidades. se espera unidades positivas..
            }
        } else { // si el producto no se encontro en el carrito agrega el producto al carrito y asigna por defecto el envio gratis
            this.cartItems.push(
                {
                    productId: productId,
                    quantity: units,
                    idDelivery: '1'
                }
            );
        }

        this.saveToStorage(); //guarda en memoria local los cambios de la variable cart
    }



    removeFromCart(productId) { //funcion que acepta como parametro el product.id
        this.cartItems.splice(this.cartItems.findIndex(cartItem => cartItem.productId === productId), 1); //recorre el carrito y en el parametro 1 va el index, en este caso encontramos el index con findIndex(condicion). parametro 2 campos a borrar: 1

        this.saveToStorage(); //guarda en memoria local los cambios de la variable cart
    }



    updateCartQuantity(productId) { // funcion que acepta como parametro el product.id
        let cartQuantity; // declaramos variable para poder retornarla y asignarla en bloques internos
        if (productId) { // si recibio un parametro truthy ejecuta el bloque de abajo
            cartQuantity = this.cartItems.find(cartItem => cartItem.productId === productId); // encuentra el carrito que coincida con el productid otorgado por el parametro
            if (cartQuantity) { // si el valor es truthy
                return cartQuantity.quantity; // devuelve la cantidad de productos encontrados en el carrito por productid
            } else { // en caso de no encontrar nada devolver false
                return false
            }
        }
        cartQuantity = this.cartItems.reduce((acc, cur) => acc + cur.quantity, 0); // hace una suma de todos los productos del carrito en caso de que no se pase ningun parametro
        return cartQuantity // retorna la suma total del carrito
    }



    loadFromStorage() { //funcion para cargar los valores almacenados en localstorage
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)); // asignamos a cartItems los valores del JSON usando parse

        if (!this.cartItems) {
            this.cartItems =
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
    }



    saveToStorage() { //funcion para pasar el objeto cart como un JSON string, para despues guardarlo en local, cuando lo usemos tenemos que hacer un JSON.parse
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }
}

const cart = new Cart('cart-class')
const businessCart = new Cart('cart-business')

cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 6)
cart.saveToStorage()
cart.loadFromStorage()

businessCart.addToCart("15b6fc6f-327a-4ec4-896f-486349e85a3d", 3)
businessCart.saveToStorage()
businessCart.loadFromStorage()


console.log(cart.cartItems);
console.log(businessCart.cartItems)
