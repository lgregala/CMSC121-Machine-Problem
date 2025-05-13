const checkoutButton = document.getElementById('checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
        if (user != 'AnonymousUser') 
        {
            document.querySelector('.popup-overlay').classList.add('active');
            document.querySelector('.popup').classList.add('active');
        }
        submitCheckout();
    });
}

document.getElementById('home').addEventListener("click", function(){
    document.querySelector('.popup-overlay').classList.remove('active');
    document.querySelector('.popup').classList.remove('active');
})

document.getElementById('shop-more').addEventListener("click", function(){
     document.querySelector('.popup-overlay').classList.remove('active');
    document.querySelector('.popup').classList.remove('active');
})

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
        }
    } 
    catch (error) {
        console.error('Checkout failed:', error);
    }
}