from django.db import models

class Equipo(models.Model):
    nombre = models.CharField(max_length=100)
    escudo = models.ImageField(upload_to='escudos/', null=True, blank=True)
    categoria = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class Jugador(models.Model):
    nombre = models.CharField(max_length=100)
    edad = models.IntegerField()
    posicion = models.CharField(max_length=50)
    dorsal = models.IntegerField()
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} ({self.equipo.nombre})"

class Partido(models.Model):
    equipo_local = models.ForeignKey(Equipo, related_name='local', on_delete=models.CASCADE)
    equipo_visitante = models.ForeignKey(Equipo, related_name='visitante', on_delete=models.CASCADE)
    fecha = models.DateTimeField()
    marcador_local = models.IntegerField(default=0)
    marcador_visitante = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.equipo_local} vs {self.equipo_visitante}"
