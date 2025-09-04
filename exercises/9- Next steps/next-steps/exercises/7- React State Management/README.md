# Tarea 7: Gestión de Estado en React

Expandiremos nuestra aplicación de gestión de tareas refactorizando la gestión del estado y agregando nuevas funcionalidades.

El objetivo principal es introducir librerías de gestión de estado para manejar eficientemente los datos, tanto los que provienen del servidor como los del cliente.

## Refactorización de la Gestión de Estado:

- **Estado del Servidor:** Utilizar una librería como **Tanstack Query** o **SWR** para manejar los datos que provienen del backend (como la lista de tareas), incluyendo fetching, caching, sincronización y actualización. Crear custom hooks para las queries y mutaciones relacionadas con las tareas. Los componentes deben acceder a estos datos lo más cercanamente posible a la interfaz, es decir, evitar que estos vivan en el estado del componente padre y se pasen como props.
- **Estado del Cliente:** Utilizar una librería como **Redux**, **Zustand** o **Jotai** para gestionar estados propios del cliente que no persisten en el servidor (como el estado de los modales, notificaciones, etc.).

## Nuevas Funcionalidades:

Implementar las siguientes features, pensando en cómo su estado se integra con las librerías elegidas:

- **Estados de Loading y Error:** Mostrar indicadores visuales durante la carga de datos y mensajes de error adecuados en caso de fallos en las operaciones.
- **Paginación en las Tareas:** Implementar paginación para la lista de tareas. Esto requerirá cambios tanto en el frontend como potencialmente en los endpoints del servidor para soportar la paginación.
- **Sistema de Notificaciones (Toasts):** Crear un sistema de notificaciones emergentes (toasts) que informen al usuario sobre el resultado de acciones importantes (ej: tarea agregada, tarea eliminada, error al guardar).
- **Botón de Editar Tarea:** Agregar un botón de edición a cada tarea. Al hacer clic, se debe permitir modificar el texto de la tarea, reutilizando el formulario existente para la creación de tareas. El estado de la tarea que se está editando debe gestionarse adecuadamente. Agregar un botón de guardar y un botón de cancelar.
- **Múltiples Tableros de Tareas:** Implementar la posibilidad de tener múltiples tableros de tareas. Cada tablero deberá tener su propia ruta basada en un identificador único. Se debe poder crear nuevos tableros y eliminar tableros existentes.
- **Página de Configuraciones:** Crear una página de configuraciones donde se puedan ajustar parámetros globales. Por ahora, incluir dos configuraciones:
  - **Intervalo de Refetch de Tareas:** Un campo para definir cada cuánto tiempo se deben actualizar las tareas (por defecto: 10 segundos).
  - **Descripción en Mayúsculas:** Un interruptor booleano para decidir si la descripción de las tareas debe mostrarse siempre en mayúsculas.
- **Aplicación de Configuraciones:** Asegurar que los tableros de tareas apliquen las configuraciones definidas en la página de configuraciones (intervalo de refetch y formato de la descripción).

## Servidor

Si quieren simplificar el backend, pueden usar algo como [json-server](https://www.npmjs.com/package/json-server) para simular un servidor.

## Consideraciones Adicionales:

- Hacer énfasis en la **claridad, organización y mantenibilidad del código**.
- Evitar la **duplicación de lógica** y componentes tanto como sea posible.
- Diseñar la estructura de hooks y componentes de forma que sea **reutilizable y escalable**.
