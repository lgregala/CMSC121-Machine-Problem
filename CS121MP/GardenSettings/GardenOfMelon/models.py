from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    #phone = models.CharField(max_length=11, null=True)
    phone_number = PhoneNumberField(default="+639123456789")

    # Use email as the login identifier instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']  
    
    def __str__(self):
        return self.email