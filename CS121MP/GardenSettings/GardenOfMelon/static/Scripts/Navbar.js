document.addEventListener('DOMContentLoaded', function () {
    const searchToggle = document.getElementById('searchToggle');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchForm && searchInput) {
        searchToggle.addEventListener('click', () => {
            if (searchForm.classList.contains('show')) {
                searchForm.classList.remove('show');
                setTimeout(() => {
                    searchForm.style.display = 'none';
                    searchForm.style.pointerEvents = 'none'; 
                    searchInput.disabled = true;
                    searchInput.blur(); 
                }, 400);
            } else {
                searchForm.style.display = 'flex';
                searchForm.style.pointerEvents = 'auto'; 
                searchInput.disabled = false;
                setTimeout(() => {
                    searchForm.classList.add('show');
                    searchInput.focus();
                }, 10);
            }
        });

        if (window.getComputedStyle(searchForm).display === 'none') {
            searchForm.style.pointerEvents = 'none';
            searchInput.disabled = true;
        }
    }
});