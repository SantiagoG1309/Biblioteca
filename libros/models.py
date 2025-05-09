from django.db import models
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from aldjemy.meta import AldjemyMeta
from usuarios.models import Usuario

class Autor(models.Model, metaclass=AldjemyMeta):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    biografia = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    __sa_columns__ = [
        Column('nombre', String(100)),
        Column('apellido', String(100)),
        Column('biografia', Text),
        Column('fecha_creacion', DateTime)
    ]

    class Meta:
        db_table = 'autores'
        verbose_name = 'Autor'
        verbose_name_plural = 'Autores'
        ordering = ['apellido', 'nombre']

    def __str__(self):
        return f'{self.nombre} {self.apellido}'

class Categoria(models.Model, metaclass=AldjemyMeta):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    __sa_columns__ = [
        Column('nombre', String(100)),
        Column('descripcion', Text),
        Column('fecha_creacion', DateTime)
    ]

    class Meta:
        db_table = 'categorias'
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Libro(models.Model, metaclass=AldjemyMeta):
    ESTADOS = [
        ('DISPONIBLE', 'Disponible'),
        ('PRESTADO', 'Prestado'),
        ('NO_DISPONIBLE', 'No Disponible'),
    ]

    titulo = models.CharField(max_length=200)
    autor = models.ForeignKey(Autor, on_delete=models.PROTECT, related_name='libros')
    editorial = models.CharField(max_length=100)
    año_publicacion = models.IntegerField()
    descripcion = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='DISPONIBLE')
    cantidad_total = models.IntegerField(default=1, verbose_name='Cantidad disponible para préstamo')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='libros', null=True, default=None)

    __sa_columns__ = [
        Column('titulo', String(200)),
        Column('autor_id', Integer, ForeignKey('autores.id')),
        Column('editorial', String(100)),
        Column('año_publicacion', Integer),
        Column('descripcion', Text),
        Column('estado', String(20)),
        Column('cantidad_total', Integer),
        Column('fecha_registro', DateTime),
        Column('registrado_por_id', Integer, ForeignKey('usuarios.id')),
        Column('categoria_id', Integer, ForeignKey('categorias.id'))
    ]

    class Meta:
        db_table = 'libros'
        verbose_name = 'Libro'
        verbose_name_plural = 'Libros'
        ordering = ['titulo']

    def __str__(self):
        return f'{self.titulo} - {self.autor}'

    def actualizar_disponibilidad(self):
        self.estado = 'DISPONIBLE' if self.cantidad_total > 0 else 'NO_DISPONIBLE'
        self.save()