from django import forms
from .models import Equipo, Jugador, Partido

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
