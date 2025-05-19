from django.contrib import admin
from .models import *
from django import forms
from django.utils.html import format_html
from django.urls import path, reverse
from .views import OrderDetailView

class ProductForm(forms.ModelForm):
    # Category choices
    CATEGORY_CHOICES = [
        ('Ornamentals', 'Ornamentals'),
        ('Botanical Collections', 'Botanical Collections'),
        ('Functional Plants', 'Functional Plants'),
    ]

    # Subategory choices
    SUBCATEGORY_CHOICES = [
        ('Succulents', 'Succulents'),
        ('Flowering Beauties', 'Flowering Beauties'),
        ('Indoor Ornamentals', 'Indoor Ornamentals'),
        ('Outdoor Adventurers', 'Outdoor Adventurers'),
        ('Aglaonema', 'Aglaonema'),
        ('Alocasia', 'Alocasia'),
        ('Begonia', 'Begonia'),
        ('Dracaena', 'Dracaena'),
        ('Ficus', 'Ficus'),
        ('Monstera', 'Monstera'),
        ('Philodendron', 'Philodendron'),
        ('Pothos', 'Pothos'),
        ('Sansevieria', 'Sansevieria'),
        ('Fruit-bearing', 'Fruit-bearing'),
        ('Herbs and Edibles', 'Herbs and Edibles'),
        ('Bloom and Doom', 'Bloom and Doom'),
    ]

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
    category = forms.ChoiceField(choices=CATEGORY_CHOICES)
    subcategory = forms.ChoiceField(choices=SUBCATEGORY_CHOICES)
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

class OrderItemInLine(admin.TabularInline):
    model = OrderItem

class OrderItemAdmin(admin.ModelAdmin):
    list_display = [ 'order', 'product', 'quantity', 'subtotal']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(order__order_number__isnull=True)

class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number','customer', 'date_ordered', 'transaction_id', 'order_status', 'order_detail']
    inlines = [OrderItemInLine]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(order_number__isnull=True)

    def get_urls(self):
        urls = super().get_urls()
        return [
            path(
                '<pk>/orderdetails/',
                self.admin_site.admin_view(OrderDetailView.as_view()),
                name =f"order_detail",
            ),
        ] + urls
    
    def order_detail(self, obj):
        url = reverse("admin:order_detail", args=[obj.pk])
        return format_html(f'<a href={url}>Order details</a>', url)
    
admin.site.register(User)
admin.site.register(Customer)
admin.site.register(ContactMessage)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress)