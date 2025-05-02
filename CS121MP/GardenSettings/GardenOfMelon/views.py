from django.shortcuts import render, redirect
from .forms import RegisterForm, ContactForm
from django.http import HttpResponse
from django.http import JsonResponse
from .models import *
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.messages import get_messages
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q
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
    context2 = get_cart_data(request)
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
            return redirect('home')
        else:
            messages.error(request, "Incorrect password.")
            return redirect('login')
    
    context = get_cart_data(request)
    return render(request, 'login.html', context)

def aboutPage(request):
    context = get_cart_data(request)
    return render(request, 'about.html', context)

def homePage(request):
    context1 = {}
    
    if request.user.is_authenticated:
        context1['user'] = request.user
    
    context2 = get_cart_data(request)
    context = {**context1, **context2}
    
    return render(request, 'home.html', context)

def contactPage(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('contact.html')
    else:
        form = ContactForm()

    context1 = {'form': form}
    context2 = get_cart_data(request)
    context = {**context1, **context2}
    return render(request, 'contact.html', context)

def productsPage(request):
    query = request.GET.get('search', '')
    main_category = request.GET.get('category', '')

    min_price = request.GET.get('minprice', '')
    max_price = request.GET.get('maxprice', '')
    
    products = Product.objects.all()
    
    if query:
        products = products.filter(
            Q(name__icontains=query) |
            Q(scientific_name__icontains=query) |
            Q(category__icontains=query) |
            Q(subcategory__icontains=query) |
            Q(description__icontains=query)
        ).distinct()

    if main_category:
        products = products.filter(subcategory__iexact=main_category)

    if min_price:
        min_price = float(min_price)
        products = products.filter(price__gte=min_price)

    if max_price:
        max_price = float(max_price)
        products = products.filter(price__lte=max_price)
    
    context1 = {
        'products': products,
        'search_performed': bool(query),
        'no_results': not products.exists(),
        'search_query': query,
        'current_category': main_category,
        'filterMin_performed': bool(min_price),
        'filterMax_performed': bool(max_price),
        'min_price': min_price or 0,
        'max_price': max_price or 0,
    }

    context2 = get_cart_data(request)
    context = {**context1, **context2}

    return render(request, 'products.html', context)

def cart(request):
    context = get_cart_data(request)
    return render(request, 'cart.html', context)

def get_cart_data(request):
    if request.user.is_authenticated:
        customer = request.user
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        items = []
        order = {'get_cart_total': 0, 'get_cart_items': 0}
        cartItems = order['get_cart_items']

    return {'items': items, 'order': order, 'cartItems': cartItems}

def updateItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']

    print('Action:', action)
    print('productId:', productId)

    customer = request.user
    product = Product.objects.get(id=productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)
 
    if action == 'add':
        orderItem.quantity += 1
    elif action == 'remove':
        orderItem.quantity -= 1

    orderItem.save()
    if orderItem.quantity <= 0:
        orderItem.delete()

    return JsonResponse('Item was added', safe=False)