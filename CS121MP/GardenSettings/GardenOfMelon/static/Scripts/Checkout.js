const checkoutButton = document.getElementById('checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
        submitCheckout();
    });
}

async function submitCheckout() {
    try {
        const response = await fetch('/process_order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            }
        });

        if (response.status == 401) 
        {
            const data = await response.json();
            window.location.href = data.redirect;
            return;
        }

        const data = await response.json();
        if (data.message) 
        {
            cart = {};
            document.cookie = 'cart=' + JSON.stringify(cart) + '; path=/';
            window.location.href = 'home';
        }
    } 
    catch (error) {
        console.error('Checkout failed:', error);
    }
}