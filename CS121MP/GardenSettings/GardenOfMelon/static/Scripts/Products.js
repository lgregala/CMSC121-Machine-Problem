let openShopping = document.querySelector('#shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCart = document.querySelector('.listCart');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let searchInput = document.querySelector('#searchInput');
let staticPath = document.body.dataset.staticPath;

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

// document.addEventListener("DOMContentLoaded", function () {
//   const filterButtons = document.querySelectorAll(".filter-btn");
//   const searchForm = document.getElementById("searchForm");
//   const searchInput = document.getElementById("searchInput");

//   filterButtons.forEach(btn => {
//       btn.addEventListener("click", () => {
//           const category = btn.getAttribute("data-category");
//           const url = new URL(window.location.href);
          
//           // Always clear search when applying category filter
//           url.searchParams.delete('search');
          
//           if (category === "all") {
//               // Remove category parameter to show all
//               url.searchParams.delete('category');
//           } else {
//               // Set the specific category filter
//               url.searchParams.set('category', category);
//           }
          
//           // Update URL and reload
//           window.location.href = url.toString();
//       });
//   });

//   // Optional: Clear URL search param when search input is emptied
//   if (searchInput) {
//       searchInput.addEventListener('input', function() {
//           if (this.value === "") {
//               const url = new URL(window.location.href);
//               url.searchParams.delete('search');
//               // Update URL without reload
//               window.history.replaceState({}, '', url);
//           }
//       });
//   }
// });


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