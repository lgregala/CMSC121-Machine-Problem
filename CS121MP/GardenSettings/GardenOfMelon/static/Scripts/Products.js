
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
            document.querySelector('.modal-add-to-cart').textContent = 'Add to Cart';
            document.querySelector('.quantity-input').value = 1;
            document.getElementById('modalProductImage').src = data.image_url;
            document.getElementById('modalProductName').textContent = data.name;
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