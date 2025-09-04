Descripción del Proyecto:
Construir una plataforma de descubrimiento y reseñas de libros donde los usuarios pueden buscar libros, ver detalles y compartir reseñas con votación comunitaria.
Características Principales:

Buscar Libros: Búsqueda por título, autor o ISBN usando la API de Google Books
Detalles del Libro: Mostrar imagen de portada, descripción, info del autor, detalles de publicación
Escribir Reseñas: Los usuarios pueden agregar calificaciones (1-5 estrellas) y reseñas escritas
Votación Comunitaria: Votar a favor/en contra de las reseñas para destacar el mejor contenido

APIs Externas a Usar
Principal: **Google Books API**

- **URL:** https://www.googleapis.com/books/v1/volumes
- **Nivel gratuito:** 1,000 requests/día (más que suficiente para proyectos de clase)
- **Autenticación:** No se requiere clave API para uso básico

**Ejemplos de Búsqueda:**

- Por título: `?q=harry+potter`
- Por ISBN: `?q=isbn:9780439708180`
- Por autor: `?q=inauthor:rowling`

**Características:**

- Datos completos: Portadas, descripciones, cantidad de páginas, categorías, info de publicación
- Imágenes de alta calidad: Múltiples tamaños de portada disponibles

**Unit Testing**

- Agregar pruebas unitarias que cubran completamente la lógica de negocios de su aplicación.
- Utilizar vitest en conjunto con testing-library para esto.
- Asegurense de probar todos los edge cases.
- Distinguir claramente qué debe ser mockeado y qué debe probarse directamente.

