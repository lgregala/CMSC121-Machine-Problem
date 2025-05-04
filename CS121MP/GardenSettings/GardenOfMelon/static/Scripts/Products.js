
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // View button click handler
document.querySelector('.list').addEventListener('click', function(e) {
  if (e.target.classList.contains('view-btn')) {
    const productId = e.target.closest('.item').querySelector('.update-cart').getAttribute('data-product');
    fetch(`/product_detail/${productId}/`)
      .then(response => response.json())
      .then(data => {
      document.getElementById('modalProductImage').src = data.image_url;
      document.getElementById('modalProductName').textContent = data.name;
      document.getElementById('modalScientificName').textContent = data.scientific_name;
      document.getElementById('modalProductPrice').textContent = `₱${data.price}`;
      document.getElementById('modalProductCategory').textContent = data.category;
      document.getElementById('modalProductSubcategory').textContent = data.subcategory;
      document.getElementById('modalProductDescription').textContent = data.description;
      document.querySelector('.modal-add-to-cart').setAttribute('data-product', productId);
      modal.style.display = 'block';
    })
    .catch(error => console.error('Error:', error));
  }
});
    
    // Close modal handlers
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
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