var updateBtns = document.getElementsByClassName('update-cart')

for (var i = 0; i < updateBtns.length; i++) 
{
    updateBtns[i].addEventListener('click', function () 
    {
        var productId = this.dataset.product
        var action = this.dataset.action
        var currentElement = this

        if (user == 'AnonymousUser') 
            addCookieItem(productId, action)
        else
        {
            if (currentElement.classList.contains('add-to-cart-btn')) 
                addToCartOrder(productId, action)
            else updateUserOrder(productId, action, currentElement)
        }
    })
}

function addCookieItem(productId, action)
{
    if (action == 'add')
    {
        if (cart[productId] == undefined) cart[productId] = {'quantity': 1}
        else cart[productId]['quantity'] += 1
    }

    if (action == 'remove')
    {
        cart[productId]['quantity'] -= 1
        if (cart[productId]['quantity'] <= 0)
        {
            console.log('Remove Item')
            delete cart[productId]
        }
    }
    console.log('Cart:', cart)
    document.cookie = 'cart=' + JSON.stringify(cart) + ';domain=;path=/'
    location.reload()
}

function updateUserOrder(productId, action, currentElement)
{
    var url = '/update_item/'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId, 'action': action})
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error)
        {
            alert(data.error);
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

        quantityDiv.textContent = data.quantity
        var subtotalDiv = mainDiv.querySelector('.subtotal')
        subtotalDiv.textContent = '₱' + parseFloat(data.subtotal).toFixed(2)

        if (data.quantity <= 0)
        {
            mainDiv.classList.add('removed');
            setTimeout(function () {
                mainDiv.remove();
            }, 650);
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

function addToCartOrder(productId, action)
{
    var url = '/update_item/'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId, 'action': action})
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        alert('Item added to cart successfully!')
        var cartItemsDiv = document.querySelector('.cart-items-total')
        cartItemsDiv.textContent = data.itemtotal
    })
}