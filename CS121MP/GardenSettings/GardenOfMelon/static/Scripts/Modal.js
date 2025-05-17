document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('showModal') == 'checkout') 
    {
        const modal = document.getElementById('login-required');
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 7000);
        }
        sessionStorage.removeItem('showModal');
    }
    else 
    {
        const modal = document.getElementById('authenticated-user-modal');
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 7000);
        }
    }
});