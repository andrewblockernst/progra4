Descripción del Proyecto: Tomar el proyecto de la plataforma de descubrimiento y reseñas de libros desarrollado en el ejercicio 9 y extenderlo con integración de base de datos NoSQL y sistema de autenticación completo.

Características a Agregar:

Integración con Base de Datos NoSQL (MongoDB)

Configurar conexión con MongoDB (puede ser local o MongoDB Atlas)
Migrar el almacenamiento de reseñas y votaciones desde el estado local a la base de datos
Implementar esquemas/modelos para:
Usuarios
Reseñas
Votaciones
Favoritos/Listas de lectura
Sistema de Autenticación y Autorización

Implementar registro de usuarios (email/password)
Sistema de login/logout
Protección de rutas que requieren autenticación
Middleware de autorización para operaciones CRUD
Persistir sesiones de usuario
Hash de contraseñas de forma segura
Funcionalidades Extendidas

Solo usuarios autenticados pueden escribir reseñas
Solo usuarios autenticados pueden votar reseñas
Los usuarios solo pueden editar/eliminar sus propias reseñas
Perfil de usuario con historial de reseñas
Lista de libros favoritos por usuario
APIs Externas a Mantener: Principal: Google Books API (misma implementación del ejercicio 9)

URL: https://www.googleapis.com/books/v1/volumes
Nivel gratuito: 1,000 requests/día
Tecnologías Sugeridas:

Base de datos: MongoDB
Autenticación: JWT tokens o sessions
Hash de contraseñas: bcrypt o argon2
Validación: Zod, Joi o similar para validar datos de entrada
Unit Testing

Mantener y extender las pruebas unitarias del ejercicio 9
Agregar pruebas para:
Funciones de autenticación
Operaciones CRUD de la base de datos
Middleware de autorización
Validación de datos
Mockear la conexión a la base de datos en las pruebas
Probar casos de autorización (acceso permitido/denegado)