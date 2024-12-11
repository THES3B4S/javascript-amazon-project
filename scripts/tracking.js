import {orderC} from "../data/orders.js";
import {getProduct, loadProductsFetch} from "../data/products.js";

loadProductsFetch().then(renderTrackingPage)

function renderTrackingPage() {

    const url = new URL(window.location.href);
    const product = getProduct(url.searchParams.get("productId"))
    const order = orderC.getOrderById(url.searchParams.get("orderId"));

    const matchingProduct = order.products.find(productDetails => productDetails.productId === product.id);

    document.querySelector('.order-tracking').innerHTML = `
        <a class="back-to-orders-link link-primary" href="orders.html">
          Ver ordenes
        </a>

        <div class="delivery-date">
          Entrega el ${orderC.reformatDayJs.deliveryDate(matchingProduct.estimatedDeliveryTime)}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Unidades: ${matchingProduct.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparando
          </div>
          <div class="progress-label current-status">
            Enviado
          </div>
          <div class="progress-label">
            Entregado
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
`;

}