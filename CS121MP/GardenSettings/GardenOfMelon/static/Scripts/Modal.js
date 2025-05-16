document.addEventListener('DOMContentLoaded', function() {
    // Check URL params for showing modal
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') == 'checkout') 
    {
        const modal = document.getElementById('login-required');
        if (modal)
        {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 7000);
        }
    }
    else if (params.get('from') == 'login')
    {
        const modal = document.getElementById('authenticated-user-modal');
        if (modal)
        {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 7000);
        }
    }
});