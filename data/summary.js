import {cart, updateCartQuantity} from "./cart.js";
import {centsToDollar} from "../utilities/moneyCurrency.js";
import {getProduct} from "./products.js";
import {deliveryOptions} from "./deliveryOptions.js";

export function summaryCalc(){
    let summaryProducts = 0;
    cart.forEach(cartItem => {
        const matchingProduct = getProduct(cartItem.productId);
        summaryProducts += (matchingProduct.priceCents * cartItem.quantity);
    })


    let matchingDeliverys = []
    cart.forEach(cartItem => {
        matchingDeliverys.push(deliveryOptions.find(dOption=> dOption.id === cartItem.idDelivery))
    })
    const summaryShipping = matchingDeliverys.reduce((previousValue, currentValue) => previousValue + currentValue.priceCents, 0)

    const sinIVA = summaryProducts + summaryShipping
    const IVA = sinIVA * 0.19
    const totalNeto = sinIVA + IVA

    const summaryValues = [summaryProducts, summaryShipping, sinIVA, IVA, totalNeto]

    document.querySelector('.payment-summary-row').firstElementChild.textContent = `Productos (${updateCartQuantity()}):`
    document.querySelectorAll('.payment-summary-money').forEach((moneyCamp, i) => {
        moneyCamp.textContent = centsToDollar(summaryValues[i])
    })
}