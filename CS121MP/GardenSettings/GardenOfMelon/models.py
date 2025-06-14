from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not password:
            raise ValueError('Superusers must have a password.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    phone_number = PhoneNumberField()

    # Use email as the login identifier instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']  

    objects = CustomUserManager()
    
    def __str__(self):
        return self.email
    
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, null=True)
    email = models.CharField(max_length=200, null=True)
    
    def __str__(self):
        return self.name

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from: {self.name}"

class Product(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, null=True)  # Plant_Name
    scientific_name = models.CharField(max_length=200, null=True)
    category = models.CharField(max_length=100, null=True)  # Plant_Category
    subcategory = models.CharField(max_length=100, null=True)  # Plant_SubCategory
    description = models.TextField(null=True, blank=True)
    difficulty = models.CharField(max_length=50, null=True)  # e.g., Easy, Moderate, Difficult
    light_needed = models.CharField(max_length=100, null=True)  # e.g., Full Sun, Partial Shade
    watering_schedule = models.CharField(max_length=100, null=True)  # e.g., Weekly, Twice a week
    price = models.FloatField()
    quantity = models.PositiveIntegerField(default=0)
    digital = models.BooleanField(default=False, null=True, blank=False)  # Optional, if digital products are part of store
    image = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.name
    
    def imageURL(self):
        return self.image.url
    
    @property
    def guestProductDictionary(self):
        return {'price': self.price, 'quantity': self.quantity}

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Cancelled', 'Cancelled'),
        ('Complete', 'Complete'),
    ]

    order_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, blank=True, null=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True, blank=False)
    transaction_id = models.CharField(max_length=200, null=True)
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return str(self.order_number)
    
    @property
    def guestOrderDictionary(self):
        return {'totalCartItems': self.get_cart_items, 'cartGrandtotal': self.get_cart_total}
    
    @property
    def get_cart_items(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitems])
        return total 
    
    @property
    def get_cart_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.subtotal for item in orderitems])
        return total 
    
   
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def subtotal(self):
        total = self.product.price * self.quantity
        return total

class ShippingAddress(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    region = models.CharField(max_length=200, blank=True, null=True)
    zipcode = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"Address of: {self.customer}"