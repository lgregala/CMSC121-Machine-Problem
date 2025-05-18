document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('message-sent-modal');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 7000);
    }
});