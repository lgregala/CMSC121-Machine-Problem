from django.shortcuts import render, redirect
from .forms import RegisterForm
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
            return HttpResponse('Logged in successfully!')
        else:
            messages.error(request, "Incorrect password.")
            return redirect('login')

    return render(request, 'login.html')

def aboutPage(request):
    return render(request, 'about.html')

def homePage(request):
    return render(request, 'home.html')

def contactPage(request):
    return render(request, 'contact.html')

def productsPage(request):
    query = request.GET.get('search', '')
    main_category = request.GET.get('category', '')
    
    products = Product.objects.all()
    
    if query:
        # Search in name, scientific_name, category, subcategory, or description
        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(scientific_name__icontains=query) |
            Q(category__icontains=query) |
            Q(subcategory__icontains=query) |
            Q(description__icontains=query)
        ).distinct()
        
        # Add information about whether the search returned results
        search_performed = True
        no_results = products.count() == 0
    elif main_category:
        products = products.filter(category__iexact=main_category)
        search_performed = False
        no_results = products.count() == 0
    else:
        products = Product.objects.all()
        search_performed = False
        no_results = False
    
    context = {
        'products': products,
        'search_performed': search_performed,
        'no_results': no_results,
        'search_query': query
    }
    
    return render(request, 'products.html', context)