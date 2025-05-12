from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Customer

# Signal to create a 'Customer' when a new 'User' is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_customer(sender, instance, created, **kwargs):
    if created:
        Customer.objects.create(
            user=instance,
            name=instance.first_name + " " + instance.last_name,
            email=instance.email,
            address='457 Mango Street, Brgy. Alua',
            city='San Ildefonso',
            state='NCR (National Capital Region)',
            zipcode='1109',
        )

# Signal to save the 'Customer' instance whenever the 'User' instance is saved
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_customer(sender, instance, **kwargs):
    if hasattr(instance, 'customer'):
        instance.customer.save()
