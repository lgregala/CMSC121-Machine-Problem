from django.contrib import admin
from .models import *

# Manually set the current admin as the seller of the product
class ProductAdmin(admin.ModelAdmin):
    # Make it non-editable
    readonly_fields = ('seller',)

    def save_model(self, request, obj, form, change):
        if not obj.seller:
            obj.seller = request.user
        obj.save()
        
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