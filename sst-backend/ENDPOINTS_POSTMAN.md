# 📋 ENDPOINTS SST - Guía para Postman

**Base URL:** `http://localhost:3000/api`

**Autenticación:** Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <TOKEN_JWT>
```

---

## 🔐 AUTENTICACIÓN (`/api/auth`)

### POST `/api/auth/login`
**Sin autenticación**

Login de usuario. Devuelve token JWT.

**Body:**
```json
{
  "correo": "admin@example.com",
  "contrasena": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "tipo": "ADMIN",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

### GET `/api/auth/me`
**Requiere autenticación**

Obtiene información del usuario autenticado.

---

## 👥 USUARIOS (`/api/usuarios`)

**Todas requieren ADMIN**

### GET `/api/usuarios`
Listar todos los usuarios.

### GET `/api/usuarios/:id`
Obtener usuario por ID.

### POST `/api/usuarios`
Crear nuevo usuario (worker o admin).

**Body:**
```json
{
  "nombre": "María",
  "apellido": "González",
  "dni": "12345678",
  "correo": "maria@example.com",
  "contrasena": "password123",
  "tipo": "WORKER"
}
```

### PUT `/api/usuarios/:id`
Actualizar usuario.

### DELETE `/api/usuarios/:id`
Desactivar usuario (soft delete).

---

## 📖 CHARLAS (`/api/charlas`)

### GET `/api/charlas`
**Worker:** Lista charlas asignadas con su progreso.

### GET `/api/charlas/admin`
**Admin:** Lista todas las charlas del sistema.

### POST `/api/charlas`
**Admin:** Crear nueva charla (se asigna automáticamente a todos los workers).

**Body:**
```json
{
  "nombre": "Uso correcto de EPP",
  "enlace": "https://drive.google.com/...",
  "etiqueta": "Equipos de Protección",
  "fechaCharla": "2024-02-15"
}
```

### PUT `/api/charlas/:id`
**Admin:** Actualizar charla.

### DELETE `/api/charlas/:id`
**Admin:** Eliminar charla.

### POST `/api/charlas/:id/completar`
**Worker:** Marcar charla como completada.

---

## 📄 DOCUMENTOS (`/api/documentos`)

### GET `/api/documentos`
**Worker:** Lista documentos con estado de visualización.

### GET `/api/documentos/admin`
**Admin:** Lista todos los documentos.

### POST `/api/documentos`
**Admin:** Crear nuevo documento (se asigna automáticamente a todos los workers).

**Body:**
```json
{
  "nombre": "Procedimiento de evacuación v2.0",
  "tipo": "PROCEDIMIENTO",
  "enlace": "https://drive.google.com/..."
}
```

**Tipos:** `PROCEDIMIENTO`, `INSTRUCTIVO`, `MANUAL`

### PUT `/api/documentos/:id`
**Admin:** Actualizar documento.

### DELETE `/api/documentos/:id`
**Admin:** Eliminar documento.

### POST `/api/documentos/:id/visto`
**Worker:** Marcar documento como visto.

---

## 📋 FORMATOS (`/api/formatos`)

### GET `/api/formatos`
**Todos:** Lista todos los formatos disponibles.

### GET `/api/formatos/:id`
**Todos:** Obtener formato por ID.

### POST `/api/formatos`
**Admin:** Crear nuevo formato.

**Body:**
```json
{
  "nombre": "Formato de reporte de incidentes",
  "tipo": "Reporte",
  "enlace": "https://drive.google.com/..."
}
```

### PUT `/api/formatos/:id`
**Admin:** Actualizar formato.

### DELETE `/api/formatos/:id`
**Admin:** Eliminar formato.

---

## 🎓 INDUCCIÓN (`/api/induccion`)

### GET `/api/induccion`
**Todos:** Obtener material de inducción (video, PDF, diapositivas).

### PUT `/api/induccion`
**Admin:** Actualizar material de inducción.

**Body:**
```json
{
  "linkDiapo": "https://drive.google.com/...",
  "linkPdf": "https://drive.google.com/...",
  "linkVideo": "https://youtube.com/...",
  "duracion": 30
}
```

---

## 📝 EXAMEN (`/api/examen`)

### GET `/api/examen/config`
**Todos:** Obtener configuración del examen.

### PUT `/api/examen/config`
**Admin:** Actualizar configuración del examen.

**Body:**
```json
{
  "puntajeAprobatorio": 14,
  "puntajeTotal": 20,
  "intentosMaximos": 3,
  "tiempoEsperaMinutos": 10
}
```

### GET `/api/examen/preguntas`
**Admin:** Listar todas las preguntas.

### GET `/api/examen/preguntas/activas`
**Todos:** Listar preguntas activas (sin respuestas correctas).

### GET `/api/examen/preguntas/:id`
**Admin:** Obtener pregunta por ID.

### POST `/api/examen/preguntas`
**Admin:** Crear nueva pregunta.

**Body:**
```json
{
  "pregunta": "¿Cuál es el color del casco de seguridad?",
  "opcionA": "Rojo",
  "opcionB": "Amarillo",
  "opcionC": "Azul",
  "opcionD": "Verde",
  "respuestaCorrecta": "B",
  "activa": true
}
```

**Respuestas correctas:** `A`, `B`, `C`, `D`

### PUT `/api/examen/preguntas/:id`
**Admin:** Actualizar pregunta.

### DELETE `/api/examen/preguntas/:id`
**Admin:** Eliminar pregunta.

### GET `/api/examen/generar`
**Worker:** Generar 20 preguntas aleatorias para rendir el examen.

**Response:** Array de 20 preguntas (sin respuestas correctas).

### POST `/api/examen/rendir`
**Worker:** Rendir el examen.

**Body:**
```json
{
  "respuestas": {
    "1": "A",
    "2": "B",
    "3": "C",
    ...
  }
}
```

**Response:**
```json
{
  "intento": { ... },
  "puntaje": 16,
  "puntajeTotal": 20,
  "aprobado": true,
  "respuestasDetalle": { ... }
}
```

### GET `/api/examen/historial`
**Worker:** Obtener historial de intentos del usuario.

### GET `/api/examen/estado`
**Worker:** Obtener estado del examen (bloqueado, intentos usados, etc.).

### POST `/api/examen/resetear-bloqueo`
**Worker:** Resetear bloqueo después de ver el video de inducción nuevamente.

---

## 🏆 LOGROS (`/api/logros`)

### GET `/api/logros`
**Worker:** Listar logros del usuario con su estado.

### GET `/api/logros/admin`
**Admin:** Listar todos los logros del sistema.

### POST `/api/logros`
**Admin:** Crear nuevo logro (se asigna automáticamente a todos los workers).

**Body:**
```json
{
  "nombre": "Primera Charla",
  "descripcion": "Completa tu primera charla de seguridad",
  "icono": "🎯"
}
```

### PUT `/api/logros/:id`
**Admin:** Actualizar logro.

### DELETE `/api/logros/:id`
**Admin:** Eliminar logro.

---

## 🔔 NOTIFICACIONES (`/api/notificaciones`)

### GET `/api/notificaciones`
**Todos:** Listar notificaciones del usuario.

### POST `/api/notificaciones/:id/leida`
**Todos:** Marcar notificación como leída.

### POST `/api/notificaciones/marcar-todas-leidas`
**Todos:** Marcar todas las notificaciones como leídas.

---

## 📌 FLUJO RECOMENDADO PARA PROBAR EN POSTMAN

### 1. **Crear Admin (si no existe)**
- Usa Prisma Studio o crea manualmente en la BD con contraseña hasheada.

### 2. **Login**
```
POST /api/auth/login
Body: { "correo": "...", "contrasena": "..." }
```
**Guarda el token** que te devuelve.

### 3. **Configurar Headers en Postman**
Crea una variable de entorno `token` y en cada request agrega:
```
Authorization: Bearer {{token}}
```

### 4. **Crear Worker**
```
POST /api/usuarios
Body: { "nombre": "...", "apellido": "...", "dni": "...", "correo": "...", "contrasena": "...", "tipo": "WORKER" }
```

### 5. **Crear Charla**
```
POST /api/charlas
Body: { "nombre": "...", "enlace": "...", "etiqueta": "...", "fechaCharla": "2024-02-15" }
```

### 6. **Login como Worker**
```
POST /api/auth/login
Body: { "correo": "worker@example.com", "contrasena": "..." }
```

### 7. **Ver Charlas Asignadas**
```
GET /api/charlas
```

### 8. **Completar Charla**
```
POST /api/charlas/1/completar
```

### 9. **Ver Logros**
```
GET /api/logros
```

### 10. **Configurar Inducción**
```
PUT /api/induccion
Body: { "linkDiapo": "...", "linkPdf": "...", "linkVideo": "...", "duracion": 30 }
```

### 11. **Crear Preguntas del Examen**
```
POST /api/examen/preguntas
Body: { "pregunta": "...", "opcionA": "...", "opcionB": "...", "opcionC": "...", "opcionD": "...", "respuestaCorrecta": "A" }
```
**Necesitas crear al menos 20 preguntas activas.**

### 12. **Rendir Examen**
```
GET /api/examen/generar  (obtener preguntas)
POST /api/examen/rendir  (enviar respuestas)
```

---

## ⚠️ NOTAS IMPORTANTES

1. **JWT_SECRET:** Asegúrate de tener `JWT_SECRET` en tu `.env`
2. **Base de datos:** Ejecuta las migraciones de Prisma antes de probar
3. **Roles:** Las rutas marcadas como "Admin" requieren `tipo: "ADMIN"` en el token
4. **Asignación automática:** Al crear charlas/documentos/logros, se asignan automáticamente a todos los workers activos
5. **Bloqueo de examen:** Si un worker falla 3 intentos, debe ver el video de inducción nuevamente y usar `/api/examen/resetear-bloqueo`

---

## 🎯 VARIABLES DE ENTORNO PARA POSTMAN

Crea un entorno en Postman con:
- `base_url`: `http://localhost:3000/api`
- `token`: (se actualiza después del login)

Luego usa `{{base_url}}/auth/login` y `{{token}}` en los headers.
