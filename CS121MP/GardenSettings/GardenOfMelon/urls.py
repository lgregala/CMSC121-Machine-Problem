from django.urls import path
from . import views
from django.contrib import admin

urlpatterns = [
    path('register/', views.registerPage, name='register'),
    path('login/', views.loginPage, name='login'),
    path('about/', views.aboutPage, name='about'),
    path('home/', views.homePage, name='home'),
    path('', views.homePage, name='home'),
    path('contact/', views.contactPage, name='contact'),
    path('products/', views.productsPage, name='products'),
    path('cart/', views.cart, name='cart'),
    path('update_item/', views.updateItem, name='update_item'),
    path('process_order/', views.processOrder, name='process_order'),
    path('cart/home/', views.homePage, name='cart-home'),
]