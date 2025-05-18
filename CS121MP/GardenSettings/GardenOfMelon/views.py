from django.shortcuts import render, redirect
from django.db.models.signals import post_save
from django.dispatch import receiver
from .forms import RegisterForm, ContactForm, ShippingAddressForm
from django.http import JsonResponse
from .models import *
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.messages import get_messages
from django.db.models import Q
from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404
from .utils import * 
import datetime
import json

def registerPage(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            if User.objects.filter(email=email).exists():
                return render(request, 'register.html', {'form': form})  
            else:
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password'])
                user.save()
                messages.success(request, "Account created successfully! Please log in.")
                
                storage = get_messages(request)
                for msg in list(storage):
                    pass
                
                return redirect('login')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{error}")
    else:
        form = RegisterForm()
    
    context1 = {'form': form}
    context2 = getCartData(request)
    context = {**context1, **context2}
    return render(request, 'register.html', context)

def loginPage(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Check if the email exists in the database first
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, "Account doesn't exist.")
            return redirect('login')

        # Now we know the account exists, try to authenticate (if it matches the password in the database)
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)

            guestCart = serialize(cookieCart(request))
            if guestCart and guestCart.get('cartItems', 0) > 0:
                customer = user.customer
                order, created = Order.objects.get_or_create(customer=customer, complete=False)

                for item in guestCart['items']:
                    product = Product.objects.get(id=item['productId'])
                    quantity = item['quantity']

                    order_item, created = OrderItem.objects.get_or_create(order=order, product=product)
                    order_item.quantity += quantity
                    order_item.save()
                
                request.session['show_login_modal'] = True
                response = redirect('home')
                response.delete_cookie('cart')
                return response
            else:
                request.session['show_login_modal'] = True
                return redirect('home')
   
        else:
            messages.error(request, "Incorrect password.")
            return redirect('login')
    
    context = getCartData(request)
    return render(request, 'login.html', context)

def logoutPage(request):
    logout(request)
    return redirect('login')

def shippingAddress(request):
    customer = request.user.customer

    if request.method == "POST":
        form = ShippingAddressForm(request.POST, instance=customer)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = ShippingAddressForm(instance=customer)

    context1 = {'form': form}
    context2 = getCartData(request)
    context = {**context1, **context2}
    return render(request, 'login.html', context)

def aboutPage(request):
    context = getCartData(request)
    return render(request, 'about.html', context)

def homePage(request):
    show_modal = request.session.pop('show_login_modal', False)
    context1 = {'show_modal': show_modal,}
    
    if request.user.is_authenticated:
        context1['user'] = request.user
    
    context2 = getCartData(request)
    context = {**context1, **context2}
    
    return render(request, 'home.html', context)

def contactPage(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('contact')
    else:
        form = ContactForm()

    context1 = {'form': form}
    context2 = getCartData(request)
    context = {**context1, **context2}
    return render(request, 'contact.html', context)

def productsPage(request):
    query = request.GET.get('search', '')
    category = request.GET.get('category', '')  # Filter by main category (category)
    subcategory = request.GET.get('subcategory', '')  # Filter by subcategory
    page_number = request.GET.get('page', 1)  # Get current page number from URL

    min_price = request.GET.get('minprice')
    max_price = request.GET.get('maxprice')

    products = Product.objects.all()

    if query:
        products = products.filter(
            Q(name__icontains=query)
        ).distinct()

    # Apply category filter (filter by main category)
    if category:
        products = products.filter(category__iexact=category)  # Filter by main category

    # Apply subcategory filter (filter by subcategory)
    if subcategory:
        products = products.filter(subcategory__iexact=subcategory)  # Filter by subcategory

    # Apply price filter if minimum and maximum are specified
    if min_price is not None and min_price != '':
        min_price = float(min_price)
        products = products.filter(price__gte=min_price)
        filterMin_performed = True
    else:
        min_price = 0
        filterMin_performed = False

    if max_price is not None and max_price != '':
        max_price = float(max_price)
        products = products.filter(price__lte=max_price)
        filterMax_performed = True
    else:
        max_price = ''
        filterMax_performed = False

    paginator = Paginator(products, 9)
    page_obj = paginator.get_page(page_number)

    context1 = {
        'products': page_obj,
        'search_performed': bool(query),
        'no_results': not products.exists(),
        'search_query': query,
        'current_category': category,
        'current_subcategory': subcategory,
        'filterMin_performed': filterMin_performed,
        'filterMax_performed': filterMax_performed,
        'min_price': min_price,
        'max_price': max_price,
    }

    context2 = getCartData(request)
    context = {**context1, **context2}
    return render(request, 'products.html', context)

def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    data = {
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'image_url': product.image.url,
        'scientific_name': product.scientific_name,
        'category': product.category,
        'subcategory': product.subcategory,
        'difficulty': product.difficulty,
        'watering_schedule' : product.watering_schedule,
        'light_needed': product.light_needed
    }
    return JsonResponse(data)

def cart(request):
    context = getCartData(request)
    return render(request, 'cart.html', context)

def updateItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']
    addQuantity = data['add-qty']

    customer = request.user.customer
    product = Product.objects.get(id=productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    orderItem, orderItemCreated = OrderItem.objects.get_or_create(order=order, product=product)
 
    if action == 'add':
        order_item = orderItem.quantity + addQuantity
        product_stock = orderItem.product.quantity

        if (order_item > product_stock): 
            name = orderItem.product.name
            if (orderItemCreated): orderItem.delete()
            return JsonResponse({'error': name})

        orderItem.quantity += addQuantity

    elif action == 'remove':
        orderItem.quantity -= 1

    elif action == 'set-zero':
        orderItem.quantity = 0

    orderItem.save()

    if orderItem.quantity <= 0:
        orderItem.delete()
        newData = {'quantity': 0, 'subtotal': 0, 'grandtotal': order.get_cart_total,'itemtotal': order.get_cart_items,}
    else:
        newData = {'quantity': orderItem.quantity, 'subtotal': orderItem.get_total, 
                   'grandtotal': order.get_cart_total, 'itemtotal': order.get_cart_items}

    return JsonResponse(newData)

def processOrder(request):
    transaction_id = datetime.datetime.now().timestamp()

    if not request.user.is_authenticated:
        return JsonResponse({'redirect': '/login'}, status=401)

    customer = request.user.customer
    order, created = Order.objects.get_or_create(customer=customer, complete=False)

    order.transaction_id = transaction_id
    order.complete = True
    order.save()

    order_items = order.orderitem_set.all()
    for item in order_items:
        product = item.product
        product.quantity -= item.quantity
        product.save()

    return JsonResponse({'message': 'Items have been checked out!'})