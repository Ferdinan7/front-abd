# Catálogo de endpoints — back-bda (detallado)

Referencia alineada con el código (`src/routes/`, `src/controllers/`). La **fuente interactiva** sigue siendo **Swagger UI**: `http://localhost:<PORT>/api-docs/` (sigue redirects; suele ser `/api-docs/`).

---

## Convenciones generales

### URL base

- Variable de entorno `API_PREFIX` (por defecto): **`/api/v1`**
- Ejemplo: `http://localhost:3000/api/v1/carreras/`

### Headers habituales

| Header | Cuándo |
|--------|--------|
| `Authorization: Bearer <JWT Supabase>` | Casi todos los endpoints (ver tabla por endpoint) |
| `Content-Type: application/json` | En `POST`, `PUT` con cuerpo JSON |

### Forma típica de respuesta JSON

Éxito (patrón frecuente):

```json
{
  "status": "success",
  "message": "...",
  "data": { }
}
```

O listas:

```json
{
  "status": "success",
  "data": [ ]
}
```

Error:

```json
{
  "status": "error",
  "message": "...",
  "details": "..." 
}
```

Algunos middlewares pueden devolver otros formatos (p. ej. health con `success: true`).

### Códigos HTTP frecuentes

| Código | Significado habitual |
|--------|----------------------|
| 200 | OK |
| 201 | Recurso creado |
| 207 | Horario generado con advertencias (`warnings` no vacío) |
| 400 | Validación / regla de negocio |
| 401 | Sin token o token inválido |
| 403 | Sin permiso (rol de carrera) |
| 404 | No encontrado |
| 409 | Conflicto (p. ej. duplicado en BD) |
| 500 | Error interno / Supabase |

### Rate limiting

Por defecto: **100 solicitudes / 15 minutos** por IP. Revisa cabeceras `RateLimit-*`.

---

## Documentación OpenAPI

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api-docs/` | Interfaz Swagger UI |
| GET | `/api-docs/swagger.json` (según versión swagger-ui) | Especificación (si el bundle la expone; la definición se genera con `swagger-jsdoc` en el servidor) |

---

## 1. Health

| | |
|---|---|
| **GET** | `/api/v1/health/` |
| **Auth** | No |
| **Query** | — |
| **Body** | — |

**Respuesta 200 (ejemplo):** `success`, `message`, `timestamp`, `uptime`.

> Usa la barra final `/health/` o sigue el redirect desde `/health`.

---

## 2. Auth

### POST `/api/v1/auth/sync-profile`

| | |
|---|---|
| **Auth** | Sí · Bearer |
| **Body** | _(vacío)_ — usa `req.user` del JWT |
| **Uso** | Tras login (p. ej. OAuth); crea/actualiza fila en `profiles` con `email`, `full_name`, `avatar_url` desde metadata de Supabase Auth |

**200:** perfil sincronizado; **401** si no hay usuario en request; **500** si falla Supabase.

---

## 3. Carreras

Base del router: `/api/v1/carreras`.

### GET `/api/v1/carreras/`

| | |
|---|---|
| **Auth** | Sí |
| **Uso** | Lista carreras donde el usuario tiene fila en `roles_carrera` (join inner) |

**200:** `data` = array con `id`, `nombre`, `color`, `created_at`, `roles_carrera` anidado (según select del controller).

### POST `/api/v1/carreras/`

| | |
|---|---|
| **Auth** | Sí |
| **Body (JSON)** | |

```json
{
  "nombre": "Ingeniería en Sistemas",
  "color": "#3B82F6"
}
```

| Campo | Requerido | Notas |
|-------|-----------|--------|
| `nombre` | Sí | |
| `color` | No | Default backend `#3B82F6` si omites |

**201:** carrera creada vía RPC `create_career_with_admin` y admin asignado.

### PUT `/api/v1/carreras/:id`

| | |
|---|---|
| **Auth** | Sí · debe ser **admin** de esa carrera (`checkCareerRole('admin')`) |
| **Path** | `id` = UUID de la carrera |
| **Body** | `{ "nombre": "...", "color": "#..." }` (campos opcionales según lo que envíes) |

### DELETE `/api/v1/carreras/:id`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Nota** | Si hay FKs que impiden borrar, **400** con mensaje genérico de datos asociados (`23503`). Puede requerir borrado previo de dependencias (grupos, horarios, etc.). |

---

## 4. Colaboradores (`roles_carrera`)

Todos bajo **`/api/v1`** (sin prefijo `/carreras` extra en el path del router; el path sí incluye `carreras` en la URL).

### GET `/api/v1/carreras/:carreraId/colaboradores`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Usuario con cualquier rol en esa carrera |
| **Respuesta** | Lista con emails/nombres aplanados desde `profiles` |

### POST `/api/v1/carreras/:carreraId/colaboradores`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Solo **admin** de la carrera |
| **Body** | |

```json
{
  "email": "persona@dominio.com",
  "rol": "viewer"
}
```

| Campo | Valores |
|-------|---------|
| `rol` | `admin` \| `viewer` |

**404** si el email no existe en `profiles`. **400** si ya es colaborador.

### PUT `/api/v1/colaboradores/:id`

| | |
|---|---|
| **Path** | `id` = UUID del registro **`roles_carrera`** (no es `user_id`) |
| **Auth** | Sí · admin |
| **Body** | `{ "rol": "admin" }` |

**400** si intentas dejar a la carrera sin único admin.

### DELETE `/api/v1/colaboradores/:id`

| | |
|---|---|
| **Path** | id de `roles_carrera` |
| **Auth** | Sí · admin |
| **400** | No eliminar al único admin |

---

## 5. Configuración por carrera

### GET `/api/v1/carreras/:carreraId/config`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Cualquier rol en la carrera |
| **Respuesta** | Fila de `configuracion_carrera` o objeto por defecto si no hay fila (`PGRST116`) |

### PUT `/api/v1/carreras/:carreraId/config`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body (todos opcionales en bloque; envía solo lo que cambies)** | |

```json
{
  "duracion_bloque": 50,
  "hora_inicio": "07:00:00",
  "hora_fin": "15:00:00",
  "receso_matutino_inicio": "09:30:00",
  "receso_matutino_fin": "10:00:00",
  "receso_vespertino_inicio": null,
  "receso_vespertino_fin": null
}
```

| Campo | Tipo esperado |
|-------|----------------|
| Tiempos | `time` (Postgres); el cliente suele enviar string `"HH:MM:SS"` o compatible |
| `duracion_bloque` | entero > 0 (validación ligera en controller) |

> La generación de horarios en `schedulerService` **prioriza** `grupos.hora_*` y `configuracion_global` si el grupo no tiene horas; no lee esta tabla directamente en el código actual.

---

## 6. Salones

### GET `/api/v1/carreras/:carreraId/salones`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Rol en esa carrera |

### POST `/api/v1/carreras/:carreraId/salones`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | |

```json
{
  "nombre": "A-101",
  "edificio": "Edificio Central",
  "tipo": "aula"
}
```

| `tipo` | `aula` \| `laboratorio` \| `sala` |

**409** si `nombre` ya existe globalmente en tabla `salones`.

### PUT `/api/v1/salones/:id`

| | |
|---|---|
| **Auth** | Sí · admin en carrera vinculada al salón (lógica del controller) |
| **Body** | `{ "nombre", "edificio", "tipo", "activo" }` — campos opcion según envío |

### DELETE `/api/v1/salones/:id`

| | |
|---|---|
| **Auth** | Sí · admin |

---

## 7. Grupos

### GET `/api/v1/carreras/:carreraId/grupos`

| | |
|---|---|
| **Auth** | Sí |
| **Respuesta** | Lista de grupos de esa carrera |

### POST `/api/v1/carreras/:carreraId/grupos`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | |

```json
{
  "grado": 1,
  "seccion": "A",
  "turno": "matutino",
  "hora_inicio": "07:00",
  "hora_fin": "15:00",
  "duracion_bloque": 50
}
```

| Campo | Requerido | Valores / notas |
|-------|-----------|------------------|
| `grado` | Sí | entero > 0 |
| `seccion` | Sí | texto |
| `turno` | Sí | `matutino` \| `vespertino` |
| `hora_inicio`, `hora_fin` | No (ambas o ninguna) | Formato `HH:mm`; deben ser **cortes válidos** del turno (ver `src/utils/time-validation.ts`) |
| `duracion_bloque` | No | default **50** |

**Restricción BD:** `UNIQUE (carrera_id, grado, seccion)` — **no** puedes tener el mismo grado+sección en la misma carrera con turno distinto; el turno no entra en la unicidad.

### PUT `/api/v1/:id` — actualizar grupo

| | |
|---|---|
| **Path** | `:id` = **UUID del grupo** (ruta “plana”; no lleva `/grupos`) |
| **Auth** | Sí · admin |
| **Body** | Misma forma que POST (campos parciales según update del controller) |
| **Nota** | Si envías `turno`, se revalidan `hora_inicio` / `hora_fin` con ese turno |

### DELETE `/api/v1/:id` — eliminar grupo

| | |
|---|---|
| **Path** | UUID del grupo |
| **Auth** | Sí · admin |

---

## 8. Asignaciones

### GET `/api/v1/grupos/:grupoId/asignaciones`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Cualquier rol en la carrera del grupo |
| **Respuesta** | Incluye anidados `materia`, `profesor` |

### POST `/api/v1/grupos/:grupoId/asignaciones`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | |

```json
{
  "materia_id": "uuid",
  "profesor_id": "uuid"
}
```

**400** si la materia no pertenece a la carrera del grupo; **400** si el profesor no está en `profesores_carrera` para esa carrera; **409** si la materia ya está asignada al grupo.

### PUT `/api/v1/asignaciones/:id`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | `{ "materia_id": "uuid (opcional)", "profesor_id": "uuid (opcional)" }` |
| **400 / 409** | Validaciones de carrera y duplicados |

### DELETE `/api/v1/asignaciones/:id`

| | |
|---|---|
| **Auth** | Sí · admin |

---

## 9. Horarios

### POST `/api/v1/grupos/:grupoId/horario/generar`

| | |
|---|---|
| **Auth** | Sí · admin Carrera |
| **Query** | `regenerar` = `true` \| `false` (string en query; el código compara `=== 'true'`) |
| **Body** | — |

Comportamiento resumido:
- Sin `regenerar`: si ya hay filas en `bloques_horario` para el grupo → **400** (`SCHEDULE_EXISTS`).
- Con `regenerar=true`: borra bloques del grupo y resetea contadores de horas en asignaciones, luego regenera.
- **200** si no hay `warnings`; **207** si hay advertencias de materias incompletas.

### GET `/api/v1/grupos/:grupoId/horario`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Cualquier rol en la carrera |
| **Respuesta** | Objeto por días (`lunes` … `viernes`); turno **matutino** añade bloque sintético `tipo: receso` |

### DELETE `/api/v1/grupos/:grupoId/horario`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Efecto** | Borra bloques del grupo y pone `horas_asignadas` en 0 en asignaciones de ese grupo |

---

## 10. Materias

### GET `/api/v1/carreras/:carreraId/materias`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Rol en la carrera |
| **Query opcional** | `?grado=3` — filtra por grado (entero) |

### POST `/api/v1/carreras/:carreraId/materias`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | |

```json
{
  "nombre": "Matemáticas",
  "codigo": "MAT-101",
  "grado": 1,
  "horas_semanales": 5
}
```

| Campo | Requerido |
|-------|-----------|
| `nombre`, `grado`, `horas_semanales` | Sí |
| `codigo` | No |

**400** si `grado` o `horas_semanales` ≤ 0.

### PUT `/api/v1/materias/:id`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | `{ "nombre", "codigo", "grado", "horas_semanales" }` |

### DELETE `/api/v1/materias/:id`

| | |
|---|---|
| **Auth** | Sí · admin |

---

## 11. Profesores y disponibilidad

### GET `/api/v1/profesores`

| | |
|---|---|
| **Auth** | Sí |
| **Uso** | Profesores vinculados a carreras donde el usuario tiene `roles_carrera` |
| **200** vacío | Si el usuario no tiene roles en ninguna carrera |

### POST `/api/v1/profesores`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | |

```json
{
  "nombre_completo": "Juan Pérez",
  "email": "juan@dominio.com",
  "carrera_id": "uuid"
}
```

| Campo | Requerido |
|-------|-----------|
| `nombre_completo`, `carrera_id` | Sí |
| `email` | No (si hay, reutiliza profesor existente y hace upsert en `profesores_carrera`) |

### PUT `/api/v1/profesores/:id`

| | |
|---|---|
| **Auth** | Sí · admin en carrera del profesor |
| **Body** | `{ "nombre_completo", "email", "activo" }` |

### DELETE `/api/v1/profesores/:id`

| | |
|---|---|
| **Auth** | Sí · admin |

### GET `/api/v1/profesores/:id/disponibilidad`

| | |
|---|---|
| **Auth** | Sí |
| **Permiso** | Cualquier rol en carrera del profesor (no solo admin) |

### POST `/api/v1/profesores/:id/disponibilidad`

| | |
|---|---|
| **Auth** | Sí · admin |
| **Body** | **Array** JSON (no objeto) |

```json
[
  { "dia_semana": 1, "hora_inicio": "07:00:00", "hora_fin": "12:00:00" },
  { "dia_semana": 3, "hora_inicio": "10:00:00", "hora_fin": "14:00:00" }
]
```

| Campo | Reglas |
|-------|--------|
| `dia_semana` | 1–5 (Lun–Vie) |
| `hora_inicio`, `hora_fin` | `hora_inicio < hora_fin` |

### DELETE `/api/v1/disponibilidad/:id`

| | |
|---|---|
| **Path** | UUID del **bloque** en `disponibilidad_profesores` |
| **Auth** | Sí · admin |

---

## 12. Referencia rápida (tabla única)

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/v1/health/` | No |
| POST | `/api/v1/auth/sync-profile` | Sí |
| GET | `/api/v1/carreras/` | Sí |
| POST | `/api/v1/carreras/` | Sí |
| PUT | `/api/v1/carreras/:id` | Sí · admin |
| DELETE | `/api/v1/carreras/:id` | Sí · admin |
| GET | `/api/v1/carreras/:carreraId/colaboradores` | Sí |
| POST | `/api/v1/carreras/:carreraId/colaboradores` | Sí |
| PUT | `/api/v1/colaboradores/:id` | Sí |
| DELETE | `/api/v1/colaboradores/:id` | Sí |
| GET | `/api/v1/carreras/:carreraId/config` | Sí |
| PUT | `/api/v1/carreras/:carreraId/config` | Sí |
| GET | `/api/v1/carreras/:carreraId/salones` | Sí |
| POST | `/api/v1/carreras/:carreraId/salones` | Sí |
| PUT | `/api/v1/salones/:id` | Sí |
| DELETE | `/api/v1/salones/:id` | Sí |
| GET | `/api/v1/carreras/:carreraId/grupos` | Sí |
| POST | `/api/v1/carreras/:carreraId/grupos` | Sí |
| PUT | `/api/v1/:grupoId` | Sí |
| DELETE | `/api/v1/:grupoId` | Sí |
| GET | `/api/v1/grupos/:grupoId/asignaciones` | Sí |
| POST | `/api/v1/grupos/:grupoId/asignaciones` | Sí |
| PUT | `/api/v1/asignaciones/:id` | Sí |
| DELETE | `/api/v1/asignaciones/:id` | Sí |
| POST | `/api/v1/grupos/:grupoId/horario/generar` | Sí |
| GET | `/api/v1/grupos/:grupoId/horario` | Sí |
| DELETE | `/api/v1/grupos/:grupoId/horario` | Sí |
| GET | `/api/v1/carreras/:carreraId/materias` | Sí |
| POST | `/api/v1/carreras/:carreraId/materias` | Sí |
| PUT | `/api/v1/materias/:id` | Sí |
| DELETE | `/api/v1/materias/:id` | Sí |
| GET | `/api/v1/profesores` | Sí |
| POST | `/api/v1/profesores` | Sí |
| PUT | `/api/v1/profesores/:id` | Sí |
| DELETE | `/api/v1/profesores/:id` | Sí |
| GET | `/api/v1/profesores/:id/disponibilidad` | Sí |
| POST | `/api/v1/profesores/:id/disponibilidad` | Sí |
| DELETE | `/api/v1/disponibilidad/:id` | Sí |

---

## 13. Notas finales para el frontend

1. **`PUT`/`DELETE` de grupo** usan `/api/v1/:id` (id del grupo). Evita rutas ambiguas en el cliente.
2. **`regenerar`** en generar horario debe enviarse como query string exacta `true` para activarse.
3. **Colaboradores:** el `id` en PUT/DELETE es el de `roles_carrera`.
4. **Disponibilidad POST:** el body es un **array**, no `{ "blocks": [...] }`.
5. Si necesitas el OpenAPI crudo, abre Swagger UI y exporta / inspecciona la especificación que monta el servidor.
