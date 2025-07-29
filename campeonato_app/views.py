from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse
from .models import Equipo, Jugador, Partido
from .forms import EquipoForm, JugadorForm
import csv

from django.shortcuts import redirect

def home(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, 'campeonato_app/home.html')

def user_is_admin(user):
    return user.groups.filter(name='admin').exists()

def user_is_regular(user):
    return user.groups.filter(name='regular').exists()

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Check if user is in admin group
            if user.groups.filter(name='admin').exists():
                return redirect('home')
            else:
                # Redirect to superuser validation page if not admin
                return redirect('superuser_validation')
        else:
            return render(request, 'campeonato_app/login.html', {'error': 'Credenciales inválidas'})
    return render(request, 'campeonato_app/login.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def listar_equipos(request):
    equipos = Equipo.objects.all()
    return render(request, 'campeonato_app/equipos.html', {'equipos': equipos})

@login_required
def listar_jugadores(request):
    jugadores = Jugador.objects.all()
    return render(request, 'campeonato_app/jugadores.html', {'jugadores': jugadores})

@login_required
def listar_partidos(request):
    partidos = Partido.objects.all()
    return render(request, 'campeonato_app/partidos.html', {'partidos': partidos})

@login_required
@user_passes_test(user_is_admin)
def crear_equipo(request):
    if request.method == 'POST':
        form = EquipoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('equipos')
    else:
        form = EquipoForm()
    return render(request, 'campeonato_app/crear_equipo.html', {'form': form})

@login_required
@user_passes_test(user_is_admin)
def editar_equipo(request, equipo_id):
    equipo = Equipo.objects.get(id=equipo_id)
    if request.method == 'POST':
        form = EquipoForm(request.POST, request.FILES, instance=equipo)
        if form.is_valid():
            form.save()
            return redirect('equipos')
    else:
        form = EquipoForm(instance=equipo)
    return render(request, 'campeonato_app/editar_equipo.html', {'form': form})

@login_required
@user_passes_test(user_is_admin)
def eliminar_equipo(request, equipo_id):
    equipo = Equipo.objects.get(id=equipo_id)
    if request.method == 'POST':
        equipo.delete()
        return redirect('equipos')
    return render(request, 'campeonato_app/eliminar_equipo.html', {'equipo': equipo})

@login_required
def exportar_equipos_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="equipos.csv"'

    writer = csv.writer(response)
    writer.writerow(['Nombre', 'Categoria'])

    equipos = Equipo.objects.all()
    for equipo in equipos:
        writer.writerow([equipo.nombre, equipo.categoria])

    return response

@login_required
@user_passes_test(user_is_admin)
def crear_jugador(request):
    if request.method == 'POST':
        form = JugadorForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('jugadores')
    else:
        form = JugadorForm()
    return render(request, 'campeonato_app/crear_jugador.html', {'form': form})

@login_required
@user_passes_test(user_is_admin)
def editar_jugador(request, jugador_id):
    jugador = Jugador.objects.get(id=jugador_id)
    if request.method == 'POST':
        form = JugadorForm(request.POST, request.FILES, instance=jugador)
        if form.is_valid():
            form.save()
            return redirect('jugadores')
    else:
        form = JugadorForm(instance=jugador)
    return render(request, 'campeonato_app/editar_jugador.html', {'form': form})

@login_required
@user_passes_test(user_is_admin)
def eliminar_jugador(request, jugador_id):
    jugador = Jugador.objects.get(id=jugador_id)
    if request.method == 'POST':
        jugador.delete()
        return redirect('jugadores')
    return render(request, 'campeonato_app/eliminar_jugador.html', {'jugador': jugador})

@login_required
@user_passes_test(user_is_regular)
def mis_partidos(request):
    try:
        jugador = Jugador.objects.get(nombre=request.user.username)
        partidos_local = Partido.objects.filter(equipo_local=jugador.equipo)
        partidos_visitante = Partido.objects.filter(equipo_visitante=jugador.equipo)
        partidos = partidos_local | partidos_visitante
    except Jugador.DoesNotExist:
        partidos = Partido.objects.none()
    return render(request, 'campeonato_app/mis_partidos.html', {'partidos': partidos})

from .forms import UserRegisterForm, SuperuserValidationForm
from django.contrib import messages
from django.contrib.auth.models import Group

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Optionally, assign user to 'regular' group by default
            regular_group, created = Group.objects.get_or_create(name='regular')
            user.groups.add(regular_group)
            username = form.cleaned_data.get('username')
            messages.success(request, f'Cuenta creada para {username}. Ahora puedes iniciar sesión.')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'campeonato_app/register.html', {'form': form})

@login_required
def superuser_validation(request):
    if request.method == 'POST':
        form = SuperuserValidationForm(request.POST)
        if form.is_valid():
            key = form.cleaned_data['validation_key']
            # Replace 'SECRET_KEY' with your actual secret key
            if key == 'SUPERTEAM2023':
                user = request.user
                admin_group, created = Group.objects.get_or_create(name='admin')
                user.groups.add(admin_group)
                messages.success(request, 'Validación exitosa. Ahora tienes permisos de administrador.')
                return redirect('home')
            else:
                messages.error(request, 'Clave de validación incorrecta.')
    else:
        form = SuperuserValidationForm()
    return render(request, 'campeonato_app/superuser_validation.html', {'form': form})

def reportes(request):
    return render(request, 'campeonato_app/reportes.html')
