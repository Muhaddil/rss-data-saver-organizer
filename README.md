# RSS Data Saver & Organizer

Sistema de gestion de descubrimientos de la Royal Space Society (No Man's Sky).

## Instalacion

```bash
# Instalar dependencias
pnpm install:all

# Crear base de datos con datos de ejemplo
pnpm seed

# Ejecutar en desarrollo
pnpm dev
```

## Credenciales por defecto

| Usuario | Password | Rol |
|---------|----------|-----|
| admin | admin123 | admin |
| user | user123 | user |

## URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Endpoints API

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Usuario actual

### Entidades (CRUD)
- `/api/systems` - Sistemas
- `/api/planets` - Planetas
- `/api/bases` - Bases
- `/api/entities/fauna` - Fauna
- `/api/entities/flora` - Flora
- `/api/entities/minerals` - Minerales
- `/api/entities/starships` - Naves
- `/api/entities/settlements` - Asentamientos
- `/api/entities/multitools` - Multitools
- `/api/entities/derelicts` - Derelictos
- `/api/entities/sandworms` - Sandworms
- `/api/entities/racetracks` - Pistas

### Wiki Generator
- `GET /api/generate/:type/:id` - Generar codigo wiki

### Stats
- `GET /api/stats` - Estadisticas globales
