# Manual de instalación y ejecución

**Proyecto:** Stylo — sistema de gestión de salones de eventos
**Materia:** Desarrollo de Software
**Repositorio:** https://github.com/Felicitas26/TP-DesarrolloSoftware.git (rama `main`)
**Stack:** React (frontend) + Express/Prisma (backend) + MySQL (base de datos)

Este documento explica cómo instalar y ejecutar el sistema desde cero, sin necesidad de conocer cómo está desarrollado.

---

## 1. Arquitectura general

El sistema está compuesto por dos aplicaciones independientes que se comunican mediante una API REST:

```
┌────────────────────┐        HTTP/JSON        ┌────────────────────┐        ┌──────────────┐
│  Frontend (React)  │ ─────────────────────▶  │  Backend (Express) │ ─────▶ │  MySQL        │
│  Vite :5173        │ ◀─────────────────────  │  API REST :3000    │ ◀───── │  event_hall   │
└────────────────────┘                         └────────────────────┘        └──────────────┘
```

- **Frontend:** aplicación SPA construida con React + Vite. Se sirve en `http://localhost:5173`.
- **Backend:** API REST construida con Express y Prisma (ORM) sobre MySQL. Escucha en `http://localhost:3000`.
- **Base de datos:** MySQL, base `event_hall`, creada y poblada automáticamente por scripts.

---

## 2. Requisitos previos

Instalar antes de comenzar:

| Herramienta | Versión mínima | Verificación |
|-------------|----------------|--------------|
| Node.js     | 20.19+ (rama 20) o 22.12+ (rama 22) | `node -v` |
| npm         | Incluido con Node.js | `npm -v` |
| MySQL       | 8.0 o superior | `mysql --version` |
| Git         | Cualquier versión reciente | `git --version` |

> Nota: Vite 8 y su plugin de React requieren Node.js `^20.19.0 || >=22.12.0` (rama 20 desde 20.19, o rama 22 desde 22.12). Node 21 y 22.0–22.11 no son compatibles. Recomendado: última 22 LTS.

Asegurarse de que el **servicio de MySQL esté corriendo** antes de continuar. En Windows suele instalarse como servicio; en Linux/macOS puede iniciarse con `sudo service mysql start` o equivalente.

---

## 3. Estructura del proyecto

```
TP-DesarrolloSoftware/
├── Backend/                 # API REST (Express + Prisma)
│   ├── prisma/schema.prisma # Modelo de datos (ORM)
│   ├── scripts/             # setup + seeds (datos de ejemplo)
│   ├── src/                 # rutas, controladores, servicios, modelos
│   ├── server.js            # punto de entrada (puerto 3000)
│   └── .env                 # variables de entorno (se crea, NO se versiona)
├── frontend/                # Aplicación React + Vite
│   ├── src/
│   └── package.json
├── database/
│   └── new_event_hall.sql   # referencia del esquema inicial (opcional)
└── README.md
```

---

## Inicio rápido (resumen)

Con MySQL en ejecución y el `Backend/.env` ya creado (ver sección 4.3):

```bash
# Terminal 1 — Backend
cd Backend
npm install
npm run setup
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173` e ingresar con `admin` / `admin123`.

---

## 4. Instalación paso a paso

### 4.1. Clonar el repositorio

```bash
git clone https://github.com/Felicitas26/TP-DesarrolloSoftware.git
cd TP-DesarrolloSoftware
```

> El repositorio **no tiene scripts en la raíz** (`package.json` vacío): el backend y el frontend se instalan y ejecutan por separado, cada uno en su carpeta.

### 4.2. Base de datos MySQL

No es necesario crear tablas a mano: el backend las crea y carga los datos automáticamente.

Sólo hay que asegurarse de tener un usuario de MySQL con permisos para **crear bases de datos**. Por defecto el proyecto usa el usuario `root`.

> No hace falta importar ningún SQL: el paso 4.3 crea la base y todas las tablas automáticamente. El archivo `database/new_event_hall.sql` es sólo una **referencia del esquema inicial** (puede estar desactualizado). Si preferís usarlo, después ejecutá `npx prisma db push` y `npm run seed:all` para completar el esquema y los datos.

### 4.3. Backend

**1) Crear el archivo de variables de entorno `Backend/.env`:**

Crear un archivo llamado `.env` dentro de la carpeta `Backend` con el siguiente contenido (reemplazar los valores por los de tu instalación de MySQL):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=event_hall
DB_PORT=3306

DATABASE_URL="mysql://root:TU_CONTRASEÑA@localhost:3306/event_hall"

JWT_SECRET=UNA_CLAVE_SECRETA_LARGA_Y_ALEATORIA
JWT_EXPIRES_IN=8h
```

> - `DATABASE_URL` debe tener la forma `mysql://USUARIO:CONTRASEÑA@HOST:PUERTO/BASE`.
> - `DB_*` y `DATABASE_URL` deben apuntar al **mismo** usuario, contraseña y base (el pool de MySQL usa `DB_*` y Prisma usa `DATABASE_URL`).
> - Si la contraseña contiene caracteres especiales (`@`, `:`, `/`, `#`, etc.), deben codificarse en formato URL (por ejemplo `@` → `%40`).
> - Si el usuario de MySQL **no tiene contraseña**, dejar `DB_PASSWORD=` vacío y usar `DATABASE_URL="mysql://root@localhost:3306/event_hall"`.
> - `JWT_SECRET` es la clave con la que se firman los tokens de sesión. Usar un valor propio y privado.
> - El archivo `.env` **no se sube al repositorio** (está en `.gitignore`); si trabajás en el mismo entorno del equipo, pedí los valores reales al grupo.

**2) Instalar dependencias:**

```bash
cd Backend
npm install
```

El `postinstall` ejecuta automáticamente `prisma generate` (genera el cliente del ORM).

**3) Preparar la base de datos y cargar los datos de ejemplo:**

```bash
npm run setup
```

Este comando:
1. Crea la base `event_hall` si no existe.
2. Aplica el esquema de Prisma (`prisma db push`), creando todas las tablas.
3. Ejecuta los seeds (ubicaciones, salones, menús, servicios, usuarios y precios).

Los seeds son **idempotentes**: si se ejecutan de nuevo no duplican los datos ya existentes.

### 4.4. Frontend

En **otra terminal** (dejando el backend corriendo):

```bash
cd frontend
npm install
npm run dev
```

El frontend se abre en `http://localhost:5173`.

> Opcional: si el backend no está en `http://localhost:3000`, crear `frontend/.env` con:
> ```env
> VITE_API_URL=http://localhost:3000
> ```
> Si no se define, el frontend usa `http://localhost:3000` por defecto.

---

## 5. Ejecución

### Terminal 1 — Backend

```bash
cd Backend
npm run dev
```

- Levanta la API con recarga automática (`nodemon`) en `http://localhost:3000`.
- El script `dev` ejecuta antes `npm run setup` (gracias al hook `predev`), por lo que en la primera ejecución crea la base y carga los datos automáticamente.

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

- Levanta la interfaz en `http://localhost:5173`.

### Acceso al sistema

Abrir el navegador en `http://localhost:5173`.

Credenciales del administrador creadas por el seed:

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |

---

## 6. Scripts disponibles

### Backend (`cd Backend`)

| Script | Descripción |
|--------|-------------|
| `npm run setup` | Crea la base, aplica el esquema y ejecuta todos los seeds. |
| `npm run dev` | Inicia el servidor en modo desarrollo (`nodemon`). Antes ejecuta `setup`. |
| `npm start` | Inicia el servidor en modo normal (sin setup ni recarga). |
| `npm run seed:all` | Ejecuta todos los seeds sin recrear el esquema. |
| `npm run seed:locations` | Carga sólo las ubicaciones (ciudades). |
| `npm run seed:usuarios` | Carga sólo los usuarios (administrador). |
| `npm run seed:prices` | Carga sólo los precios. |

### Frontend (`cd frontend`)

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173`. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la build de producción. |
| `npm run lint` | Analiza el código con ESLint. |

---

## 7. Verificación rápida

1. El backend muestra `Server running on port 3000`.
2. Al abrir `http://localhost:3000/api/locations` en el navegador se obtiene un JSON con las ciudades.
3. La documentación de la API está disponible en `http://localhost:3000/api-docs`.
4. El frontend abre en `http://localhost:5173`.
5. Se puede iniciar sesión con `admin` / `admin123`.

---

## 8. Documentación de la API

La API está documentada con el estándar **OpenAPI 3.0** y se expone mediante **Swagger UI**:

| Recurso | URL |
|---------|-----|
| Swagger UI (interactivo) | `http://localhost:3000/api-docs` |
| Especificación OpenAPI (JSON) | `http://localhost:3000/api-docs.json` |

Desde Swagger UI se pueden explorar todos los endpoints, ver los esquemas de request/response y ejecutar peticiones contra la API.

Para probar rutas protegidas:

1. Ejecutar `POST /api/auth/login` con `{ "username": "admin", "password": "admin123" }`.
2. Copiar el `token` de la respuesta.
3. Usar el botón **Authorize** (arriba a la derecha) e ingresar `Bearer <token>`.

La especificación vive en `Backend/src/docs/openapi.js`.

---

## 9. Solución de problemas

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `Error connecting to the database` / `Access denied` | MySQL no está corriendo o credenciales incorrectas en `.env`. | Verificar el servicio de MySQL y revisar `DB_USER`, `DB_PASSWORD` y `DATABASE_URL`. |
| `Can't reach database server` al correr `setup` | Host/puerto incorrectos. | Revisar `DB_HOST` y `DB_PORT` (por defecto `localhost:3306`). |
| `The table ... does not exist` | No se aplicó el esquema. | Ejecutar `npm run setup` en `Backend`. |
| `EADDRINUSE: port 3000` | Ya hay otro proceso usando el puerto 3000. | Cerrar el proceso anterior o cambiar el puerto en `Backend/server.js`. |
| `EADDRINUSE: port 5173` | Ya hay otro Vite corriendo. | Cerrar la otra terminal o usar `npm run dev -- --port 5174`. |
| El frontend carga pero no trae datos | El backend no está corriendo o está en otro puerto. | Verificar que el backend esté en `http://localhost:3000` o definir `VITE_API_URL`. |
| Error de versión de Node al iniciar el frontend | Node.js desactualizado o en una rama no soportada (21.x / 22.0–22.11). | Instalar Node.js 20.19+ (rama 20) o 22.12+ (rama 22). |
| `Prisma Client did not initialize` | No se ejecutó `prisma generate`. | Ejecutar `npm install` en `Backend` o `npx prisma generate`. |
| No aparecen ciudades en el formulario | Seed de ubicaciones no ejecutado. | Ejecutar `npm run seed:locations` en `Backend`. |

---

## 10. Notas

- El archivo `Backend/.env` es privado y no se versiona; cada entorno debe crear el suyo.
- Las imágenes subidas por los usuarios se guardan en `Backend/uploads/` y se sirven en `/uploads`.
- Los seeds pueden ejecutarse varias veces sin duplicar información.
- Ante cualquier error de conexión, verificar primero que MySQL esté activo y que `Backend/.env` tenga los datos correctos.
