import {addToCart, cart, localCartSave, removeFromCart, updateCartQuantity} from "../data/cart.js";
import {getProduct, loadProducts, loadProductsFetch} from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import "../data/dayJsLocale.js"
import {deliveryOptions} from "../data/deliveryOptions.js";
import {centsToDollar} from "../utilities/moneyCurrency.js";
import {summaryCalc} from "../data/summary.js"
import {loadCart} from "../data/cart.js";
import {orderC} from "../data/orders.js";


function renderCheckoutPage() {

    summaryCalc();
    updateHeaderQuantity();

    cart.forEach(cartItem => {

        let matchingProduct = getProduct(cartItem.productId);

        document.querySelector('.order-summary').innerHTML +=
            `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Fecha de entrega: ${updateDeliveryOptions(cartItem)}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image" src="${matchingProduct.image}" alt="product image">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${matchingProduct.getPriceDollars()}
                </div>
                <div class="product-quantity">
                  <span>
                    Unidades: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Actualizar
                  </span>
                  <input class="quantity-input" hidden="hidden" type="number">
                  <span class="save-quantity-link link-primary" hidden="hidden" data-product-Id="${matchingProduct.id}">Guardar</span>
                  <span class="delete-quantity-link link-primary" data-product-Id="${matchingProduct.id}">
                    Borrar
                  </span>
                </div>
              </div>
              <div class="delivery-options">
                <div class="delivery-options-title">
                  Escoge opcion de envío:
                </div>
                ${generateDeliveryOptions(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `
    });

    function updateDeliveryOptions(cartItem, deliverOption) {
        const currentTime = dayjs();

        if (deliverOption) {
            for (let i = 1; i <= deliverOption; i++) {
                if (currentTime.add(i, 'days').format('dddd') === 'Domingo') {
                    deliverOption++;
                }
            }
            return currentTime.add(deliverOption, 'days').format('dddd, MMMM D')
        }

        let selectedOption = deliveryOptions.find(dOption => dOption.id === cartItem.idDelivery).deliveryDays;

        for (let i = 1; i <= selectedOption; i++) {
            if (currentTime.add(i, 'days').format('dddd') === 'Domingo') {
                selectedOption++;
            }
        }

        return currentTime.add(selectedOption, 'days').format('dddd, MMMM D')
    }

    document.querySelectorAll('.delivery-option').forEach(optionInput =>
        optionInput.addEventListener('click', e => {
            document.querySelectorAll(`.js-delivery-option-input-${optionInput.dataset.cartId}`).forEach(cartId => cartId.checked = false)
            cart.forEach(cartItem => {
                if (cartItem.productId === optionInput.dataset.cartId) {
                    cartItem.idDelivery = optionInput.dataset.deliverId;
                    document.querySelector(`.js-cart-item-container-${optionInput.dataset.cartId}`).firstElementChild.textContent = `Fecha de entrega: ${updateDeliveryOptions(cartItem)}`;
                }
            })
            e.currentTarget.firstElementChild.checked = true;
            summaryCalc()
            localCartSave()
        }))

    function generateDeliveryOptions(matchingProduct, cartItem) {
        let deliveryOptionsHTML = ""
        deliveryOptions.forEach(dOption => {
            const isCkeck = cartItem.idDelivery === dOption.id
            deliveryOptionsHTML +=
                `
        <div class="delivery-option" data-deliver-Id="${dOption.id}" data-cart-Id="${matchingProduct.id}">
          <input type="radio" ${isCkeck ? "checked" : ""} class="delivery-option-input js-delivery-option-input-${matchingProduct.id}" name="delivery-option-1-${matchingProduct.id}"">
          <div>
            <div class="delivery-option-date">
              ${updateDeliveryOptions(null, dOption.deliveryDays)}
            </div>
            <div class="delivery-option-price">
              ${dOption.priceCents === 0 ? "Gratis" : centsToDollar(dOption.priceCents)} - Envio
            </div>
          </div>
        </div>
    `
        })
        return deliveryOptionsHTML;
    }

    document.querySelector('.place-order-button').addEventListener('click', async () => {
        if (cart.length){ // si existe algun elemento en el carrito, ejecuta el bloque de abajo / truthy
        try{ // debido a que es posible que sea rechazado una request usamos try, esto evitara que el programa se detenga
            const response = await fetch('https://supersimplebackend.dev/orders', {
                method: 'POST', //metodo por el cual enviaremos el fetch GET/POST/UPDATE/DELETE
                headers: {'Content-Type': 'application/json'}, //tipo de contenido que vamos a enviar al backend
                body: JSON.stringify({cart: cart}) //la propiedad y la variable
            })
                const order = await response.json() //usamos await para esperar a que se genere el json
                orderC.createOrder(order); // llamamos al objeto y usamos el metodo createOrder y le pasamos la respuesta json que nos dio el response
                window.location.href = 'orders.html'; // cambiamos el link de la pagina por orders.html
        } catch (error) {console.log('error inesperado', error)} // en caso de que haya algun error ejecutar esta linea
        }
    })

    document.querySelectorAll(".delete-quantity-link").forEach((HTMLDelete) =>
        HTMLDelete.addEventListener("click", () => {
            removeFromCart(HTMLDelete.dataset.productId);
            document.querySelector(`.js-cart-item-container-${HTMLDelete.dataset.productId}`).remove();
            summaryCalc();
            updateHeaderQuantity();
        }))

    document.querySelectorAll(".update-quantity-link").forEach((HTMLUpdate) =>
        HTMLUpdate.addEventListener("click", () => {
            HTMLUpdate.previousElementSibling.firstElementChild.style.display = "none"; // Quantity display
            HTMLUpdate.style.display = "none"; // Quantity update
            HTMLUpdate.nextElementSibling.style.display = "initial"; // Quantity Input
            HTMLUpdate.nextElementSibling.nextElementSibling.style.display = "initial"; // Quantity Save
        }));

    document.querySelectorAll(".save-quantity-link").forEach((HTMLSave) => {
        HTMLSave.previousElementSibling.addEventListener("keydown", e => e.key === "Enter" ? saveQuantity(HTMLSave) : false)
        HTMLSave.addEventListener("click", () => saveQuantity(HTMLSave))
    });

    function saveQuantity(HTMLSave) {
        HTMLSave.style.display = "none"; // Quantity save
        HTMLSave.previousElementSibling.style.display = "none"; // Quantity input
        HTMLSave.previousElementSibling.previousElementSibling.style.display = "initial"; // Quantity update
        HTMLSave.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.style.display = "initial"; // Quantity display
        addToCart(HTMLSave.dataset.productId, Number(HTMLSave.previousElementSibling.value)); // productId, QuantityInput
        !!updateCartQuantity(HTMLSave.dataset.productId) === false ? document.querySelector(`.js-cart-item-container-${HTMLSave.dataset.productId}`).remove() : // si la funcion llamda nos devuelve false, ejecutar ternario ?
            HTMLSave.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.textContent = updateCartQuantity(HTMLSave.dataset.productId); // Quantity display update
        updateHeaderQuantity();
        summaryCalc();
    }

    function updateHeaderQuantity() { //actualiza el contenido HTML header
        document.querySelector('.return-to-home-link').textContent = `${updateCartQuantity()} items`;
    }

}

async function loadPage(){ // con async podemos convertir una funcion en una promesa y su codigo es lineal, primero se ejecutan en orden los awaits y despues el resto del codigo

    try{ // encapsulamos el bloque de codigo que posiblemente por errores de conexion o de parte del servidor puedan dar error
        await loadProductsFetch(); //await solo puede ser usado en promesas. ejecutar y esperar a que se comnplete la funcion asincronica para poder continuar con el resto del bloque

        await new Promise((resolve, reject) => { //creamos una promesa la cual nos devuelve un resolve o reject / el await espera a que se cumpla la promesa para continuar con el codigo
            loadCart(() =>{ // como se observa loadCart() acepta una function, se ejecutara el bloque de abajo
                resolve(); // indicamos el resolve para cumplir la promesa
            });
        });// si necesitamos acceder al valor del resolve podemos asignar la promesa a una variable, y la retornamos en la async function principal

    } catch (error){ //tomamos el error del bloque try en caso de que lo haya..
        console.log('unexpected error, please try again later')
    }

    renderCheckoutPage() //funcion local la cual ya se correra debido a que ya se ejecutaron todas las funciones asincronicas

    return 'all process complete' //retorna como resolve este string
}
loadPage().then(resolve => console.log(resolve)); //debido a que la function ahora es una promesa podemos usar .then para indicar que hacer despues de cumplida la promesa, en este caso solo mostraremos el resolve en consola: all process complete

/*
Promise.all([ //Promise.all crea un array de promesas las cuales se iran ejecutando en orden, los resolves o reject seran devueltos en forma de array
    loadProductsFetch(), //debido a que la funcion fetch ya en si es una promesa podemos retornarla y contara como una.
    new Promise((resolve, reject) => { //creamos una promesa la cual nos devuelve un resolve o reject
        loadCart(() =>{ // como se observa loadCart() acepta una function, se ejecutara el bloque de abajo
            resolve('all completed'); // indicamos el resolve para cumplir la promesa
        });
    })

]).then((resolves) => { // despues de ejecutada todas las promesas podemos hacer un siguiente paso con .then(resolves) que tambien nos entrega resolve o reject, esto en un array de resolves
    console.log(resolves); //mostramos en consola el array de resolves
    renderCheckoutPage(); // renderizamos el contenido debido a que ya esta almacenada la informacion en local y ninguna variable nos hara falta
});
 */

/*
new Promise((resolve, reject) => { //creamos una promesa la cual nos devuelve un resolve o reject
    loadProducts(() =>{ // llamamos la funcion loadProducts la cual acepta 1 parametro el cual es un callback, se ejecutara como ultima parte del codigo
        resolve('products loaded'); // como el callback esta a lo ultimo, se ejecuta este bloque una vez haya terminado, retorna resolve a la promesa
    });
}).then((resolve) =>{// usamos .then para realizar el siguiente paso una vez la primera promesa se haya cumplido / si queremos podemos recibir el valor del resolve anterior
    console.log(resolve) //aqui mostramos en consola el resolve que nos dio la primera promise: "products loaded"
    return new Promise((resolve, reject) => { // solo puede haber un resolve por promesa asi que lo que hacemos es crear otra promesa y retornarla, en ella va uno funcion la cual acepta un callback
        loadCart(() =>{ // como se observa acepta una function, se ejecutara el bloque de abajo
            resolve('all completed'); // indicamos el resolve para cumplir la promesa
        });
    })
}).then((resolve)=>{ // por ultimo volvemos a usar .then y recolectamos el resolve anterior
    console.log(resolve) // mostramos el resolve de la promesa anterior en consola: "all completed"
    renderCheckoutPage(); // renderizamos el contenido debido a que ya esta almacenada la informacion en local y ninguna variable nos hara falta
})
 */

/*
Promise.all([ //Promise.all crea un array de promesas las cuales se iran ejecutando en orden, los resolves o reject seran devueltos en forma de array
    new Promise((resolve, reject) => { //creamos una promesa la cual nos devuelve un resolve o reject
        loadProducts(() =>{ // llamamos la funcion loadProducts la cual acepta 1 parametro el cual es un callback, se ejecutara como ultima parte del codigo
            resolve('products loaded'); // como el callback esta a lo ultimo, se ejecuta este bloque una vez haya terminado, retorna resolve a la promesa
        });
    }),
    new Promise((resolve, reject) => { //creamos una promesa la cual nos devuelve un resolve o reject
        loadCart(() =>{ // como se observa loadCart() acepta una function, se ejecutara el bloque de abajo
            resolve('all completed'); // indicamos el resolve para cumplir la promesa
        });
    })

]).then((resolves) => { // despues de ejecutada todas las promesas podemos hacer un siguiente paso con .then(resolves) que tambien nos entrega resolve o reject, esto en un array de resolves
    console.log(resolves); //mostramos en consola el array de resolves
    renderCheckoutPage(); // renderizamos el contenido debido a que ya esta almacenada la informacion en local y ninguna variable nos hara falta
});
 */