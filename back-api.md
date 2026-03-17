

## 1) URL base para el frontend

Tu API monta todas las rutas bajo `env.apiPrefix`:
- Base backend local: `http://localhost:3000`
- Base API: `http://localhost:3000/api/v1`

Además tienes Swagger en:
- `http://localhost:3000/api-docs`

---

## 2) Endpoints encontrados

> Casi todos requieren `Authorization: Bearer <token>`, excepto health.

## Health

- `GET /health`
  **Uso:** verificar que el servidor esté arriba.

---

## Auth

- `POST /auth/sync-profile`
  **Uso:** sincroniza el perfil del usuario autenticado (Google OAuth) en backend.

---

## Carreras

- `GET /carreras`
  **Uso:** listar carreras a las que pertenece el usuario.
- `POST /carreras`
  **Uso:** crear carrera (el creador queda admin).
- `PUT /carreras/:id`
  **Uso:** actualizar carrera (solo admin de carrera).
- `DELETE /carreras/:id`
  **Uso:** eliminar carrera (solo admin).

---

## Grupos

- `GET /carreras/:carreraId/grupos`
  **Uso:** listar grupos de una carrera.
- `POST /carreras/:carreraId/grupos`
  **Uso:** crear grupo en carrera (solo admin).
- `PUT /grupos/:id`
  **Uso:** actualizar grupo (solo admin de su carrera).
- `DELETE /grupos/:id`
  **Uso:** eliminar grupo (solo admin).

---

## Materias

- `GET /carreras/:carreraId/materias?grado=...`
  **Uso:** listar materias por carrera (opcional filtrar por grado).
- `POST /carreras/:carreraId/materias`
  **Uso:** crear materia en carrera (solo admin).
- `PUT /materias/:id`
  **Uso:** actualizar materia (solo admin).
- `DELETE /materias/:id`
  **Uso:** eliminar materia (solo admin).

---

## Profesores + Disponibilidad

### Profesores

- `GET /profesores`
  **Uso:** listar profesores accesibles al usuario.
- `POST /profesores`
  **Uso:** crear profesor y vincularlo a carrera (solo admin).
- `PUT /profesores/:id`
  **Uso:** actualizar profesor (solo admin de sus carreras).
- `DELETE /profesores/:id`
  **Uso:** eliminar profesor (solo admin).

### Disponibilidad

- `GET /profesores/:id/disponibilidad`
  **Uso:** obtener disponibilidad de profesor.
- `POST /profesores/:id/disponibilidad`
  **Uso:** crear disponibilidad en lote (array de bloques).
- `DELETE /disponibilidad/:id`
  **Uso:** eliminar bloque de disponibilidad.

---

## Asignaciones (Profesor → Materia → Grupo)

- `GET /grupos/:grupoId/asignaciones`
  **Uso:** listar asignaciones de un grupo.
- `POST /grupos/:grupoId/asignaciones`
  **Uso:** crear asignación en grupo (solo admin).
- `PUT /asignaciones/:id`
  **Uso:** actualizar asignación.
- `DELETE /asignaciones/:id`
  **Uso:** eliminar asignación.

---

## Horarios (generación automática)

- `POST /grupos/:grupoId/horario/generar?regenerar=true|false`
  **Uso:** generar horario automático del grupo.
  Puede devolver `207` con `warnings` si quedó parcial.
- `GET /grupos/:grupoId/horario`
  **Uso:** consultar horario agrupado por día.
- `DELETE /grupos/:grupoId/horario`
  **Uso:** borrar horario del grupo.

---

## 3) Cómo consumirlos desde frontend (patrón)

Si tu base es `API_URL`:
- Listar carreras: `GET ${API_URL}/carreras`
- Materias por carrera: `GET ${API_URL}/carreras/${carreraId}/materias`
- Generar horario: `POST ${API_URL}/grupos/${grupoId}/horario/generar?regenerar=true`

Headers típicos:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`