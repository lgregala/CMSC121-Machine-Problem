const checkoutButton = document.getElementById('checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
        submitCheckout();
    });
}

function submitCheckout(){
    fetch('/process_order/', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    })
    .then((response) => response.json())
    .then((data) => {
        alert('Transaction completed');

        cart = {}
        document.cookie = 'cart=' + JSON.stringify(cart) + '; path=/'

        window.location.href = 'home';
    })
}