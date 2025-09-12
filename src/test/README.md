# Testing Suite

Este directorio contiene la suite completa de pruebas unitarias para el proyecto de reseñas de libros.

## Estructura de Pruebas

```
src/test/
├── __tests__/           # Archivos de pruebas
│   ├── actions/         # Pruebas de server actions
│   ├── auth.test.ts     # Pruebas de autenticación
│   ├── api.test.ts      # Pruebas de API routes
│   ├── db.test.ts       # Pruebas de base de datos
│   ├── middleware.test.ts # Pruebas de middleware
│   ├── validation.test.ts # Pruebas de validación
│   └── components/      # Pruebas de componentes
│       ├── review-form.test.tsx
│       ├── dialog.test.tsx
│       └── search.real.test.tsx
├── mocks/               # Datos mock para pruebas
│   └── api.ts          # Mocks de API y datos de prueba
├── setup.ts            # Configuración global de pruebas
└── utils/              # Utilidades de prueba
    └── test-utils.tsx  # Helpers para testing-library
```

## Tipos de Pruebas Incluidas

### 1. **Pruebas de Autenticación** (`auth.test.ts`)
- ✅ Hashing de contraseñas
- ✅ Validación de credenciales
- ✅ Gestión de sesiones
- ✅ Validación de emails
- ✅ Operaciones CRUD de usuarios
- ✅ Manejo de errores de autenticación

### 2. **Pruebas de Base de Datos** (`db.test.ts`)
- ✅ Conexión a MongoDB
- ✅ Operaciones CRUD de reseñas
- ✅ Operaciones CRUD de usuarios
- ✅ Validación de datos
- ✅ Consultas y filtros
- ✅ Manejo de errores de BD

### 3. **Pruebas de Middleware** (`middleware.test.ts`)
- ✅ Validación de sesiones
- ✅ Protección de rutas
- ✅ Autorización por roles
- ✅ Rate limiting
- ✅ Manejo de errores

### 4. **Pruebas de Validación** (`validation.test.ts`)
- ✅ Validación de reseñas
- ✅ Validación de usuarios
- ✅ Validación de requests API
- ✅ Validación de base de datos
- ✅ Manejo de errores de validación

### 5. **Pruebas de API** (`api.test.ts`)
- ✅ Endpoints de reseñas
- ✅ Endpoints de autenticación
- ✅ Endpoints de favoritos
- ✅ Manejo de errores HTTP
- ✅ Validación de requests/responses

### 6. **Pruebas de Componentes**
- ✅ `ReviewForm`: Formulario de reseñas
- ✅ Interacciones de usuario
- ✅ Validación de formularios
- ✅ Manejo de estados
- ✅ Accesibilidad

## Configuración de Mocks

### Base de Datos
```typescript
// Mock completo de MongoDB
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue({})
}))
```

### Modelos
```typescript
// Mock de modelos Mongoose
vi.mock('@/models/Review', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    // ... otros métodos
  }
}))
```

### APIs Externas
```typescript
// Mock de fetch global
global.fetch = vi.fn()
```

### NextAuth
```typescript
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  getServerSession: vi.fn(),
}))
```

## Ejecución de Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas con coverage
```bash
npm run test:coverage
```

### Ejecutar pruebas específicas
```bash
# Por archivo
npm test auth.test.ts
npm test db.test.ts

# Por patrón
npm test -- --reporter=verbose
npm test -- components/
```

### Ejecutar pruebas en modo watch
```bash
npm run test:watch
```

## Umbrales de Cobertura

```
Global:
- Branches: 75%
- Functions: 80%
- Lines: 80%
- Statements: 80%

Por directorio:
- Components: 70-75%
- API Routes: 70-75%
- Utilities: 80-85%
```

## Mocks Disponibles

### Datos de Prueba
- `mockReviews`: Array de reseñas de ejemplo
- `mockUsers`: Array de usuarios de ejemplo
- `mockFavorites`: Array de favoritos de ejemplo
- `mockGoogleBooksResponse`: Respuesta de Google Books API

### Funciones Helper
- `createMockReview()`: Crea una reseña mock
- `createMockUser()`: Crea un usuario mock
- `createMockBook()`: Crea un libro mock

### Sesiones Mock
- `mockAuthenticatedSession`: Sesión autenticada
- `mockUnauthenticatedSession`: Sesión no autenticada

## Mejores Prácticas

### Estructura de Pruebas
```typescript
describe('Component Name', () => {
  describe('Specific Feature', () => {
    it('should handle specific scenario', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Mocks y Spies
```typescript
const mockFunction = vi.fn()
vi.mocked(mockFunction).mockResolvedValue(expectedValue)
```

### Cleanup
```typescript
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.resetAllMocks()
})
```

## Debugging

### Ver output detallado
```bash
npm test -- --reporter=verbose
```

### Ver coverage en navegador
```bash
npm run test:coverage
# Abrir coverage/html/index.html
```

### Debug de componentes
```typescript
// En pruebas de componentes
screen.debug() // Muestra el DOM actual
screen.logTestingPlaygroundURL() // URL para testing playground
```

## CI/CD Integration

Las pruebas están configuradas para ejecutarse en CI/CD con:

- ✅ Cobertura automática
- ✅ Umbrales de calidad
- ✅ Reportes HTML/JSON
- ✅ Exclusión de archivos innecesarios
- ✅ Timeouts apropiados

## Troubleshooting

### Problemas Comunes

1. **Error de imports**: Verificar aliases en `vitest.config.mts`
2. **Mocks no funcionan**: Usar `vi.clearAllMocks()` en `beforeEach`
3. **Coverage baja**: Revisar archivos excluidos en configuración
4. **Tests lentos**: Verificar timeouts y mocks de red

### Comandos Útiles

```bash
# Limpiar cache
npm test -- --clearCache

# Ejecutar solo tests fallidos
npm test -- --run --reporter=verbose

# Ver ayuda
npm test -- --help
```
