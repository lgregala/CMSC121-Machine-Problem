from django.contrib import admin
from .models import *

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'scientific_name', 'category', 'subcategory', 
                    'description', 'difficulty', 'light_needed', 'watering_schedule', 
                    'price', 'quantity']


admin.site.register(User)
admin.site.register(Customer)
admin.site.register(ContactMessage)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
