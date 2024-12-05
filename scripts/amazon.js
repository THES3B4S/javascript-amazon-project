import {products} from "../data/products.js"
import {cart} from  "../data/cart.js"

let productosHTML= ""
products.forEach(product => {
    productosHTML += `
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
              src="images/ratings/rating-${product.rating.stars * 10}.png" alt="rating stars">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed(2)}
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

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png" alt="added">
            Agregado
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-productid="${product.id}">
            Agregar al carrito
          </button>
        </div>`
})

document.querySelector(".products-grid").innerHTML = productosHTML;

document.querySelectorAll(".js-add-to-cart").forEach(button => {
    let addedMessageTimeoutId;
    button.addEventListener("click", () => {
        let matchingItem;
        const valueSelect = Number(document.querySelector(`.js-quantity-selector-${button.dataset.productid}`).value);
        cart.forEach(item =>{
            if (item.id === button.dataset.productid){
                matchingItem = item;
            }
        });
        if (matchingItem) {
            matchingItem.quantity += valueSelect;
        } else {
            cart.push(
                {
                    id: button.dataset.productid,
                    quantity: valueSelect
                }
            );
        }
        let cartQuantity = 0;
        cart.forEach(item =>{
            cartQuantity += item.quantity;
        });

        document.querySelector(".cart-quantity").textContent = cartQuantity;

        if (addedMessageTimeoutId) {
            clearTimeout(addedMessageTimeoutId);
        }
        const aggNoti = document.querySelector(`.js-added-to-cart-${button.dataset.productid}`);
        aggNoti.style.opacity = "1";
        const ocultarNoti = setTimeout(()=>aggNoti.style.opacity = "0", 700)

        addedMessageTimeoutId = ocultarNoti;
    })
})