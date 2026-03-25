# Guia Frontend: Colaboradores, Profesores y Salones

Esta guia resume como implementar en frontend los flujos de:
- Colaboradores (acceso por carrera)
- Profesores (asignables por carrera)
- Salones (CRUD por carrera)

Basado en el backend actual (`/api/v1`) sin inventar endpoints.

---

## 1) Regla principal de arquitectura (muy importante)

### Colaboradores y profesores NO son lo mismo
- **Colaborador**: acceso de usuario a una carrera (`roles_carrera`).
- **Profesor**: entidad academica (`profesores`) y su vinculo a carrera (`profesores_carrera`).

Por eso pasa este problema:
- Si solo agregas colaborador, puede entrar, pero no siempre es asignable a materias.
- Si solo agregas profesor, puede ser asignable, pero no tiene acceso a la carrera.

### Solucion recomendada en frontend
Crear una accion unica en UI: **"Agregar persona a la carrera"**, y ejecutar dos pasos:
1. Alta de colaborador.
2. Alta/vinculo de profesor.

Asi evitas procesos manuales repetidos y errores de asignacion.

---

## 2) Colaboradores (acceso a carrera)

## Endpoints

### Listar colaboradores de una carrera
- `GET /api/v1/carreras/:carreraId/colaboradores`

### Agregar colaborador
- `POST /api/v1/carreras/:carreraId/colaboradores`
- Body:
```json
{
  "email": "usuario@dominio.com",
  "rol": "admin"
}
```
`rol` permitido: `admin` o `viewer`.

### Actualizar rol de colaborador
- `PUT /api/v1/colaboradores/:id`
- Body:
```json
{ "rol": "viewer" }
```

### Eliminar colaborador
- `DELETE /api/v1/colaboradores/:id`

## Errores comunes y solucion

### 404 al agregar colaborador por email
Mensaje esperado: usuario no existe en plataforma.
- Causa: el endpoint busca en `profiles`; si no existe, no puede agregar.
- Solucion frontend:
  - Mostrar mensaje: "Debe registrarse/iniciar sesion primero".
  - Reintentar cuando exista en `profiles`.

### 400 al degradar/eliminar colaborador
- Causa: intentas quitar al ultimo admin de la carrera.
- Solucion:
  - Antes de degradar/eliminar, valida en UI que haya al menos otro admin.

---

## 3) Profesores (maestros) por carrera

## Endpoints

### Listar profesores accesibles al usuario
- `GET /api/v1/profesores`

> Nota: este endpoint puede traer profesores de varias carreras a las que el usuario tiene acceso.  
> En UI, siempre filtra por la carrera seleccionada.

### Crear profesor y vincular a carrera
- `POST /api/v1/profesores`
- Body:
```json
{
  "nombre_completo": "Nombre Apellido",
  "email": "usuario@dominio.com",
  "carrera_id": "UUID_CARRERA"
}
```

Comportamiento backend:
- Si ya existe profesor por email, reutiliza ese registro.
- Luego lo vincula a la carrera con upsert en `profesores_carrera`.

### Actualizar profesor
- `PUT /api/v1/profesores/:id`

### Eliminar profesor
- `DELETE /api/v1/profesores/:id`

## Flujo recomendado para no duplicar proceso

Cuando en UI invites una persona para participar en una carrera y quieres que tambien sea profesor:
1. `POST /carreras/:carreraId/colaboradores`
2. `POST /profesores` con el mismo email y `carrera_id`

Si paso 1 falla por 404 (no existe perfil), puedes:
- crear/vincular profesor igual, pero avisar que no tendra acceso hasta registrarse.

## Error clave que debes evitar

### "Profesor does not exist or is not linked to the group's career"
- Ocurre al crear asignacion si el `profesor_id` no esta en `profesores_carrera` para la carrera del grupo.
- Prevencion frontend:
  - Antes de asignar, asegurar que el profesor esta vinculado a la carrera (con `POST /profesores`).
  - En UI de asignacion, mostrar solo profesores vinculados a la carrera activa.

---

## 4) Salones

## Endpoints

### Listar salones de una carrera
- `GET /api/v1/carreras/:carreraId/salones`

### Crear salon para carrera
- `POST /api/v1/carreras/:carreraId/salones`
- Body:
```json
{
  "nombre": "A-101",
  "edificio": "Edificio A",
  "tipo": "aula"
}
```
`tipo` permitido: `aula`, `laboratorio`, `sala`.

### Editar salon
- `PUT /api/v1/salones/:id`

### Eliminar salon
- `DELETE /api/v1/salones/:id`

## Error comun al crear salon

### "A classroom with this name already exists"
- Causa: `salones.nombre` es unico global, no por carrera.
- Solucion actual (sin cambiar backend):
  - usar un nombre distinto (ejemplo: `A-101-ISC`, `A-101-ARQ`).

---

## 5) Aislar datos por carrera en frontend

Para que no se perciba "global":

1. Mantener siempre `carreraSeleccionada`.
2. Todas las vistas y mutaciones operan con esa `carreraSeleccionada`.
3. En profesores, filtrar por carrera activa (aunque el endpoint de listado pueda traer mas).
4. En colaboradores y salones, usar endpoints por carrera.
5. Nunca permitir asignar profesor si no esta vinculado a la carrera del grupo.

---

## 6) Orden recomendado de implementacion en UI

1. Selector de carrera global en la app.
2. Modulo de colaboradores (CRUD por carrera).
3. Modulo de profesores:
   - alta/vinculo por carrera
   - listado filtrado por carrera
4. Modulo de salones (CRUD por carrera).
5. Accion unificada "Agregar persona a carrera (acceso + profesor)".
6. Validaciones previas a asignaciones para evitar errores de vinculo.

---

## 7) Checklist rapido para el agente de IA (frontend)

- Usa `Bearer token` en todas las llamadas protegidas.
- No asumas endpoint global de salones (`GET /salones` no existe).
- No asumas que colaborador == profesor (son dos altas).
- Si colaborador falla por perfil inexistente, informar registro/login requerido.
- Antes de asignar materias, validar vinculo profesor-carrera.
- Manejar errores 400/403/404/409 con mensajes especificos.

