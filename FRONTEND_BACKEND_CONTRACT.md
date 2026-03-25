# Contrato Frontend ↔ Backend (back-bda)
Guía **operativa** para implementar el frontend contra el backend actual sin “alucinar” endpoints ni suposiciones.

> Backend: Express + TypeScript + Supabase.  
> Swagger: `http://localhost:3000/api-docs/`  
> Base API (por defecto): `VITE_API_URL=http://localhost:3000/api/v1`

---

## Reglas globales (importantes)

### Autenticación
- **Todas las rutas relevantes** requieren header:
  - `Authorization: Bearer <SUPABASE_JWT>`
- Si falta o es inválido:
  - **401** `No token provided` o `Invalid or expired token`

### Modelo mental (no mezclar conceptos)
- **Colaborador** = *acceso a una carrera* (tabla `roles_carrera`).
  - Permite **ver/gestionar** recursos de esa carrera según `rol` (`admin`/`viewer`).
- **Profesor** = *entidad académica* (tabla `profesores`) + vínculo a carrera (tabla `profesores_carrera`).
  - Permite **asignar materias** y usar **disponibilidad** en la generación de horarios.
- Por diseño actual del backend: **ser colaborador no te convierte en profesor** y **ser profesor no te da acceso**.

### Prefijo de rutas
El backend monta rutas en `env.apiPrefix` (default `/api/v1`).
- En esta guía, todos los paths se expresan como: `GET /api/v1/...`

---

## Flujo recomendado: “Invitar persona” como **Colaborador + Profesor**

### Objetivo
Evitar inconsistencias:
- “Invité a un profesor por correo, pero no tiene acceso” (creaste profesor, no rol de carrera).
- “Invité colaborador, pero no puedo asignarlo a materias” (creaste rol, pero no profesor/vínculo).
- Error típico al asignar: **“Profesor does not exist or is not linked to the group's career”**

### Estrategia segura (frontend)
Implementa una única acción UX: **“Agregar persona a la carrera”**, y por debajo ejecuta dos operaciones **idempotentes** (o manejables) en este orden:

1) **Dar acceso a la carrera** (colaborador)
2) **Crear/vincular profesor a la carrera** (profesor)

#### Paso 1 — Agregar como colaborador
**Endpoint**
- `POST /api/v1/carreras/:carreraId/colaboradores`

**Body**
```json
{
  "email": "persona@dominio.com",
  "rol": "viewer"
}
```

**Respuestas / errores esperables**
- **201**: colaborador agregado.
- **403**: no eres admin de esa carrera.
- **400**: datos faltantes o ya es colaborador.
- **404**: `User with the specified email does not exist...`

**Qué significa el 404 y cómo resolverlo**
Este endpoint **NO invita usuarios**. Solo puede agregar usuarios que ya existan en `profiles`.
- **Resolución UX**:
  - mostrar: “La persona debe crear cuenta/iniciar sesión primero para poder darle acceso.”
  - opcional: mantener un “pending invite” en tu frontend (no existe en backend).

#### Paso 2 — Crear o vincular profesor (maestro) a la carrera
**Endpoint**
- `POST /api/v1/profesores`

**Body**
```json
{
  "nombre_completo": "Nombre Apellido",
  "email": "persona@dominio.com",
  "carrera_id": "UUID"
}
```

**Notas de comportamiento**
- Si `email` ya existe en `profesores`, el backend reutiliza ese profesor.
- Siempre intenta **vincular** con `upsert` en `profesores_carrera` (evita duplicados).

**Respuestas / errores esperables**
- **201**: profesor creado o reutilizado, y vinculado a carrera.
- **403**: no eres admin de esa carrera.
- **400**: faltan datos (`nombre_completo`, `carrera_id`).

#### Orden y consistencia
- **Orden recomendado**: colaborador → profesor.
  - Así priorizas el “acceso” (si la persona ni siquiera existe en `profiles`, lo sabrás).
  - Aun si el colaborador falla por 404 (no existe en profiles), **sí puedes** crear el profesor y su vínculo; pero esa persona **seguirá sin poder entrar a la carrera** hasta tener `roles_carrera`.

#### Resultado esperado del flujo unificado
Tras ambos pasos exitosos:
- La persona **tiene acceso** a la carrera (si existe en `profiles`) vía `roles_carrera`.
- La persona **es asignable** en materias/grupos vía `profesores_carrera`.

---

## Colaboradores (acceso a carrera)

### Listar colaboradores de una carrera
**Endpoint**
- `GET /api/v1/carreras/:carreraId/colaboradores`

**Permisos**
- Requiere token válido.
- Requiere que el usuario tenga `roles_carrera` en esa carrera (admin o viewer).

**Errores**
- **403**: no tienes acceso a esa carrera.

### Actualizar rol de un colaborador
**Endpoint**
- `PUT /api/v1/colaboradores/:id`

**Body**
```json
{ "rol": "admin" }
```

**Errores típicos**
- **400**: si intentas degradar/eliminar al **único admin** de la carrera (el backend lo bloquea).
- **403**: no eres admin de esa carrera.
- **404**: colaborador no encontrado.

### Eliminar colaborador
**Endpoint**
- `DELETE /api/v1/colaboradores/:id`

**Errores típicos**
- **400**: no puedes eliminar al único admin de la carrera.
- **403**: no eres admin.
- **404**: no existe.

---

## Profesores (maestros) y disponibilidad

### Listar profesores accesibles al usuario
**Endpoint**
- `GET /api/v1/profesores`

**Cómo filtra**
- Devuelve profesores vinculados a las carreras donde tú tengas un `roles_carrera`.

### Actualizar profesor
**Endpoint**
- `PUT /api/v1/profesores/:id`

**Errores típicos**
- **403**: si no eres admin en ninguna de las carreras asociadas a ese profesor.
- **404**: profesor no encontrado o no vinculado a carreras.

### Disponibilidad semanal (bloques)

#### Obtener disponibilidad
- `GET /api/v1/profesores/:id/disponibilidad`

#### Crear disponibilidad en batch
- `POST /api/v1/profesores/:id/disponibilidad`

**Body (array)**
```json
[
  { "dia_semana": 1, "hora_inicio": "07:00:00", "hora_fin": "11:00:00" },
  { "dia_semana": 3, "hora_inicio": "10:00:00", "hora_fin": "12:00:00" }
]
```

**Validaciones (backend)**
- `dia_semana` debe estar entre **1 y 5**.
- `hora_inicio < hora_fin`.
- Para crear/eliminar bloques debes ser **admin** en al menos una carrera del profesor.

#### Eliminar bloque de disponibilidad
- `DELETE /api/v1/disponibilidad/:id`

**Cómo representar “4 horas el lunes”**
- Un bloque lunes con rango de 4h, por ejemplo `08:00–12:00`.
> No existe un campo “horas totales por semana”; se deduce por la suma de bloques.

---

## Grupos (turno + hora inicio/fin) y cómo impacta la generación

### Crear grupo con horario propio
**Endpoint**
- `POST /api/v1/carreras/:carreraId/grupos`

**Body (relevante)**
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

### Actualizar grupo
**Endpoint**
- `PUT /api/v1/grupos/:id`

**Notas**
- La validación de horario del grupo usa una rejilla fija por turno (valores permitidos por “cortes”).
- `hora_inicio` y `hora_fin` influyen directamente en los slots de generación.

> Si tu objetivo es: “Selecciono matutino/vespertino y defino hora inicio/fin por turno, y que se refleje”, hoy lo más directo en este backend es: **guardar esos valores en cada `grupo`** (no en `configuracion_carrera`), porque la generación lee el horario desde `grupos` (o cae a `configuracion_global` si está null).

---

## Materias y Asignaciones (materia ↔ profesor ↔ grupo)

### Asignaciones: listar por grupo
- `GET /api/v1/grupos/:grupoId/asignaciones`

### Asignaciones: crear
- `POST /api/v1/grupos/:grupoId/asignaciones`

**Body**
```json
{
  "materia_id": "UUID",
  "profesor_id": "UUID"
}
```

**Errores típicos y cómo resolverlos**

#### 400 “Materia does not exist or does not belong to the group's career”
Pasa cuando `materia_id` no pertenece a la misma `carrera_id` del grupo.
- **Solución**: en UI, filtra materias por `carreraId` del grupo.

#### 400 “Profesor does not exist or is not linked to the group's career”
Pasa cuando NO existe el vínculo en `profesores_carrera` para el `profesor_id` y `carrera_id` del grupo.
- **Solución**:
  - Antes de asignar, asegúrate de haber ejecutado `POST /api/v1/profesores` con `carrera_id` correcto (o un flujo equivalente).
  - En UI, lista profesores solo de esa carrera (si estás consumiendo `GET /profesores`, asegúrate de que el profesor esté vinculado a la carrera objetivo).

#### 409 “This subject is already assigned to this group”
La materia ya está asignada a ese grupo.
- **Solución**: en UI, deshabilitar reasignación duplicada o editar la asignación existente.

### Asignaciones: editar (requerido por tu tarea)
- `PUT /api/v1/asignaciones/:id`

**Body**
```json
{
  "materia_id": "UUID (opcional)",
  "profesor_id": "UUID (opcional)"
}
```

**Errores**
- **403**: no eres admin de la carrera del grupo (la carrera se deduce desde la asignación).
- **400**: si el nuevo `materia_id` no pertenece a la carrera o el nuevo `profesor_id` no está vinculado a la carrera.
- **409**: duplicado.

### Asignaciones: eliminar
- `DELETE /api/v1/asignaciones/:id`

---

## Horarios (generación y consulta)

### Generar horario
- `POST /api/v1/grupos/:grupoId/horario/generar?regenerar=true|false`

**Permisos**
- Solo admins de la carrera del grupo.

**Respuestas**
- **200**: generado sin advertencias.
- **207**: generado parcialmente con `warnings` (materias con horas faltantes).
- **400**: si ya existe horario y no envías `regenerar=true`.

### Consultar horario
- `GET /api/v1/grupos/:grupoId/horario`

**Receso matutino**
- El backend devuelve un bloque `tipo: "receso"` 09:30–10:00 en la respuesta para turno matutino, y la generación evita colocar clases en esa ventana.

---

## Salones (lo que sí se puede hacer hoy)

### Crear salón y asociarlo a una carrera
- `POST /api/v1/carreras/:carreraId/salones`

**Body**
```json
{
  "nombre": "A-101",
  "edificio": "Edificio A",
  "tipo": "aula"
}
```

**Errores**
- **403**: no eres admin de la carrera.
- **409**: nombre de salón ya existe (único global).

### Listar salones por carrera
- `GET /api/v1/carreras/:carreraId/salones`

### Editar salón
- `PUT /api/v1/salones/:id`

### Eliminar salón
- `DELETE /api/v1/salones/:id`

### Limitación actual (importante)
El backend **no expone** un endpoint para “asignar salón a una materia/asignación” y en DB el `salon_id` vive en `bloques_horario`.
- **Por ahora**, tu implementación frontend puede:
  - gestionar salones (CRUD) y listarlos por carrera,
  - mostrar el horario generado,
  - pero **no garantizar** que el horario generado incluya `salon_id` asignado automáticamente.

---

## Checklist anti-errores (para agentes de IA)

1) **Antes de asignar materia a profesor**:
   - confirmar `profesor` está vinculado a la carrera (crear/vincular vía `POST /profesores` si hace falta).
2) **Invitar persona a carrera**:
   - si quieres que sea “usuario con acceso + asignable”, ejecutar flujo doble: colaboradores + profesores.
   - si falla colaboradores por 404: la persona aún no existe en `profiles` → pedir registro/login.
3) **Horario (inicio/fin) debe reflejarse**:
   - guardar `hora_inicio/hora_fin/duracion_bloque` en **`grupos`** si quieres que la generación lo use.
4) **Receso matutino**:
   - no intentes crear clases manuales en 09:30–10:00; la generación lo evita y el GET lo muestra como receso.

