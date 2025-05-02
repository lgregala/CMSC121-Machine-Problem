document.getElementById('checkout').addEventListener('click', function(e){
    submitCheckout()
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
        alert('Transaction completed');
        window.location.href = 'home';
    })
}