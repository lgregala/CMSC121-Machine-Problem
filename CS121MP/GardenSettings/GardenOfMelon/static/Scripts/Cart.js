var updateBtns = document.getElementsByClassName('update-cart')

for (var i = 0; i < updateBtns.length; i++) 
{
    updateBtns[i].addEventListener('click', function () 
    {
        var productId = this.dataset.product
        var action = this.dataset.action
        var currentElement = this

        if (this.classList.contains('quantity-wise-add-to-cart'))
        {
            const quantityInput = document.getElementById('modalQuantity');
            const quantity = parseInt(quantityInput.value);

            if (user == 'AnonymousUser') updateCookie(productId, action, currentElement, quantity)
            else addToCartOrder(productId, action, currentElement, quantity)
        }
        else
        {
            if (user == 'AnonymousUser') updateCookie(productId, action, currentElement, 1)
            else
            {
                if (currentElement.classList.contains('add-to-cart-btn')) addToCartOrder(productId, action, currentElement, 1)
                else updateUserOrder(productId, action, currentElement, 1)
            }
        }
    })
}

function updateUserOrder(productId, action, currentElement, qty)
{
    // API Endpoint receiving data
    var url = '/update_item/'

    // AJAX Request
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId, 'action': action, 'add-qty': qty})
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error)
        {
            const modal = document.getElementById('stockExceededModal');
            modal.style.display = 'block';
            modal.textContent = '⚠️ Cannot add ' + data.error +'. Maximum stocks exceeded!'
            
            setTimeout(() => {
                modal.style.display = 'none';
            }, 5000); 
            return;
        }

        var mainDiv, quantityDiv
        if (currentElement.classList.contains('trash-icon'))
        {
            mainDiv = currentElement.closest('.product-row')
            quantityDiv = mainDiv.querySelector('.item-quantity')
        }
        else 
        {
            var parentQtyDiv = currentElement.closest('.quantity-arrow-wrapper')
            quantityDiv = parentQtyDiv.querySelector('.item-quantity')
            mainDiv = parentQtyDiv.closest('.product-row')
        }
        
        if (data.quantity <= 0)
        {
            mainDiv.classList.add('removed');
            setTimeout(function () {
                mainDiv.remove();
            }, 650);
        }
        else
        {
            quantityDiv.textContent = data.quantity
            var subtotalDiv = mainDiv.querySelector('.subtotal')
            subtotalDiv.textContent = '₱' + parseFloat(data.subtotal).toFixed(2)
        }

        var totalItemsDiv = document.querySelector('.total-items')
        totalItemsDiv.textContent = data.itemtotal

        var grandTotalDiv = document.querySelector('.grandtotal')
        grandTotalDiv.textContent = '₱' + parseFloat(data.grandtotal).toFixed(2)

        var cartItemsDiv = document.querySelector('.cart-items-total')
        cartItemsDiv.textContent = data.itemtotal
    

        if (data.itemtotal == 0 || data.grandtotal == 0)
        {
            var leftCtnr = mainDiv.closest('.left-ctnr')
            var fullCartPage = leftCtnr.closest('.cart-page')
            var rightCtnr = fullCartPage.querySelector('.right-ctnr')

            leftCtnr.remove()
            rightCtnr.remove()

            fullCartPage.innerHTML = `
            <div class="box-element-empty">
                <img src="/static/Images/Empty-cart.png" class="emptyCartImg">
                <div class="emptyCartMsg"> Oh naur! There are currently no plants in your cart. 😢 </div>
                <a class="summary-btn start-shop-btn" href="/products">
                    <span style="display: flex; margin: auto;"> Start Shopping </span>
                </a>
            </div>`
        }
    })
}

function addToCartOrder(productId, action, button, qty)
{
    var url = '/update_item/'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId, 'action': action, 'add-qty': qty})
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error)
        {
            if (!button.classList.contains('modal-add-to-cart'))
            {
                const modal = document.getElementById('stockExceededModal');
                modal.style.display = 'block';
                modal.textContent = '⚠️ Cannot add ' + data.error +'. Maximum stocks exceeded!'
                
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 5000); 
                return;
            }
            else
            {
                animateAddToCartStockError(button)
                return;
            }
        }
        else
        {
            animateAddToCart(button);
            var cartItemsDiv = document.querySelector('.cart-items-total')
            cartItemsDiv.textContent = data.itemtotal
        }
    })
}

function emptyCartPage(mainDiv)
{
    var leftCtnr = mainDiv.closest('.left-ctnr')
    var fullCartPage = leftCtnr.closest('.cart-page')
    var rightCtnr = fullCartPage.querySelector('.right-ctnr')

    leftCtnr.remove()
    rightCtnr.remove()

    fullCartPage.innerHTML = `
    <div class="box-element-empty">
        <img src="/static/Images/Empty-cart.png" class="emptyCartImg">
        <div class="emptyCartMsg"> Oh naur! There are currently no plants in your cart. 😢 </div>
        <a class="summary-btn start-shop-btn" href="/products">
            <span style="display: flex; margin: auto;"> Start Shopping </span>
        </a>
    </div>`
}

function updateCookie(productId, action, currentElement, qty)
{
    fetch(`/get_product_stock/${productId}/`)
    .then(response => response.json())
    .then(data => {
        if (action == 'add') 
        {
            if (!cart[productId]) 
            {
                if (data.stock >= qty)
                {
                    cart[productId] = { 'quantity': qty };
                    animateAddToCart(currentElement);
                }
                else animateAddToCartStockError(currentElement)
            }
            else 
            {
                if (data.stock >= cart[productId]['quantity'] + qty) 
                {
                    cart[productId]['quantity'] += qty;
                    animateAddToCart(currentElement);
                }
                else 
                {
                    if (!currentElement.classList.contains('modal-add-to-cart'))
                    {
                        const modal = document.getElementById('stockExceededModal');
                        modal.style.display = 'block';
                        modal.textContent = '⚠️ Cannot add ' + data.name +'. Maximum stocks exceeded!'
                        
                        setTimeout(() => {
                            modal.style.display = 'none';
                        }, 5000); 
                        return;
                    }
                    else
                    {
                        animateAddToCartStockError(currentElement)
                        return;
                    }
                }
            }
        } 
        else if (action == 'remove') 
        { 
            cart[productId]['quantity'] -= 1;
            if (cart[productId]['quantity'] <= 0) delete cart[productId];
        } 
        else if (action == 'set-zero') delete cart[productId];

        document.cookie = 'cart=' + JSON.stringify(cart) + ';path=/';

        fetch(`/guest_cookie_cart/`)
        .then(response => response.json())
        .then(data => {
            var mainDiv, quantityDiv
            var currentItem = data.items.find(item => item.productId == productId);
    
            if (!currentElement.classList.contains('add-to-cart-btn') &&
             !currentElement.classList.contains('quantity-wise-add-to-cart'))
            {
                if (currentElement.classList.contains('trash-icon'))
                {
                    mainDiv = currentElement.closest('.product-row')
                    quantityDiv = mainDiv.querySelector('.item-quantity')
                }
                else 
                {
                    var parentQtyDiv = currentElement.closest('.quantity-arrow-wrapper')
                    quantityDiv = parentQtyDiv.querySelector('.item-quantity')
                    mainDiv = parentQtyDiv.closest('.product-row')
                }
    
                if (data.empty)
                {
                    emptyCartPage(mainDiv)
                    var cartItemsDiv = document.querySelector('.cart-items-total')
                    cartItemsDiv.textContent = 0
                    return
                }
    
                if (!currentItem && (action == 'remove' || action == 'set-zero'))
                {
                    mainDiv.classList.add('removed');
                    setTimeout(function () {
                        mainDiv.remove();
                    }, 650);
                }
                else 
                {
                    quantityDiv.textContent = currentItem.quantity
                    var subtotalDiv = mainDiv.querySelector('.subtotal')
                    subtotalDiv.textContent = '₱' + parseFloat(currentItem.subtotal).toFixed(2)
                }
    
                var totalItemsDiv = document.querySelector('.total-items')
                totalItemsDiv.textContent = data['cartItems']
    
                var grandTotalDiv = document.querySelector('.grandtotal')
                grandTotalDiv.textContent = '₱' + parseFloat(data.order['cart_total']).toFixed(2)
    
                if (data['cartItems'] == 0 || data.order['cart_total'] == 0)
                    emptyCartPage(mainDiv)
            }
    
            var cartItemsDiv = document.querySelector('.cart-items-total')
            cartItemsDiv.textContent = data['cartItems']
        });
    });
}

function animateAddToCart(button)
{
    if (!button.classList.contains('modal-add-to-cart'))
    {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 2500);
    }
    else
    {
        button.style.pointerEvents = 'none';
        button.textContent = 'Item Added!';
        setTimeout(() => {
            button.style.pointerEvents = 'auto';
            button.textContent = 'Add to Cart';
        }, 2500);
    }
}

function animateAddToCartStockError(button)
{
    button.style.pointerEvents = 'none';
    button.textContent = 'Exceeded Stocks!';
    setTimeout(() => {
        button.style.pointerEvents = 'auto';
        button.textContent = 'Add to Cart';
    }, 2500);
}