from django.contrib import admin
from .models import *
from django import forms
from django.utils.html import format_html

class ProductForm(forms.ModelForm):
    # Difficulty choices
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    # Light needed choices
    LIGHT_CHOICES = [
        ('bright indirect light', 'Bright Indirect Light'),
        ('bright to direct light', 'Bright to Direct Light'),
        ('bright to low indirect', 'Bright to Low Indirect'),
        ('bright to medium indirect', 'Bright to Medium Indirect'),
        ('bright to medium light', 'Bright to Medium Light'),
        ('direct light', 'Direct Light'),
        ('direct to bright indirect', 'Direct to Bright Indirect'),
        ('medium to low indirect', 'Medium to Low Indirect'),
    ]
    
    # Watering schedule choices 
    WATERING_CHOICES = [
        ('once a week', 'Once a week'),
        ('once to twice a week', 'Once to twice a week'),
        ('once to thrice a week', 'Once to thrice a week'),
    ]
    
    # Convert fields to dropdowns
    difficulty = forms.ChoiceField(choices=DIFFICULTY_CHOICES)
    light_needed = forms.ChoiceField(choices=LIGHT_CHOICES)
    watering_schedule = forms.ChoiceField(choices=WATERING_CHOICES)

    class Meta:
        model = Product
        fields = '__all__'

class ProductAdmin(admin.ModelAdmin):
    form = ProductForm
    readonly_fields = ('seller',)
    list_display = ['display_image', 'name', 'scientific_name', 'category', 'subcategory', 
                   'description', 'difficulty', 'light_needed', 'watering_schedule', 
                   'price', 'quantity']
    
    def display_image(self, obj):
        if obj.image:
            return format_html(
                '<a href="{}" target="_blank">'
                '<img src="{}" style="max-height: 50px; max-width: 50px; border-radius: 4px;" />'
                '</a>',
                obj.image.url,
                obj.image.url
            )
        return "-"
    display_image.short_description = 'Image'

    def save_model(self, request, obj, form, change):
        if not obj.seller:
            obj.seller = request.user
        obj.save()
    
admin.site.register(User)
admin.site.register(Customer)
admin.site.register(ContactMessage)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)