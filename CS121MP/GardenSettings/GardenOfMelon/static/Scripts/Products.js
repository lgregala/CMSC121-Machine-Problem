document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Improved event delegation
    document.addEventListener('click', function(e) {
        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn) {
            e.preventDefault();
            const item = viewBtn.closest('.item');
            const productId = item.querySelector('.update-cart').getAttribute('data-product');
            
            fetch(`/product_detail/${productId}/`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    document.querySelector('.modal-add-to-cart').textContent = 'Add to Cart';
                    document.querySelector('.quantity-input').value = 1;
                    document.getElementById('modalProductImage').src = data.image_url;
                    document.getElementById('modalProductName').textContent = data.name;
                    document.getElementById('modalProductStock').textContent = `Stock: ${data.quantity}`;
                    document.getElementById('modalScientificName').textContent = data.scientific_name;
                    document.getElementById('modalProductPrice').textContent = `₱${data.price}`;
                    document.getElementById('modalProductCategory').textContent = data.category;
                    document.getElementById('modalProductSubcategory').textContent = data.subcategory;
                    document.getElementById('modalProductDescription').textContent = data.description;
                    document.getElementById('modalProductDifficulty').textContent = data.difficulty;
                    document.getElementById('modalProductWateringSchedule').textContent = data.watering_schedule;
                    document.getElementById('modalProductLightNeeded').textContent = data.light_needed;
                    document.querySelector('.modal-add-to-cart').setAttribute('data-product', productId);
                    modal.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to load product details');
                });
        }
        
        // Close modal if clicking X or outside
        if (e.target === closeBtn || e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const filterToggle = document.querySelector('.filter-toggle-btn');
  const productFilter = document.querySelector('.product-filter');
  
  if (filterToggle && productFilter) {
    filterToggle.addEventListener('click', function() {
      productFilter.classList.toggle('active');
      this.innerHTML = productFilter.classList.contains('active') ? 
        '<i class="fas fa-times"></i> Close Filters' : 
        '<i class="fas fa-filter"></i> Filters';
    });
  }
});