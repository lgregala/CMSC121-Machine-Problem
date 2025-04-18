let openShopping = document.querySelector('#shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCart = document.querySelector('.listCart');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let searchInput = document.querySelector('#searchInput');
let staticPath = document.body.dataset.staticPath;

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})

closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})

// Placeholder for products
let products = [
    {
        id: 1,
        name: 'Spathiphyllum',
        image: 'AWPlant2.jpg',
        price: 120000
    },
    {
        id: 2,
        name: 'Saintpaulia',
        image: 'AWPlant3.jpg',
        price: 130000
    },
    {
        id: 3,
        name: 'Monstera Deliciosa',
        image: 'AWPlant4.jpg',
        price: 220000
    },
    {
        id: 4,
        name: 'Unknown Plant',
        image: 'Gardening.png',
        price: 130000
    },
    {
        id: 5,
        name: 'Snake Plant',
        image: 'SnakePlant.jpg',
        price: 100000
    },
    {
        id: 6,
        name: 'Prayer Plant',
        image: 'AWPlant1.webp',
        price: 110000
    }
];

let filteredProducts = [...products];
let listCarts  = [];

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        // Show all products when search is empty
        filteredProducts = [...products];
    } else {
        // Filter products based on search query
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query)
        );
    }
    
    renderProducts(filteredProducts);
});

function renderProducts(productArray){
    list.innerHTML = ''; // clear existing list

    if (productArray.length === 0) {
        list.innerHTML = '<div class="no-results">⌕ No products found matching your search.</div>';
        return;
    }

    productArray.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="${staticPath}${value.image}">
            <h4 class="title">${value.name}</h4>
            <div class="price">${value.price.toLocaleString()}</div>
            <button onclick="addToCart(${value.id - 1})">Add To Cart</button>`;
        list.appendChild(newDiv);
    });
}

function addToCart(key){
    if(listCarts[key] == null){
        listCarts[key] = JSON.parse(JSON.stringify(products[key]));
        listCarts[key].quantity = 1;
        reloadCart();
    }
    else{ // Added logic for increasing quantity to an already existing item in the card
        listCarts[key].quantity += 1;
        changeQuantity(key, listCarts[key].quantity);
    }
}

function reloadCart(){
    listCart.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCarts.forEach((value, key)=>{
        totalPrice = totalPrice + value.price;
        count = count + value.quantity;
        if(value != null){ // Added classnames and implemented css for better design
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="${staticPath}${value.image}" class="ordered-item-img"></div>
                <div class="ordered-item-name">${value.name}</div>
                <div class="ordered-item-price">${value.price.toLocaleString()}</div>
                <div class="ordered-item-quantity-changer">
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>`;
                listCart.appendChild(newDiv);
        }
    })
    total.innerText = "₱ " + totalPrice.toLocaleString();
    quantity.innerText = count;
}

function changeQuantity(key, quantity){
    if(quantity == 0){
        delete listCarts[key];
    }else{ 
        listCarts[key].quantity = quantity;
        listCarts[key].price = quantity * products[key].price;
    }
    reloadCart();
}

function initApp() {
    filteredProducts = [...products];
    renderProducts(filteredProducts);
    reloadCart();
}

// Start the application
initApp();