from django import forms
from .models import User, ContactMessage
from phonenumber_field.formfields import PhoneNumberField

class RegisterForm(forms.ModelForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    phone_number = PhoneNumberField(
        required=True,
        error_messages={
            'invalid': 'Use +63 or 09XXXXXXXXX as PH phone format.',
        }
    )
    password = forms.CharField(widget=forms.PasswordInput)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'phone_number']
        labels = {
            'first_name': 'First name',
            'last_name': 'Last name',
        }

class ContactForm(forms.ModelForm):
    name = forms.CharField(required=True)
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']