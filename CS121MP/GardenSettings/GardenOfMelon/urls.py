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
    path('guest_cookie_cart/', views.getGuestCookieCart, name='guest-cookie-cart'),
    path('process_order/', views.processOrder, name='process_order'),
    path('cart/home/', views.homePage, name='cart-home'),
    path('product_detail/<int:product_id>/', views.product_detail, name='product_detail'),
]