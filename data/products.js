import {centsToDollar} from "../utilities/moneyCurrency.js";

export function getProduct (productId){
    return products.find(product => product.id === productId)
}

class Product {
    id;
    image;
    name;
    rating;
    priceCents;
    keywords;

    constructor(productDetails) {
        this.id = productDetails.id;
        this.image = productDetails.image;
        this.name = productDetails.name;
        this.rating = productDetails.rating;
        this.priceCents = productDetails.priceCents;
        this.keywords = productDetails.keywords;
    }

    getKeyWordsString(){
        return this.keywords.join('').replace(/\s+/g, '');
    }

    getStartsUrl(){
        return `images/ratings/rating-${this.rating.stars * 10}.png`
    }

    getPriceDollars(){
        return centsToDollar(this.priceCents)
    }

    extraInfoHTML(){
        return ''
    }
}

class Clothing extends Product {
    sizeChartLink;

    constructor(productDetails) {
        super(productDetails);

        this.sizeChartLink = productDetails.sizeChartLink;
    }

    extraInfoHTML(){
        // super.extraInfoHTML()
        return `<a href="${this.sizeChartLink}" target="_blank">Tallas</a>`
    }
}

class Appliance extends Product {
    instructionsLink;
    warrantyLink;

    constructor(productDetails) {
        super(productDetails);

        this.instructionsLink = productDetails.instructionsLink;
        this.warrantyLink = productDetails.warrantyLink;
    }

    extraInfoHTML(){
        return `<a href="${this.instructionsLink}" target="_blank">Instrucciones</a>
                <a href="${this.warrantyLink}" target="_blank">Garantia</a>`
    }
}

export let products = [];

export function loadProductsFetch(){
    const promise = fetch('https://supersimplebackend.dev/products').then(response => response.json()).then(data => {
        products = data.map(productDetails => {
            if (productDetails.type === 'clothing'){
                return new Clothing(productDetails);
            } else if (productDetails.keywords.indexOf('appliances') !== -1) {
                return new Appliance(productDetails);
            } else {
                return new Product(productDetails);
            }
        });
    })//catch(error =>{ //podemos directamente tomar el error del fetch o podemos tambien tomarlo en el async await con un try catch
        // console.log('unexpected error, please try again later')
        //})
    return promise
}

export function loadProducts(Fn){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://supersimplebackend.dev/products');
    xhr.send()
    xhr.addEventListener('load', () => {
        products = JSON.parse(xhr.response).map(productDetails => {
            if (productDetails.type === 'clothing'){
                return new Clothing(productDetails);
            } else if (productDetails.keywords.indexOf('appliances') !== -1) {
                return new Appliance(productDetails);
            } else {
                return new Product(productDetails);
            }
        })
        Fn() //callback
    })

    xhr.addEventListener('error', error => {
        console.log('unexpected error, please try again later');
    })
}



/*
export const products = [
    {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        image: "images/products/athletic-cotton-socks-6-pairs.jpg",
        name: "Calcetines Atléticos de Algodón Negro y Gris - 6 Pares",
        rating: {
            stars: 4.5,
            count: 87
        },
        priceCents: 1090,
        keywords: [
            "calcetines",
            "deportes",
            "ropa"
        ]
    },
    {
        id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        image: "images/products/intermediate-composite-basketball.jpg",
        name: "Balón de Baloncesto Tamaño Intermedio",
        rating: {
            stars: 4,
            count: 127
        },
        priceCents: 2095,
        keywords: [
            "deportes",
            "balones de baloncesto"
        ]
    },
    {
        id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
        image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        name: "Camiseta de Algodón Lisa para Adultos - 2 Paquetes",
        rating: {
            stars: 4.5,
            count: 56
        },
        priceCents: 799,
        keywords: [
            "camisetas",
            "ropa",
            "hombres"
        ],
        type: "ropa",
        sizeChartLink: "images/clothing-size-chart.png"
    },
    {
        id: "54e0eccd-8f36-462b-b68a-8182611d9add",
        image: "images/products/black-2-slot-toaster.jpg",
        name: "Tostadora de 2 Ranuras - Negra",
        rating: {
            stars: 5,
            count: 2197
        },
        priceCents: 1899,
        keywords: [
            "tostadora",
            "cocina",
            "electrodomesticos"
        ],
        instructionsLink: "images/appliance-instructions.png",
        warrantyLink: "images/appliance-warranty.png"
    },
    {
        id: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
        image: "images/products/6-piece-white-dinner-plate-set.jpg",
        name: "Juego de Platos para la Cena de 6 Piezas - Blanco",
        rating: {
            stars: 4,
            count: 37
        },
        priceCents: 2067,
        keywords: [
            "platos",
            "cocina",
            "comedor"
        ]
    },
    {
        id: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
        image: "images/products/6-piece-non-stick-baking-set.webp",
        name: "Juego de Hornear de Acero Carbono Antiadherente de 6 Piezas",
        rating: {
            stars: 4.5,
            count: 175
        },
        priceCents: 3499,
        keywords: [
            "cocina",
            "utensilios de cocina"
        ]
    },
    {
        id: "dd82ca78-a18b-4e2a-9250-31e67412f98d",
        image: "images/products/plain-hooded-fleece-sweatshirt-yellow.jpg",
        name: "Sudadera con Capucha de Forro Polar Lisa",
        rating: {
            stars: 4.5,
            count: 317
        },
        priceCents: 2400,
        keywords: [
            "sudaderas",
            "suéteres",
            "ropa"
        ]
    },
    {
        id: "77919bbe-0e56-475b-adde-4f24dfed3a04",
        image: "images/products/luxury-tower-set-6-piece.jpg",
        name: "Juego de Toallas de Lujo - Gris Grafito",
        rating: {
            stars: 4.5,
            count: 144
        },
        priceCents: 3599,
        keywords: [
            "baño",
            "lavabo",
            "aseo",
            "toallas",
            "toallas de baño"
        ]
    },
    {
        id: "3fdfe8d6-9a15-4979-b459-585b0d0545b9",
        image: "images/products/liquid-laundry-detergent-plain.jpg",
        name: "Detergente Líquido para Ropa, 110 Cargas, 82.5 Fl Oz",
        rating: {
            stars: 4.5,
            count: 305
        },
        priceCents: 2899,
        keywords: [
            "baño",
            "limpieza"
        ]
    },
    {
        id: "58b4fc92-e98c-42aa-8c55-b6b79996769a",
        image: "images/products/knit-athletic-sneakers-gray.jpg",
        name: "Zapatillas Deportivas de Punto Impermeables - Gris",
        rating: {
            stars: 4,
            count: 89
        },
        priceCents: 3390,
        keywords: [
            "zapatos",
            "zapatillas de correr",
            "calzado"
        ]
    },
    {
        id: "5968897c-4d27-4872-89f6-5bcb052746d7",
        image: "images/products/women-chiffon-beachwear-coverup-black.jpg",
        name: "Cobertura de Playa de Chiffón para Mujeres - Negra",
        rating: {
            stars: 4.5,
            count: 235
        },
        priceCents: 2070,
        keywords: [
            "bata",
            "traje de baño",
            "natación",
            "baño",
            "ropa"
        ],
        type: "ropa",
        sizeChartLink: "images/clothing-size-chart.png"
    },
    {
        id: "aad29d11-ea98-41ee-9285-b916638cac4a",
        image: "images/products/round-sunglasses-black.jpg",
        name: "Gafas de Sol Redondas",
        rating: {
            stars: 4.5,
            count: 30
        },
        priceCents: 1560,
        keywords: [
            "accesorios",
            "gafas"
        ]
    },
    {
        id: "04701903-bc79-49c6-bc11-1af7e3651358",
        image: "images/products/women-beach-sandals.jpg",
        name: "Sandalias de Doble Correa con Hebilla para Mujeres - Color Cuero",
        rating: {
            stars: 4.5,
            count: 562
        },
        priceCents: 2499,
        keywords: [
            "calzado",
            "sandalias",
            "mujeres",
            "playa",
            "verano"
        ]
    },
    {
        id: "901eb2ca-386d-432e-82f0-6fb1ee7bf969",
        image: "images/products/blackout-curtain-set-beige.webp",
        name: "Juego de Cortinas Opacas 4-Paquetes - Beige",
        rating: {
            stars: 4.5,
            count: 232
        },
        priceCents: 4599,
        keywords: [
            "dormitorio",
            "cortinas",
            "hogar"
        ]
    },
    {
        id: "82bb68d7-ebc9-476a-989c-c78a40ee5cd9",
        image: "images/products/men-slim-fit-summer-shorts-gray.jpg",
        name: "Pantalones Cortos de Verano Slim-Fit para Hombres",
        rating: {
            stars: 4,
            count: 160
        },
        priceCents: 1699,
        keywords: [
            "pantalones cortos",
            "ropa",
            "hombres"
        ]
    },
    {
        id: "c2a82c5e-aff4-435f-9975-517cfaba2ece",
        image: "images/products/electric-glass-and-steel-hot-water-kettle.webp",
        name: "Hervidor Eléctrico de Agua para Té de Vidrio y Acero - 1.7 Litros",
        rating: {
            stars: 5,
            count: 846
        },
        priceCents: 3074,
        keywords: [
            "hervidor de agua",
            "electrodomesticos",
            "cocina"
        ]
    },
    {
        id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
        image: "images/products/facial-tissue-2-ply-18-boxes.jpg",
        name: "Pañuelos Ultra Suaves de 2 Capas - Paquete de 18",
        rating: {
            stars: 4,
            count: 99
        },
        priceCents: 2374,
        keywords: [
            "kleenex",
            "pañuelos",
            "cocina",
            "caja de pañuelos",
            "servilletas"
        ]
    },
    {
        id: "a82c6bac-3067-4e68-a5ba-d827ac0be010",
        image: "images/products/straw-sunhat.webp",
        name: "Sombrero de Paja para el Sol",
        rating: {
            stars: 4,
            count: 215
        },
        priceCents: 2200,
        keywords: [
            "sombreros",
            "sombreros de paja",
            "verano",
            "ropa"
        ]
    },
    {
        id: "e4f64a65-1377-42bc-89a5-e572d19252e2",
        image: "images/products/sky-flower-stud-earrings.webp",
        name: "Aretes de Estrella de Plata Esterlina",
        rating: {
            stars: 4.5,
            count: 52
        },
        priceCents: 1799,
        keywords: [
            "joyería",
            "accesorios",
            "mujeres"
        ]
    },
    {
        id: "b0f17cc5-8b40-4ca5-9142-b61fe3d98c85",
        image: "images/products/women-stretch-popover-hoodie-black.jpg",
        name: "Sudadera Estirable con Capucha para Mujeres",
        rating: {
            stars: 4.5,
            count: 2465
        },
        priceCents: 1374,
        keywords: [
            "con capucha",
            "sudaderas",
            "suéteres",
            "mujeres",
            "ropa"
        ],
        type: "ropa",
        sizeChartLink: "images/clothing-size-chart.png"
    },
    {
        id: "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a",
        image: "images/products/bathroom-rug.jpg",
        name: "Alfombra de Baño - 20 x 31 Pulgadas - Gris",
        rating: {
            stars: 4.5,
            count: 119
        },
        priceCents: 1250,
        keywords: [
            "alfombra de baño",
            "baño",
            "hogar"
        ]
    },
    {
        id: "4f4fbcc2-4e72-45cc-935c-9e13d79cc57f",
        image: "images/products/women-knit-ballet-flat-black.jpg",
        name: "Zapato de Ballet Tejido para Mujeres",
        rating: {
            stars: 4,
            count: 326
        },
        priceCents: 2640,
        keywords: [
            "zapatos",
            "bailarinas",
            "mujeres",
            "calzado"
        ]
    },
    {
        id: "8b5a2ee1-6055-422a-a666-b34ba28b76d4",
        image: "images/products/men-golf-polo-t-shirt-blue.jpg",
        name: "Camiseta Polo de Golf Regular-Fit de Secado Rápido para Hombres",
        rating: {
            stars: 4.5,
            count: 2556
        },
        priceCents: 1599,
        keywords: [
            "camisetas",
            "camisas",
            "ropa",
            "hombres"
        ],
        type: "ropa",
        sizeChartLink: "images/clothing-size-chart.png"
    },
    {
        id: "b86ddc8b-3501-4b17-9889-a3bad6fb585f",
        image: "images/products/trash-can-with-foot-pedal-50-liter.jpg",
        name: "Basurero con Pedal - Acero Inoxidable Cepillado",
        rating: {
            stars: 4.5,
            count: 2286
        },
        priceCents: 8300,
        keywords: [
            "basura",
            "botes",
            "cans",
            "cocina"
        ]
    },
    {
        id: "19c6a64a-5463-4d45-9af8-e41140a4100c",
        image: "images/products/duvet-cover-set-blue-twin.jpg",
        name: "Juego de Funda de Edredón con Cierre de Cremallera",
        rating: {
            stars: 4,
            count: 456
        },
        priceCents: 2399,
        keywords: [
            "dormitorio",
            "sábanas",
            "funda de cama",
            "ropa de cama",
            "hogar"
        ]
    },
    {
        id: "d2785924-743d-49b3-8f03-ec258e640503",
        image: "images/products/women-chunky-beanie-gray.webp",
        name: "Gorro Grueso de Cable para Mujeres - Gris",
        rating: {
            stars: 5,
            count: 83
        },
        priceCents: 1250,
        keywords: [
            "gorros",
            "gorros de invierno",
            "gorras",
            "tuques",
            "ropa",
            "mujeres"
        ]
    },
    {
        id: "ee1f7c56-f977-40a4-9642-12ba5072e2b0",
        image: "images/products/men-chino-pants-beige.jpg",
        name: "Pantalones Chinos Clásicos con Pinzas para Hombres",
        rating: {
            stars: 4.5,
            count: 9017
        },
        priceCents: 2290,
        keywords: [
            "pantalones",
            "ropa",
            "hombres"
        ]
    },
    {
        id: "1c079479-8586-494f-ab53-219325432536",
        image: "images/products/men-athletic-shoes-green.jpg",
        name: "Zapatillas Deportivas para Hombres",
        rating: {
            stars: 4,
            count: 229
        },
        priceCents: 3890,
        keywords: [
            "zapatos",
            "zapatillas de correr",
            "calzado",
            "hombres"
        ]
    },
    {
        id: "4df68c27-fd59-4a6a-bbd1-e754ddb6d53c",
        image: "images/products/men-navigator-sunglasses-brown.jpg",
        name: "Gafas de Sol de Navegador para Hombres",
        rating: {
            stars: 3.5,
            count: 42
        },
        priceCents: 1690,
        keywords: [
            "gafas de sol",
            "gafas",
            "accesorios",
            "sombras"
        ]
    },
    {
        id: "4e37dd03-3b23-4bc6-9ff8-44e112a92c64",
        image: "images/products/non-stick-cooking-set-15-pieces.webp",
        name: "Juego de Cocina Antiadherente, Ollas, Sartenes y Utensilios - 15 Piezas",
        rating: {
            stars: 4.5,
            count: 511
        },
        priceCents: 6797,
        keywords: [
            "juego de cocina",
            "cocina"
        ]
    },
    {
        id: "a434b69f-1bc1-482d-9ce7-cd7f4a66ce8d",
        image: "images/products/vanity-mirror-silver.jpg",
        name: "Espejo de Tocador con Base Pesada - Cromo",
        rating: {
            stars: 4.5,
            count: 130
        },
        priceCents: 1649,
        keywords: [
            "baño",
            "lavabo",
            "espejos",
            "hogar"
        ]
    },
    {
        id: "a45cfa0a-66d6-4dc7-9475-e2b01595f7d7",
        image: "images/products/women-french-terry-fleece-jogger-camo.jpg",
        name: "Pantalones Jogger de Forro Polar para Mujeres",
        rating: {
            stars: 4.5,
            count: 248
        },
        priceCents: 2400,
        keywords: [
            "pantalones",
            "pantalones de chándal",
            "correr",
            "ropa",
            "mujeres"
        ]
    },
    {
        id: "d339adf3-e004-4c20-a120-40e8874c66cb",
        image: "images/products/double-elongated-twist-french-wire-earrings.webp",
        name: "Pendientes de Hilo Francés Doble Ovalado - Oro",
        rating: {
            stars: 4.5,
            count: 117
        },
        priceCents: 2400,
        keywords: [
            "accesorios",
            "mujeres"
        ]
    },
    {
        id: "d37a651a-d501-483b-aae6-a9659b0757a0",
        image: "images/products/round-airtight-food-storage-containers.jpg",
        name: "Contenedores Redondos para Almacenamiento de Alimentos - 5 Piezas",
        rating: {
            stars: 4,
            count: 126
        },
        priceCents: 2899,
        keywords: [
            "cajas",
            "contenedores de alimentos",
            "cocina"
        ]
    },
    {
        id: "0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524",
        image: "images/products/coffeemaker-with-glass-carafe-black.jpg",
        name: "Cafetera con Jarra de Vidrio y Filtro Reutilizable - 25 Oz, Negra",
        rating: {
            stars: 4.5,
            count: 1211
        },
        priceCents: 2250,
        keywords: [
            "cafeteras",
            "cocina",
            "electrodomesticos"
        ],
        instructionsLink: "images/appliance-instructions.png",
        warrantyLink: "images/appliance-warranty.png"
    },
    {
        id: "02e3a47e-dd68-467e-9f71-8bf6f723fdae",
        image: "images/products/blackout-curtains-black.jpg",
        name: "Juego de Cortinas Opacas 42 x 84 Pulgadas - Negras, 2 Paneles",
        rating: {
            stars: 4.5,
            count: 363
        },
        priceCents: 3099,
        keywords: [
            "dormitorio",
            "hogar"
        ]
    },
    {
        id: "8a53b080-6d40-4a65-ab26-b24ecf700bce",
        image: "images/products/cotton-bath-towels-teal.webp",
        name: "Toallas de Baño 100% Algodón - 2 Paquetes, Verde Claro",
        rating: {
            stars: 4.5,
            count: 93
        },
        priceCents: 2110,
        keywords: [
            "baño",
            "hogar",
            "toallas"
        ]
    },
    {
        id: "10ed8504-57db-433c-b0a3-fc71a35c88a1",
        image: "images/products/knit-athletic-sneakers-pink.webp",
        name: "Zapatillas Deportivas de Punto Impermeables - Rosadas",
        rating: {
            stars: 4,
            count: 89
        },
        priceCents: 3390,
        keywords: [
            "zapatos",
            "zapatillas de correr",
            "calzado",
            "mujeres"
        ]
    },
    {
        id: "77a845b1-16ed-4eac-bdf9-5b591882113d",
        image: "images/products/countertop-blender-64-oz.jpg",
        name: "Licuadora de Sobremesa - 64oz, 1400 Vatios",
        rating: {
            stars: 4,
            count: 3
        },
        priceCents: 10747,
        keywords: [
            "licuadoras",
            "cocina",
            "electrodomesticos"
        ],
        instructionsLink: "images/appliance-instructions.png",
        warrantyLink: "images/appliance-warranty.png"
    },
    {
        id: "36c64692-677f-4f58-b5ec-0dc2cf109e27",
        image: "images/products/floral-mixing-bowl-set.jpg",
        name: "Juego de 10 Piezas de Tazones para Mezclar con Tapas - Floral",
        rating: {
            stars: 5,
            count: 679
        },
        priceCents: 3899,
        keywords: [
            "tazones para mezclar",
            "repostería",
            "utensilios de cocina",
            "cocina"
        ]
    },
    {
        id: "aaa65ef3-8d6f-4eb3-bc9b-a6ea49047d8f",
        image: "images/products/kitchen-paper-towels-30-pack.jpg",
        name: "Toallas de Papel de Cocina de 2 Capas - 30 Paquetes",
        rating: {
            stars: 4.5,
            count: 1045
        },
        priceCents: 5799,
        keywords: [
            "cocina",
            "toallas de cocina",
            "pañuelos"
        ]
    },
    {
        id: "bc2847e9-5323-403f-b7cf-57fde044a955",
        image: "images/products/men-cozy-fleece-zip-up-hoodie-red.jpg",
        name: "Sudadera de Forro Polar con Cremallera Completa para Hombres",
        rating: {
            stars: 4.5,
            count: 3157
        },
        priceCents: 2400,
        keywords: [
            "suéteres",
            "sudaderas",
            "ropa",
            "hombres"
        ]
    }
].map(productDetails => {
    if (productDetails.type === 'ropa'){
        return new Clothing(productDetails);
    } else if (productDetails.keywords.find(keyword => keyword === "electrodomesticos")){
        return new Appliance(productDetails);
    }
    return new Product(productDetails)
});
 */