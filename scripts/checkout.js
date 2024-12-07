import {addToCart, cart, localCartSave, removeFromCart, updateCartQuantity} from "../data/cart.js";
import {products} from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import "../data/dayJsLocale.js"
import {deliveryOptions} from "../data/deliveryOptions.js";
import {centsToDollar} from "../utilities/moneyCurrency.js";
import {summaryCalc} from "../data/summary.js"

summaryCalc();
updateHeaderQuantity();

cart.forEach(cartItem =>{

    let matchingProduct = products.find(product => product.id === cartItem.id);

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
                  ${centsToDollar(matchingProduct.priceCents)}
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

    if (deliverOption){
        for (let i = 1 ; i <= deliverOption; i++) {
            if (currentTime.add(i, 'days').format('dddd') === 'Domingo') {
                deliverOption++;
            }
        }
        return currentTime.add(deliverOption, 'days').format('dddd, MMMM D')
    }

    let selectedOption = deliveryOptions.find(dOption=> dOption.id === cartItem.idDelivery).deliveryDays;

    for (let i = 1 ; i <= selectedOption; i++) {
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
            if (cartItem.id === optionInput.dataset.cartId) {
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
    deliveryOptions.forEach(dOption=>{
        const isCkeck = cartItem.idDelivery === dOption.id
        const currentTime = dayjs();
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

document.querySelectorAll(".delete-quantity-link").forEach((HTMLDelete)=>
    HTMLDelete.addEventListener("click", ()=>{
        removeFromCart(HTMLDelete.dataset.productId);
        document.querySelector(`.js-cart-item-container-${HTMLDelete.dataset.productId}`).remove();
        summaryCalc();
        updateHeaderQuantity();
    }))

document.querySelectorAll(".update-quantity-link").forEach((HTMLUpdate)=>
    HTMLUpdate.addEventListener("click", ()=>{
        HTMLUpdate.previousElementSibling.firstElementChild.style.display = "none"; // Quantity display
        HTMLUpdate.style.display = "none"; // Quantity update
        HTMLUpdate.nextElementSibling.style.display="initial"; // Quantity Input
        HTMLUpdate.nextElementSibling.nextElementSibling.style.display="initial"; // Quantity Save
    }));

document.querySelectorAll(".save-quantity-link").forEach((HTMLSave)=>{
    HTMLSave.previousElementSibling.addEventListener("keydown", e => e.key === "Enter" ? saveQuantity(HTMLSave) : false)
    HTMLSave.addEventListener("click", ()=>saveQuantity(HTMLSave))});

function saveQuantity(HTMLSave){
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

function updateHeaderQuantity(){ //actualiza el contenido HTML header
    document.querySelector('.return-to-home-link').textContent = `${updateCartQuantity()} items`;
}