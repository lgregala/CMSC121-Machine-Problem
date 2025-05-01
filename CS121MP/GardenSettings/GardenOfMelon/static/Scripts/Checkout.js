document.getElementById('checkout').addEventListener('click', function(e){
    if (order.get_cart_items != 0 || order.get_cart_total != 0) {
        submitCheckout()
    }
    else {
        // code here
    }
})

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
        console.log('Success:', data);
        alert('Transaction completed');
        window.location.href = 'home';
    })
}