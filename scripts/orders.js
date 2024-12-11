import {orderC} from "../data/orders.js";
import {getProduct, loadProductsFetch, products} from "../data/products.js";
import {addToCart, updateCartQuantity} from "../data/cart.js";

loadProductsFetch().then(renderOrderPage)

function renderOrderPage() {
    let orderContainerHTML = ''
    orderC.orders.forEach(order => {
        orderContainerHTML += `
        <div class="order-container">

          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Fecha orden:</div>
                <div>${orderC.reformatDayJs.orderDate(order.orderTime)}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>${orderC.getTotalCostDollars(order.id)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          ${orderProductDetails(order.products, order.id)}
        </div>
    `
    })

    function orderProductDetails(orderProducts, orderId) {
        let productDetailsHTML= ''
        orderProducts.forEach(product => {
            const matchingProduct = getProduct(product.productId)
            productDetailsHTML += `
            <div class="order-details-grid">
            <div class="product-image-container">
              <img src="${matchingProduct.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                Entrega el: ${orderC.reformatDayJs.deliveryDate(product.estimatedDeliveryTime)}
              </div>
              <div class="product-quantity">
                Unidades: ${product.quantity}
              </div>
              <button class="buy-again-button button-primary" data-product-Id="${product.productId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message"">Compra de nuevo</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${orderId}&productId=${matchingProduct.id}">
                <button class="track-package-button button-secondary">
                  Localizar paquete
                </button>
              </a>
            </div>
          </div>
            `
        })

        return productDetailsHTML
    }


    document.querySelector('.orders-grid').innerHTML = orderContainerHTML;

    document.querySelectorAll('.buy-again-button').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId
            addToCart(productId,1)
            document.querySelector('.cart-quantity').textContent = updateCartQuantity()
        })
    })
}

