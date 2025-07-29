from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('equipos/', views.listar_equipos, name='equipos'),
    path('equipos/crear/', views.crear_equipo, name='crear_equipo'),
    path('equipos/editar/<int:equipo_id>/', views.editar_equipo, name='editar_equipo'),
    path('equipos/eliminar/<int:equipo_id>/', views.eliminar_equipo, name='eliminar_equipo'),
    path('jugadores/', views.listar_jugadores, name='jugadores'),
    path('jugadores/crear/', views.crear_jugador, name='crear_jugador'),
    path('jugadores/editar/<int:jugador_id>/', views.editar_jugador, name='editar_jugador'),
    path('jugadores/eliminar/<int:jugador_id>/', views.eliminar_jugador, name='eliminar_jugador'),
    path('partidos/', views.listar_partidos, name='partidos'),
    path('reportes/', views.reportes, name='reportes'),
    path('equipos/exportar/csv/', views.exportar_equipos_csv, name='exportar_equipos_csv'),
    path('mis_partidos/', views.mis_partidos, name='mis_partidos'),
    path('superuser_validation/', views.superuser_validation, name='superuser_validation'),
]
