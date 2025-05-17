document.addEventListener('DOMContentLoaded', function () {
    const searchToggle = document.getElementById('searchToggle');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchToggle && searchForm && searchInput) {
        searchToggle.addEventListener('click', () => {
            const isVisible = searchForm.classList.contains('show');

            if (isVisible) {
                searchForm.classList.remove('show');
                searchForm.style.display = 'none';
                searchForm.style.pointerEvents = 'none';
                searchInput.blur();
            } else {
                searchForm.style.display = 'flex';
                searchForm.style.pointerEvents = 'auto';
                searchForm.classList.add('show');
                searchInput.focus();
            }
        });

        if (window.getComputedStyle(searchForm).display === 'none') {
            searchForm.style.pointerEvents = 'none';
        }
    }
});