# Ejercicio 10: Deploy y CI/CD

## Descripción
Continuando con el proyecto de plataforma de descubrimiento y reseñas de libros del ejercicio anterior, ahora implementaremos un flujo completo de deployment y CI/CD para preparar la aplicación para producción.

## Objetivos
1. Realizar el deploy de la aplicación en un servicio de hosting
2. Implementar GitHub Actions para automatización
3. Crear un pipeline de CI/CD completo

## Tareas a Realizar

### 1. Deploy de la Aplicación
- Deployar la aplicación usando **Vercel** (recomendado) o alternativas como Netlify, Railway, etc.
- Configurar las variables de entorno necesarias en el servicio de hosting
- Verificar que la aplicación funcione correctamente en producción
- Documentar la URL de la aplicación deployada

### 2. GitHub Actions - Build en Pull Requests
Crear un GitHub Action que:
- Se ejecute automáticamente en cada Pull Request
- Instale las dependencias del proyecto
- Buildee la aplicación
- Falle el PR si el build no es exitoso
- Proporcione feedback claro sobre errores de build

### 3. GitHub Actions - Tests en Pull Requests  
Crear un GitHub Action que:
- Se ejecute automáticamente en cada Pull Request
- Instale las dependencias del proyecto
- Ejecute todos los tests unitarios
- Reporte los resultados de los tests
- Falle el PR si algún test no pasa

### 4. GitHub Actions - Docker Container
Crear un GitHub Action que:
- Se ejecute cuando se mergee código a la rama principal (main/master)
- Construya una imagen Docker de la aplicación
- Publique la imagen en GitHub Container Registry (ghcr.io)
- Use tags apropiados (latest, versión, commit hash)

## Consideraciones Técnicas

### Repositorio
- Pueden crear un nuevo repositorio público o usar el existente
- Se recomienda repositorio público para facilitar el uso de GitHub Actions gratuitas

### Dockerfile
- Crear un Dockerfile optimizado para la aplicación Next.js
- Usar imágenes base apropiadas (node:alpine recomendado)
- Implementar multi-stage build para optimizar el tamaño final
- Configurar correctamente las variables de entorno

### GitHub Actions
- Usar las versiones más recientes de las actions (node, docker, etc.)
- Implementar cache para dependencias para mejorar tiempos de build
- Usar secrets de GitHub para información sensible
- Documentar claramente cada workflow

## Entregables
Crear un pullrequest hacia el repositorio principal donde pongan la siguiente informacion:
1. **URL de la aplicación deployada** funcionando correctamente
2. **Repositorio GitHub** con el código y los workflows configurados
3. **Documentación** en el README explicando:
   - Cómo hacer el deploy local
   - Cómo funcionan los GitHub Actions
   - Variables de entorno necesarias
   - Instrucciones para ejecutar con Docker
4. **Demostración** de que los GitHub Actions funcionan correctamente

## Recursos Útiles
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)