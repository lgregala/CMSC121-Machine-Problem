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
import json
from django.db.models import Q # for database queries

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
    
    return render(request, 'register.html', {'form': form})

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

    return render(request, 'login.html')

def aboutPage(request):
    return render(request, 'about.html')

def homePage(request):
    context = {}
    
    if request.user.is_authenticated:
        context['user'] = request.user
    
    return render(request, 'home.html', context)

def contactPage(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('contact.html')
    else:
        form = ContactForm()
    return render(request, 'contact.html', {'form': form})

def productsPage(request):
    query = request.GET.get('search', '')
    main_category = request.GET.get('category', '')
    
    # Start with all products
    products = Product.objects.all()
    
    # Apply search filter if a search query exists
    if query:
        products = products.filter(
            Q(name__icontains=query) |
            Q(scientific_name__icontains=query) |
            Q(category__icontains=query) |
            Q(subcategory__icontains=query) |
            Q(description__icontains=query)
        ).distinct()

    # Apply category filter if a category is specified
    if main_category:
        products = products.filter(subcategory__iexact=main_category)
    
    context = {
        'products': products,
        'search_performed': bool(query),
        'no_results': not products.exists(),
        'search_query': query,
        'current_category': main_category
    }
    
    return render(request, 'products.html', context)

def cart(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=request.user, complete=False)
        items = order.orderitem_set.all()
    else:
        order = {'get_cart_total':0, 'get_cart_items':0}
        items = []

    context = {'items': items, 'order': order}
    return render(request, 'cart.html', context)