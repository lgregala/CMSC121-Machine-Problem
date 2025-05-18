document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('authenticated-user-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 7000);
    }
});