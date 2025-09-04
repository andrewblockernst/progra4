# Tarea 8: Backend Avanzado con Autenticación y Autorización

En este ejercicio desarrollaremos un backend robusto y completo usando **Express.js** que soporte todas las funcionalidades implementadas hasta el momento, agregando autenticación de usuarios, autorización basada en permisos y persistencia en **base de datos relacional**.

## Objetivos Principales

1. **Arquitectura Backend Escalable:** Implementar una API REST bien estructurada y mantenible usando **Express.js**
2. **Base de Datos Relacional:** Utilizar una base de datos relacional para el almacenamiento persistente
3. **Autenticación Segura:** Implementar sistema de registro e inicio de sesión con almacenamiento seguro de credenciales
4. **Autorización Granular:** Sistema de permisos que permita control de acceso a tableros y tareas
5. **Integración Frontend:** Conectar la aplicación React existente con el nuevo backend

## Funcionalidades Requeridas

### 1. Sistema de Tableros

- Los usuarios autenticados pueden crear tableros de tareas
- Cada tablero debe tener un propietario que puede controlarlo completamente
- Los propietarios pueden compartir acceso a sus tableros con otros usuarios
- Implementar diferentes niveles de acceso (propietario, editor, solo lectura)
- Los usuarios solo pueden ver y acceder a tableros donde tienen permisos

### 2. Gestión Avanzada de Tareas

- Mantener todas las funcionalidades existentes: crear, editar, eliminar, completar tareas
- Las tareas pertenecen a tableros específicos
- Solo usuarios con permisos apropiados pueden modificar tareas
- Implementar paginación para manejar grandes cantidades de tareas
- Agregar capacidades de filtrado y búsqueda
- Eliminar tareas completadas en lote
- Filtrar tareas por diferentes criterios
- Búsqueda de tareas por contenido

### 3. Configuraciones Personalizadas

Los usuarios deben poder personalizar aspectos de la aplicación:

- Configurar intervalos de actualización automática
- Personalizar la visualización de las tareas
- Guardar preferencias que persistan entre sesiones
- Las configuraciones deben aplicarse automáticamente en la interfaz

### 4. Sistema de Usuarios

- Los usuarios deben poder registrarse en el sistema proporcionando la información necesaria
- Los usuarios deben poder iniciar sesión usando sus credenciales
- Implementar un sistema seguro de manejo de sesiones usando **JWT en HTTP-only cookies**
- Los usuarios deben poder cerrar sesión de manera segura
- Proteger las rutas que requieren autenticación

### 5. Sistema de Permisos

- Solo los propietarios pueden eliminar tableros o cambiar permisos
- Los usuarios con permisos de edición pueden gestionar tareas
- Los usuarios con permisos de solo lectura pueden ver pero no modificar

## Integración Frontend

**Modificaciones en React:**

- Actualizar la aplicación React existente para trabajar con el nuevo sistema de autenticación
- Implementar formularios de registro e inicio de sesión
- Manejar el estado de autenticación globalmente
- Adaptar la gestión de estado para trabajar con múltiples tableros
- Implementar interfaz para compartir tableros y gestionar permisos
- Crear página de configuraciones de usuario
- Manejar adecuadamente errores de autenticación y autorización

**Consideraciones de Seguridad:**

- Manejar tokens de autenticación de manera segura
- Implementar redirecciones automáticas según el estado de autenticación
- Manejar expiración de sesiones adecuadamente

## Requisitos Técnicos

### Backend

- Usar **Express.js** como framework principal
- Implementar una **base de datos relacional** (elige la que prefieras)
- Crear una API REST bien estructurada y documentada
- Implementar middlewares apropiados para autenticación, autorización y validación
- Manejar errores de manera consistente
- Organizar el código de manera mantenible y escalable

### Seguridad

- Almacenar contraseñas de manera segura
- Implementar autenticación basada en JWT
- Usar HTTP-only cookies para almacenar tokens
- Validar y sanitizar todas las entradas
- Implementar protecciones contra ataques comunes
- Configurar CORS apropiadamente

### Base de Datos

- Diseñar un esquema relacional apropiado
- Implementar relaciones entre entidades (usuarios, tableros, tareas, permisos)
- Crear índices para optimizar consultas frecuentes
- Implementar migraciones para cambios de esquema

## Criterios de Evaluación

1. **Arquitectura y Organización:** Código bien estructurado, mantenible y siguiendo mejores prácticas
2. **Seguridad:** Implementación robusta de autenticación y autorización
3. **Funcionalidad:** Todas las características funcionan correctamente
4. **Integración:** La aplicación React se conecta seamlessly con el backend
5. **Calidad del Código:** Código limpio, bien documentado y testeable
6. **Manejo de Errores:** Respuestas de error apropiadas y consistentes
7. **Performance:** Queries optimizadas y uso eficiente de recursos

## Entregables

1. **Código Backend completo** con todas las funcionalidades implementadas
2. **Base de datos configurada** con esquema apropiado y datos de prueba
3. **Aplicación React actualizada** e integrada con el nuevo backend
4. **Documentación de la API** con descripción de endpoints y ejemplos
5. **Instrucciones de configuración** para ejecutar el proyecto localmente

## Consideraciones Adicionales

- Piensa cuidadosamente en el diseño de la base de datos antes de implementar
- Considera la experiencia del usuario al diseñar los flujos de autenticación
- Implementa validaciones robustas tanto en el frontend como en el backend
- Maneja casos edge apropiadamente (usuarios sin tableros, tableros sin tareas, etc.)
- Considera la escalabilidad en tus decisiones de diseño

¡Éxito en la implementación!
