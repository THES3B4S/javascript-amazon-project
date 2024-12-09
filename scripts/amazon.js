import {products} from "../data/products.js"
import {addToCart, updateCartQuantity} from "../data/cart.js"

document.querySelector(".cart-quantity").textContent = updateCartQuantity();

products.forEach(product => {
    document.querySelector(".products-grid").innerHTML += `
    <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}" alt="product-image">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStartsUrl()}" alt="rating stars">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPriceDollars()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          
          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png" alt="added">
            Agregado
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-Id="${product.id}">
            Agregar al carrito
          </button>
        </div>`
})

document.querySelectorAll(".js-add-to-cart").forEach(button => {
    let addedMessageTimeoutId;
    button.addEventListener("click", () => {
        const {productId} = button.dataset;
        const valueSelect = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

        addedMessageTimeoutId = addedDisplay(addedMessageTimeoutId, productId);
        addToCart(productId, valueSelect);
        document.querySelector(".cart-quantity").textContent = updateCartQuantity();
    })
})

function addedDisplay (addedMessageTimeoutId, productId){
    if (addedMessageTimeoutId) {
        clearTimeout(addedMessageTimeoutId);
    }
    const aggNoti = document.querySelector(`.js-added-to-cart-${productId}`);
    aggNoti.style.opacity = "1";
    const ocultarNoti = setTimeout(()=>aggNoti.style.opacity = "0", 700)

    return ocultarNoti;
}