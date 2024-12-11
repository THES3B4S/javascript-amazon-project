import {centsToDollar} from "../utilities/moneyCurrency.js";
import "./dayJsLocale.js"
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

class Order {
    orders = [];
    #localStorageKey;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
    }

    createOrder(orderDetails) {
        this.orders.unshift({
            id: orderDetails.id,
            orderTime: orderDetails.orderTime,
            totalCostCents: orderDetails.totalCostCents,
            products: orderDetails.products,
        })
        this.saveOrderToLocal();
    }

    getOrderById(id) {
        return this.orders.find(order => order.id === id);
    }

    getTotalCostDollars(orderId) {
        if (orderId){
            return centsToDollar(this.orders.find((order) => order.id == orderId).totalCostCents);
        }
        return centsToDollar(this.orders.reduce((acc, curr)=> acc + curr.totalCostCents, 0))
    }

    saveOrderToLocal(){
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.orders));
    }

    loadOrderFromLocal(){
        if (localStorage.getItem(this.#localStorageKey)){
            this.orders = JSON.parse(localStorage.getItem(this.#localStorageKey))
        }else {
            this.orders = [];
        }
    }

    reformatDayJs = {
        orderDate(date){
            return dayjs(date).format('YYYY-MM-DD HH:mm')
        },
        deliveryDate(date){
            return dayjs(date).format('dddd, MMMM D')
        }
    }
}

export const orderC = new Order('order-Class');
orderC.loadOrderFromLocal()
