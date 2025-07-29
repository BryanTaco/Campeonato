from django import forms
from .models import Equipo, Jugador, Partido
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class EquipoForm(forms.ModelForm):
    class Meta:
        model = Equipo
        fields = '__all__'

class JugadorForm(forms.ModelForm):
    class Meta:
        model = Jugador
        fields = '__all__'

class PartidoForm(forms.ModelForm):
    class Meta:
        model = Partido
        fields = '__all__'

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class SuperuserValidationForm(forms.Form):
    validation_key = forms.CharField(
        label='Clave de validación para superusuario',
        max_length=100,
        widget=forms.PasswordInput
    )
