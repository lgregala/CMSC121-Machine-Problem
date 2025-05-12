from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Customer

# Signal to create a 'Customer' when a new 'User' is created
@receiver(post_save, sender=User)
def create_customer(sender, instance, created, **kwargs):
    if created:
        Customer.objects.create(
            user=instance,
            name=instance.username,
            email=instance.email,
        )

# Signal to save the 'Customer' instance whenever the 'User' instance is saved
@receiver(post_save, sender=User)
def save_customer(sender, instance, **kwargs):
    if hasattr(instance, 'customer'):
        instance.customer.save()
