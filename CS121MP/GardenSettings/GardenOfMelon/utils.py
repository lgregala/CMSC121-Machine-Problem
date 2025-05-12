import json
from django.http import JsonResponse
from . models import *

def cookieCart(request):
    try:
        cart = json.loads(request.COOKIES['cart'])
    except: 
        cart = {}

    items = []
    order = {'get_cart_total': 0, 'get_cart_items': 0}
    cartItems = order['get_cart_items']

    for i in cart:
        product = Product.objects.get(id=i)

        cartItems += cart[i]['quantity']
        subtotal = (product.price * cart[i]['quantity'])

        order['get_cart_total'] += subtotal
        order['get_cart_items'] += cart[i]['quantity']

        item = {'product': product, 'quantity': cart[i]['quantity'], 'get_total': subtotal}
        items.append(item)

    print('Cookie cart:', items)
    return {'cartItems': cartItems, 'order': order, 'items': items}

def get_product_stock(request, product_id):
    product = Product.objects.get(id=product_id)
    return JsonResponse({'stock': product.quantity})

def getCartData(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        cookieData = cookieCart(request)
        cartItems = cookieData['cartItems']
        order = cookieData['order']
        items = cookieData['items']

    return {'items': items, 'order': order, 'cartItems': cartItems}

def guestOrder(request, data):
    name = data['form']['email']
    email = data['form']['email']

    cookieData = cookieCart(request)
    items = cookieData['items']

    customer, created = Customer.objects.get_or_create(email=email)
    customer.name = name
    customer.save()

    order = Order.objects.create(
        customer=customer,
        complete=False,
    )

    for item in items:
        product = Product.objects.get(id=item['product']['id'])
        orderItem = OrderItem.objects.create(
            product=product,
            order=order,
            quantity=item['quantity']
        )
    
    return customer, order

def getGuestCookieCart(request):
    data = serialize(cookieCart(request))   
    return JsonResponse(data)

def serialize(data):
    items = [{
        'productId': item['product'].id,
        'stock': item['product'].quantity,
        'quantity': item['quantity'],
        'subtotal': item['product'].price * item['quantity'],
        'price': item['product'].price,
    } for item in data['items']]
    
    order = {'cart_total': data['order']['get_cart_total'], 'cart_items': data['order']['get_cart_items'],}
    serialized_dictionary = {'items': items, 'order': order, 'cartItems': data['cartItems']}
    return serialized_dictionary