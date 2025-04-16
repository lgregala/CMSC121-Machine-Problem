from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.registerPage, name="register"),
    path("login/", views.loginPage, name="login"),
    path("about/", views.aboutPage, name="about"),
    path("home/", views.homePage, name="home"),
]