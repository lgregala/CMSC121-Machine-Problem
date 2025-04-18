document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('#searchForm');
    if (!searchForm) return;
    
    const searchInput = searchForm.querySelector('input[type="search"]');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-preview-results';
    searchForm.appendChild(searchResults);

    // Sample product data -> in production pa 'to, fetch from backend 'yung data if evs (idk how to implement)
    const products = [
        { name: 'Spathiphyllum', url: '/products' },
        { name: 'Saintpaulia', url: '/products' },
        { name: 'Monstera Deliciosa', url: '/products' },
        { name: 'Unknown Plant', url: '/products' },
        { name: 'Snake Plant', url: '/products' },
        { name: 'Prayer Plant', url: '/products' }
    ];

    function initSearch() {
        // Only show preview on non-product pages (dashboard, about, contact, login, register, etc.)
        if (!window.location.pathname.includes('/products')) {
            searchInput.addEventListener('focus', showResults);
            searchInput.addEventListener('blur', () => setTimeout(hideResults, 200));
            searchInput.addEventListener('input', showResults);
        }

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                redirectToSearch(query);
            }
        });
    }

    // Show search results preview
    function showResults() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length === 0) {
            hideResults();
            return;
        }

        const productMatches = products.filter(p => 
            p.name.toLowerCase().includes(query)
        );

        renderResults(productMatches, query);
    }

    // Render search results
    function renderResults(products, query) {
        let html = '';
        
        if (products.length === 0 && pages.length === 0) {
            html = `<div class="no-results">No results found for "${query}"</div>`;
        } else {
            if (products.length > 0) {
                html += `<div class="result-category">Products</div>`;
                html += products.map(product => `
                    <div class="search-result" data-product="${product.name}">
                        <i class="fas fa-leaf"></i>
                        <span>${product.name}</span>
                    </div>`
                ).join('');
            }
        }
        
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
        
        // Add click handlers for product results
        document.querySelectorAll('.search-result[data-product]').forEach(item => {
            item.addEventListener('click', function() {
                redirectToSearch(this.dataset.product);
            });
        });
    }

    // Hide results 
    function hideResults() {
        searchResults.style.display = 'none';
    }

    // Redirect to products page with search query
    function redirectToSearch(query) {
        window.location.href = `/products?search=${encodeURIComponent(query)}`; // Will be redirected to the register page with /products in the link
    }

    // Initialize search
    initSearch();
});