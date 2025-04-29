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
let products = [];
let filteredProducts = [];
let listCarts = [];

document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const items = document.querySelectorAll(".item");
  
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
  
        items.forEach(item => {
          const itemCategory = item.getAttribute("data-category");
  
          if (category === "all" || itemCategory === category) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  });
  

// For displaying products (All products or filtered products based on search)
// function renderProducts(productArray){
//     list.innerHTML = ''; // clear existing list

//     if (productArray.length === 0) {
//         list.innerHTML = '<div class="no-results">⌕ No products found matching your search.</div>';
//         return;
//     }

//     productArray.forEach((value, key) =>{
//         let newDiv = document.createElement('div');
//         newDiv.classList.add('item');
//         newDiv.innerHTML = `
//             <img src="${staticPath}${value.image}">
//             <h4 class="title">${value.name}</h4>
//             <div class="price">${value.price.toLocaleString()}</div>
//             <button onclick="addToCart(${value.id - 1})">Add To Cart</button>`;
//         list.appendChild(newDiv);
//     });
// }

document.addEventListener('DOMContentLoaded', function () {
    // Attach event listeners to all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productIndex = parseInt(this.dataset.id);
            addToCart(productIndex);
        });
    });
});

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