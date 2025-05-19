const checkoutButton = document.getElementById('checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
        if (user != 'AnonymousUser') 
        {
            let button = this;
            button.classList.add('clicked');

            setTimeout(() => {
                button.classList.remove('clicked');

                document.querySelector('.popup-overlay').classList.add('active');
                document.querySelector('.popup').classList.add('active');
            }, 4200);

            // Get the date today
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById("order-date").textContent = now.toLocaleDateString('en-US', options);

            // Get the date three days from order date
            const eta = new Date(now);
            eta.setDate(now.getDate() + 3);
            document.getElementById("eta-date").textContent = eta.toLocaleDateString('en-US', options);
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

async function submitCheckout() 
{
    try {
        const response = await fetch('/process_order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            }
        });

        const data = await response.json();
        if (response.status == 401) 
        {
            if (data.redirect)
            {
                sessionStorage.setItem('showModal', 'checkout');
                window.location.href = data.redirect;
                return;
            }
            else
            {
                sessionStorage.setItem('showModal', 'shippingAddress');
                window.location.href = data.redirectUser;
                return;
            }
        }

        if (data.message || data.order_number) 
        {
            cart = {};
            document.cookie = 'cart=' + JSON.stringify(cart) + '; path=/';
            
            const checkoutModal = document.querySelector('#unique-order-number')
            checkoutModal.textContent = '🌱 Order Number:\n' + data.order_number
        }
    } 
    catch (error) {
        console.error('Checkout failed:', error);
    }
}