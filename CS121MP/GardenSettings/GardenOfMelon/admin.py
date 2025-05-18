from django.contrib import admin
from .models import *
from django import forms
from django.utils.html import format_html

class ProductForm(forms.ModelForm):
    # Difficulty choices
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    
    # Light needed choices
    LIGHT_CHOICES = [
        ('Bright Indirect Light', 'Bright Indirect Light'),
        ('Bright to Direct Light', 'Bright to Direct Light'),
        ('Bright to Low Indirect', 'Bright to Low Indirect'),
        ('Bright to Medium Indirect', 'Bright to Medium Indirect'),
        ('Bright to Medium Light', 'Bright to Medium Light'),
        ('Direct Light', 'Direct Light'),
        ('Direct to Bright Indirect', 'Direct to Bright Indirect'),
        ('Medium to Low Indirect', 'Medium to Low Indirect'),
    ]
    
    # Watering schedule choices 
    WATERING_CHOICES = [
        ('Once a Week', 'Once a Week'),
        ('Once to Twice a Week', 'Once to Twice a Week'),
        ('Once to Thrice a Week', 'Once to Thrice a Week'),
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
    
    # To make the product names clickable for editing purposes
    list_display_links = ('name',)

    def display_image(self, obj):
        if obj.image:
            return format_html(
                '<a href="{}" target="_blank">'
                '<img src="{}" style="max-height: 50px; max-width: 50px; border-radius: 5px;" />'
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