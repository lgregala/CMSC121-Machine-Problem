document.addEventListener('DOMContentLoaded', function () {
    const searchToggle = document.getElementById('searchToggle');
    const searchForm = document.getElementById('searchForm');

    if (searchToggle && searchForm) {
        searchToggle.addEventListener('click', () => {
            if (searchForm.classList.contains('show')) {
                searchForm.classList.remove('show');
                setTimeout(() => {
                    searchForm.style.display = 'none';
                }, 400); // wait for fade out
            } else {
                searchForm.style.display = 'flex';
                setTimeout(() => {
                    searchForm.classList.add('show');
                }, 10); // slight delay to allow transition
            }
        });
    }

    // updateCart();
});
