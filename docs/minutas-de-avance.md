# Minutas de Avance y Coordinación — Proyecto Stylo

| Campo | Detalle |
|---|---|
| Proyecto | **Stylo** — Sistema de reservas para salón de eventos |
| Materia | Desarrollo de Software |
| Equipo | Felicitas Di Pentima, Nadia Berrino, Luisina Movio |
| Repositorio | `TP-DesarrolloSoftware` (monorepo: `Backend`, `frontend`, `database`) |
| Período documentado | Agosto – Octubre 2026 |
| Metodología | **Scrum** con prácticas de ingeniería de **XP** |
| Herramienta de trackeo | Planilla de cálculo (Excel / Google Sheets) + historial de commits en `main` |
| Versión del documento | 1.0 |
| Fecha de compilación | 26/10/2026 |

Este documento reúne las minutas de los cuatro cortes de avance del proyecto, el marco de gestión adoptado y la documentación de trackeo exigida por la cátedra (features, bugfixes, refactorizaciones, scripts de base de datos y asignación de tareas).

---

## 1. Marco de gestión del proyecto

### 1.1. Metodología adoptada

Se adoptó **Scrum** como marco de gestión, adaptado a un equipo de tres integrantes, complementado con prácticas de **XP (Extreme Programming)** para el trabajo técnico. La elección responde a que Scrum aporta la cadencia, los artefactos y la visibilidad del avance, mientras que XP refuerza la calidad del código en un equipo pequeño con alta rotación de tareas.

| Elemento | Implementación en Stylo |
|---|---|
| Marco principal | Scrum (adaptado a equipo de 3) |
| Prácticas de XP | Refactorización continua, diseño simple, propiedad colectiva del código, integración frecuente, estándares de código y revisiones cruzadas |
| Duración de sprint | 2 a 3 semanas |
| Planificación | Al inicio de cada corte, con selección de ítems del backlog y criterios de aceptación |
| Daily | Seguimiento asíncrono por canal del equipo, con foco en impedimentos |
| Review | Demostración funcional del incremento al cierre de cada corte |
| Retrospectiva | Al final de cada corte: qué funcionó, qué mejorar y acciones concretas |
| Artefactos | Product Backlog, Sprint Backlog, matriz de seguimiento y asignación de tareas, minutas e historial de commits |
| Definición de terminado (DoD) | Código integrado en `main`, validaciones y manejo de errores, revisión de un par, documentación mínima y prueba manual del flujo |

### 1.2. Roles y responsabilidades

| Integrante | Usuario GitHub | Rol técnico | Responsabilidad de gestión |
|---|---|---|---|
| Felicitas Di Pentima | `Felicitas26` | Backend, modelos, unificación de vistas de administración | Facilitadora de la Minuta 1; revisión de integración y consistencia de vistas admin |
| Nadia Berrino | `NadiaBerrino` | Backend, ORM, scripts SQL, base de datos, autenticación y modelos de dominio | Facilitadora de la Minuta 2; custodia del esquema, migraciones y entorno |
| Luisina Movio | `LuliMovio` | Frontend, componentes React, CRUDs, integración de pagos, seeds, mobile first, seguridad y notificaciones | Facilitadora de las Minutas 3 y 4; QA funcional y validación de UX |

**Scrum Master:** rotativo por corte, según la facilitadora indicada en cada minuta.
**Product Owner:** el equipo en su conjunto, con validación del docente como stakeholder.
**Propiedad del código:** colectiva; toda tarea puede ser retomada por otro integrante.

### 1.3. Herramientas y convenciones de trabajo

- **Planilla de seguimiento:** se utiliza una hoja de cálculo (Excel / Google Sheets) como Product Backlog y Matriz de Seguimiento y Asignación de Tareas.
- **Ramas:** se trabaja sobre una única rama (`main`); no se utilizan ramas por funcionalidad.
- **Integración:** los cambios se suben directamente a `main`; no se utilizan Pull Requests, aunque se mantiene la revisión cruzada entre integrantes.
- **Commits:** mensajes descriptivos en español, agrupados por funcionalidad.
- **Backend:** nomenclatura en inglés para entidades, controladores, rutas y servicios; arquitectura por capas (`routes → controllers → services → models`).
- **Frontend:** React + Vite, componentes por entidad, servicios centralizados de API y enfoque **mobile first**.
- **Base de datos:** MySQL + Prisma como ORM; scripts de seed idempotentes.
- **Configuración:** variables de entorno en `.env`; credenciales y secretos fuera del repositorio.
- **API:** documentación OpenAPI 3.0 expuesta con Swagger UI.

### 1.4. Resumen de cortes

| Corte | Fecha | Foco principal | Estado |
|---|---|---|---|
| Minuta 1 | 10/08/2026 | Definición, arquitectura inicial y refactor de rutas/controladores | Cerrado |
| Minuta 2 | 04/09/2026 | Base de datos, ORM, modelos de dominio y módulos Cliente/Salones | Cerrado |
| Minuta 3 | 14/09/2026 | Reservas, contratos, seeds automáticos y pasarela de pagos | Cerrado |
| Minuta 4 | 22/10/2026 | Refinamiento, validaciones, seguridad, notificaciones y filtros | Cerrado |

---

## 2. Minutas de los cortes de avance

### 2.1. Minuta 1 — Definición del proyecto y arquitectura inicial

**Fecha y hora:** lunes 10/08/2026, 18:00–19:30 (UTC-3).
**Modalidad:** reunión virtual del equipo.
**Duración:** 90 minutos.
**Facilitadora:** Felicitas Di Pentima.
**Evidencia:** definición del alcance en `Proposal.md`, estructura inicial del repositorio y commits de estandarización del backend.

#### Participantes

| Integrante | Rol en la reunión |
|---|---|
| Felicitas Di Pentima | Backend, modelos y unificación de vistas admin |
| Nadia Berrino | Backend, ORM, scripts SQL y base de datos |
| Luisina Movio | Frontend, componentes React, CRUDs e integración |

#### Objetivo del Sprint / Corte

Definir el alcance funcional de Stylo, acordar la arquitectura general del sistema y establecer las convenciones de trabajo. Como resultado del corte se esperaba contar con el esqueleto de backend y frontend, la configuración de entorno y las primeras pantallas del módulo de clientes.

#### Logros y Avances Técnicos

- **Alcance definido:** sistema de reservas de salones de eventos con dos perfiles (administrador y cliente), registro de clientes, solicitud de reserva, contrato, pago y seguimiento.
- **Estructura del repositorio:** separación en `Backend`, `frontend` y `database`, con documentación de instalación en `INSTALL.md`.
- **Backend inicial:** creación de `server.js`, configuración de Express, CORS, parseo JSON y montaje de las primeras rutas.
- **Arquitectura por capas:** definición de la cadena `routes → controllers → services → models` y estandarización de nombres en inglés para las entidades (`client`, `lounge`, `contract`, `cardDetail`).
- **Frontend inicial:** creación del proyecto con React + Vite y primeras pantallas del módulo de clientes: `newClient`, `editClient` y `clientList`.
- **Configuración de entorno:** archivo `.env`, variables de conexión y lineamientos para no versionar credenciales.
- **Propuesta del proyecto:** redacción inicial de `Proposal.md` con alcance mínimo y adicional.

#### Decisiones de Arquitectura / Diseño Tomadas

| ID | Decisión | Justificación | Impacto |
|---|---|---|---|
| AD-01 | Backend y frontend desacoplados, comunicados por API REST | Requisito de la cátedra y separación de responsabilidades | Permite desarrollar y desplegar cada parte de forma independiente |
| AD-02 | Arquitectura por capas en el backend | Facilita mantenimiento, pruebas y reutilización de lógica | Toda nueva entidad debe respetar `routes/controllers/services/models` |
| AD-03 | Nomenclatura en inglés en el backend | Consistencia con el modelo de datos y con el ecosistema de librerías | Evita mezcla de idiomas en el código |
| AD-04 | React + Vite para el frontend | Rapidez de desarrollo, recarga en caliente y ecosistema maduro | Componentes por entidad y servicios de API centralizados |
| AD-05 | Variables de entorno para configuración sensible | Seguridad y portabilidad entre entornos | `.env` obligatorio; `.gitignore` para secretos |
| AD-06 | Monorepo con carpetas `Backend`, `frontend` y `database` | Simplicidad de coordinación para un equipo pequeño | Un solo repositorio y un solo historial de commits |
| AD-07 | Trabajo sobre una única rama (`main`) con revisión cruzada | Simplicidad para un equipo pequeño y menor sobrecarga de integración | Los cambios se suben directo a `main`, sin Pull Requests |

#### Backlog / Próximas Tareas Asignadas

| ID | Tarea | Tipo | Responsable | Prioridad | Criterio de aceptación |
|---|---|---|---|---|---|
| STY-01 | Estandarizar nombres y estructura de rutas/controladores en inglés | Refactor | Felicitas Di Pentima / Nadia Berrino | Alta | Entidades con rutas y controladores consistentes |
| STY-02 | Diseñar el modelo relacional inicial | Base de datos | Nadia Berrino | Alta | Diagrama y script SQL con entidades principales |
| STY-03 | Crear el CRUD inicial de clientes en frontend | Feature | Luisina Movio | Alta | Alta, edición y listado funcionando contra la API |
| STY-04 | Configurar `.env`, `server.js` y scripts de arranque | Feature | Nadia Berrino | Alta | Backend levanta en el puerto 3000 con configuración externa |
| STY-05 | Definir el esquema de autenticación y roles | Spike | Nadia Berrino | Media | Propuesta técnica de login JWT y dos niveles de acceso |
| STY-06 | Relevar entidades y atributos del dominio | Análisis | Felicitas Di Pentima | Media | Listado validado de entidades y relaciones |

#### Riesgos e Impedimentos

| Riesgo | Probabilidad | Impacto | Mitigación acordada |
|---|---|---|---|
| Curva de aprendizaje del ORM y de MySQL | Media | Alto | Spike técnico y pair programming |
| Diferencias de entorno entre integrantes | Alta | Medio | Documentar instalación en `INSTALL.md` y usar `.env` |
| Sincronización de archivos por OneDrive | Media | Medio | Excluir `node_modules`, `dist` y archivos temporales del repositorio |
| Alcance creciente del proyecto | Media | Alto | Priorizar alcance mínimo y registrar adicionales en backlog |

#### Métricas del corte

| Indicador | Valor |
|---|---|
| Ítems completados | 5 |
| Ítems planificados | 6 |
| Bugs abiertos | 0 |
| Refactorizaciones | 1 (estandarización de nomenclatura) |
| Scripts de base de datos | 0 (diseño en curso) |

#### Retrospectiva y acuerdos

- **Qué funcionó:** la separación temprana de responsabilidades y la definición clara del alcance.
- **Qué mejorar:** evitar decisiones de modelo de datos sin validación conjunta.
- **Acciones:** Nadia lidera el diseño de base de datos; Felicitas revisa consistencia de entidades; Luli concentra el frontend de clientes.
- **Acuerdo:** ninguna funcionalidad se considera terminada sin validación de entrada y manejo de errores.

---

### 2.2. Minuta 2 — Base de datos, ORM y módulos Cliente/Salones

**Fecha y hora:** viernes 04/09/2026, 18:00–19:45 (UTC-3).
**Modalidad:** reunión virtual del equipo.
**Duración:** 105 minutos.
**Facilitadora:** Nadia Berrino.
**Evidencia:** script `database/new_event_hall.sql`, modelos de dominio, commits de integración de salones y alta de cliente.

#### Participantes

| Integrante | Rol en la reunión |
|---|---|
| Felicitas Di Pentima | Backend, modelos y unificación de vistas admin |
| Nadia Berrino | Backend, ORM, scripts SQL y base de datos — **facilitadora de la reunión** |
| Luisina Movio | Frontend, componentes React, CRUDs e integración |

#### Objetivo del Sprint / Corte

Consolidar la persistencia del sistema: crear la base de datos `event_hall`, definir el modelo relacional y los modelos de dominio, integrar el ORM y conectar el frontend de salones y clientes con el backend.

#### Logros y Avances Técnicos

- **Script de base de datos:** creación de `database/new_event_hall.sql` con las tablas principales (`usuario`, `cliente`, `salon`, `tipo_salon`, `ubicacion`, `reserva`, `contrato`, `pago`, `detalle_tarjeta`, `servicio_extra`, entre otras).
- **Modelo de dominio:** implementación y mejora de modelos como `lounge.model.js` y `client.model.js`, con validaciones y mapeo de datos.
- **Integración inicial del ORM:** configuración de Prisma, definición del esquema y acceso a datos desde los modelos.
- **Módulo de salones:** integración de las vistas de Lounges del frontend con el backend de ubicaciones y con la nueva base de datos.
- **Módulo de clientes:** alta de cliente con flujo básico funcionando y actualización de datos; se detecta un bug de validación que queda abierto para el corte siguiente.
- **Autenticación base:** implementación del login con JWT, hash de contraseñas con bcrypt y middleware de autenticación.
- **Roles de usuario:** incorporación del campo `rol` con los valores `administrador` y `cliente`, y del indicador `passwordTemporal`.
- **Consultas y filtros base:** primeras consultas de listado y búsqueda por atributos para salones y clientes.

#### Decisiones de Arquitectura / Diseño Tomadas

| ID | Decisión | Justificación | Impacto |
|---|---|---|---|
| AD-08 | MySQL como base de datos persistente | Requisito de persistencia externa de la cátedra | Conexión mediante pool y variables de entorno |
| AD-09 | Prisma como ORM | Mapeo declarativo, tipado y migraciones simples | El acceso a datos se centraliza en `src/lib/prisma.js` |
| AD-10 | Claves primarias sustitutas (`id`) en las entidades | Simplifica relaciones y evita dependencias naturales | Las tablas referencian IDs internos |
| AD-11 | Modelos de dominio separados del ORM | Mantener la lógica de negocio y validaciones fuera del acceso a datos | Los servicios orquestan y los modelos encapsulan consultas |
| AD-12 | Seed como mecanismo de datos iniciales | Reproducibilidad del entorno y pruebas manuales | Scripts idempotentes que omiten registros existentes |
| AD-13 | Vistas de salones conectadas a la API real | Evitar datos mock y detectar errores de integración temprano | El frontend consume endpoints desde el inicio |

#### Backlog / Próximas Tareas Asignadas

| ID | Tarea | Tipo | Responsable | Prioridad | Criterio de aceptación |
|---|---|---|---|---|---|
| STY-07 | Completar CRUD de salones y tipos de salón | Feature | Felicitas Di Pentima / Luisina Movio | Alta | Alta, edición, listado y baja funcionando |
| STY-10 | Implementar CRUD de precios | Feature | Luisina Movio | Media | Módulo de precios en admin y API asociada |
| STY-11 | Corregir claves primarias y relaciones del esquema | Base de datos | Nadia Berrino | Alta | Esquema actualizado y `db push` sin errores |
| STY-12 | Preparar seeds de ubicaciones, salones y precios | Base de datos | Luisina Movio | Media | Seeds ejecutables y datos visibles en el frontend |
| STY-13 | Definir el flujo de reserva de punta a punta | Análisis | Felicitas Di Pentima | Alta | Diagrama de estados y endpoints identificados |
| STY-31 | Corregir validaciones del alta de cliente | Bugfix | Nadia Berrino | Alta | Alta de cliente sin errores de validación |

#### Riesgos e Impedimentos

| Riesgo | Probabilidad | Impacto | Mitigación acordada |
|---|---|---|---|
| Inconsistencia entre `DB_*` y `DATABASE_URL` | Alta | Alto | Unificar credenciales y documentar en `INSTALL.md` |
| Cambios de esquema con datos ya cargados | Media | Alto | Versionar scripts y recrear la base en desarrollo |
| Duplicación de lógica entre modelos y servicios | Media | Medio | Revisión cruzada y refactor temprano |
| Seeds no idempotentes | Media | Medio | Verificar existencia antes de insertar |

#### Métricas del corte

| Indicador | Valor |
|---|---|
| Ítems completados | 6 |
| Ítems planificados | 7 |
| Bugs abiertos | 1 (alta de cliente) |
| Refactorizaciones | 2 (modelos de dominio y esquema) |
| Scripts de base de datos | 1 (`new_event_hall.sql`) |

#### Retrospectiva y acuerdos

- **Qué funcionó:** la integración temprana del frontend con la API permitió detectar problemas de datos a tiempo.
- **Qué mejorar:** las credenciales de MySQL generaron retrabajo; se acordó una única fuente de configuración.
- **Acciones:** Nadia documenta el esquema; Felicitas valida altas y relaciones; Luli ajusta las vistas a los datos reales.
- **Acuerdo:** todo cambio de esquema se comunica al equipo y se refleja en el script SQL antes de subir los cambios.

---

### 2.3. Minuta 3 — Reservas, contratos, seeds automáticos y pagos

**Fecha y hora:** lunes 14/09/2026, 18:00–20:00 (UTC-3).
**Modalidad:** reunión virtual del equipo.
**Duración:** 120 minutos.
**Facilitadora:** Luisina Movio.
**Evidencia:** commits `completé funcionalidades del CUU realizar reserva`, `bugs de realizar reserva resueltos`, `payment backend`, `contract`, `Estos cambios deberían permitir q los seeds se ejecuten automáticamente y la BD se cree tmb en automático`.

#### Participantes

| Integrante | Rol en la reunión |
|---|---|
| Felicitas Di Pentima | Backend, modelos y unificación de vistas admin |
| Nadia Berrino | Backend, ORM, scripts SQL y base de datos |
| Luisina Movio | Frontend, componentes React, CRUDs e integración de pagos |

#### Objetivo del Sprint / Corte

Completar el caso de uso central del negocio —realizar una reserva— e integrar los módulos de contrato, términos y condiciones y pago. Además, automatizar la creación de la base de datos y la carga de datos iniciales para facilitar la instalación.

#### Logros y Avances Técnicos

- **Caso de uso “Realizar reserva”:** flujo completo de selección de salón, fecha, cantidad de invitados, servicios extra y confirmación de solicitud.
- **Resolución de bugs de reservas:** corrección de validaciones, estados y consistencia de datos en el alta y la edición.
- **Corrección del alta de cliente:** ajuste de validaciones y actualización de datos para dejar el flujo operativo.
- **Módulo de contratos:** generación del contrato a partir de una reserva, contenido de términos y condiciones y estados del contrato.
- **Solicitudes de modificación:** gestión de cambios posteriores a la firma, con aprobación o rechazo del administrador.
- **Pasarela de pagos (backend y frontend):** registro y conexión del pago al caso de uso, con detalle de tarjeta y estados de pago.
- **Automatización de seeds:** script `scripts/setup.js` que crea la base si no existe, aplica el esquema con `prisma db push` y ejecuta los seeds en orden.
- **Seeds implementados:** ubicaciones, salones, tipos de salón, precios, servicios extra, detalles de tarjeta y usuarios.
- **Unificación de vistas de administración:** páginas de gestión alineadas al estándar admin y tablas a ancho completo.
- **Módulo de precios en frontend:** listado y administración de precios.
- **Notificaciones de rechazo:** aviso al cliente cuando el administrador rechaza una solicitud o modificación.

#### Decisiones de Arquitectura / Diseño Tomadas

| ID | Decisión | Justificación | Impacto |
|---|---|---|---|
| AD-14 | El contrato se genera a partir de una reserva aceptada | Refleja el flujo real del negocio | La reserva y el contrato comparten datos y estados |
| AD-15 | Máquina de estados para reservas y contratos | Evita transiciones inválidas | Las acciones disponibles dependen del estado actual |
| AD-16 | Pago como entidad separada vinculada al contrato | Permite registrar cuotas, estados y medios de pago | El módulo de pagos puede evolucionar sin tocar el contrato |
| AD-17 | Seeds idempotentes y setup automatizado | Instalación reproducible en cualquier máquina | Un solo comando prepara el entorno (`npm run setup`) |
| AD-18 | Contenido del contrato centralizado en `contractContent.js` | Facilita mantener los términos y condiciones | Los cambios legales se hacen en un único archivo |
| AD-19 | Servicios de frontend centralizados | Evitar `fetch` dispersos y unificar manejo de tokens | Los componentes consumen `src/services` |
| AD-20 | Unificación del estándar visual de administración | Consistencia de UX y menor costo de mantenimiento | Todas las tablas y formularios admin comparten estructura |

#### Backlog / Próximas Tareas Asignadas

| ID | Tarea | Tipo | Responsable | Prioridad | Criterio de aceptación |
|---|---|---|---|---|---|
| STY-14 | Completar CRUD de reservas en admin | Feature | Felicitas Di Pentima | Alta | Listado, detalle, aceptación y rechazo funcionando |
| STY-15 | Completar CRUD de contratos en admin | Feature | Felicitas Di Pentima / Luisina Movio | Alta | Generación, edición, revisión y anulación |
| STY-16 | Integrar pago al flujo del cliente | Feature | Luisina Movio | Alta | El cliente registra el pago y ve el estado |
| STY-17 | Mejorar notificaciones de rechazo y cambios de estado | Feature | Luisina Movio | Media | El cliente recibe y visualiza la notificación |
| STY-18 | Ajustar seeds y datos de ejemplo | Refactor | Luisina Movio | Media | Datos coherentes y reutilizables en todas las vistas |
| STY-19 | Normalizar nombres y atributos de servicios extra | Refactor | Luisina Movio | Baja | Consistencia de mayúsculas y campos |
| STY-20 | Revisar el esquema tras la incorporación de pagos y contratos | Base de datos | Nadia Berrino | Alta | `prisma db push` sin errores y relaciones correctas |
| STY-21 | Validar el flujo completo reserva → contrato → pago | QA | Felicitas Di Pentima | Alta | Prueba manual documentada del caso de uso |

#### Riesgos e Impedimentos

| Riesgo | Probabilidad | Impacto | Mitigación acordada |
|---|---|---|---|
| Complejidad de la máquina de estados de contratos | Alta | Alto | Documentar transiciones y validar en servicio |
| Duplicación en la generación de contratos | Media | Medio | Unificar el punto de creación y revisar botones duplicados |
| Datos de seed inconsistentes entre módulos | Media | Medio | Revisión cruzada de seeds y ejecución completa del setup |
| Dependencia de la pasarela de pago | Baja | Medio | Mantener el pago como entidad propia y simular el flujo |

#### Métricas del corte

| Indicador | Valor |
|---|---|
| Ítems completados | 12 |
| Ítems planificados | 14 |
| Bugs corregidos | 3 (alta de cliente, reservas y creación duplicada de contratos) |
| Refactorizaciones | 3 (seeds, servicios extra y vistas admin) |
| Scripts de base de datos | 1 script de setup + 6 seeds |

#### Retrospectiva y acuerdos

- **Qué funcionó:** la automatización del setup redujo notablemente los problemas de instalación.
- **Qué mejorar:** evitar duplicar lógica de negocio entre frontend y backend.
- **Acciones:** Felicitas revisa el flujo de contratos; Nadia valida el esquema; Luli consolida servicios y notificaciones.
- **Acuerdo:** todo bug crítico del caso de uso principal se trata como prioridad del corte siguiente.

---

### 2.4. Minuta 4 — Refinamiento, seguridad, notificaciones y filtros

**Fecha y hora:** jueves 22/10/2026, 18:30–20:15 (UTC-3).
**Modalidad:** reunión virtual del equipo.
**Duración:** 105 minutos.
**Facilitadora:** Luisina Movio.
**Evidencia:** commits del 16, 20 y 22/10/2026: `manejo centralizado de errores y validacion en backend`, `modelos de dominio en el front`, `cambios para el mobile first`, `agregué selección de ciudad para ingreso de nuevos users`, `mejoré notificaciones, se pueden borrar`, `validaciones para los users`, `filtrado para reservas y contratos de clientes`, `protección d los accesos`, `document. api back`, `proposal`.

#### Participantes

| Integrante | Rol en la reunión |
|---|---|
| Felicitas Di Pentima | Backend, modelos y unificación de vistas admin |
| Nadia Berrino | Backend, ORM, scripts SQL y base de datos |
| Luisina Movio | Frontend, componentes React, CRUDs, seguridad y notificaciones |

#### Objetivo del Sprint / Corte

Refinar la aplicación de cara a la entrega: mejorar la experiencia mobile first, centralizar errores y validaciones, proteger el acceso a rutas según rol, completar el sistema de notificaciones y agregar filtros avanzados para reservas y contratos.

#### Logros y Avances Técnicos

- **Manejo centralizado de errores:** middleware de errores en el backend y respuestas consistentes hacia el frontend.
- **Validaciones de usuario:** controles de datos en alta y edición, con mensajes claros y prevención de duplicados.
- **Protección de accesos:** rutas protegidas en el frontend según rol y validación de sesión; redirección al login cuando corresponde.
- **Notificaciones:** persistencia, listado, marcado como leídas y eliminación por parte del usuario; mejoras en la actualización y en la campana de notificaciones.
- **Filtrado avanzado:** filtros para reservas y contratos de clientes por distintos atributos, con listados acotados según el usuario.
- **Mobile first:** revisión de estilos, reacomodamiento de botones y ajustes para los breakpoints SM, MD y LG.
- **Selección de ciudad:** incorporación de la ciudad en el registro de nuevos usuarios y en la carga de datos.
- **Modelos de dominio en el frontend:** representación de entidades y servicios tipados para requests y respuestas.
- **Servicios de frontend:** centralización de llamadas a la API, manejo de token y construcción de URLs de recursos.
- **Documentación de la API:** especificación OpenAPI 3.0 y Swagger UI disponible en `/api-docs`.
- **Actualización de la propuesta:** `Proposal.md` alineada al alcance final y a los requisitos de la cátedra.
- **Ajuste de listados:** eliminación del límite de resultados en las vistas que mostraban sólo una parte de los datos cargados.

#### Decisiones de Arquitectura / Diseño Tomadas

| ID | Decisión | Justificación | Impacto |
|---|---|---|---|
| AD-21 | Middleware centralizado de errores y validaciones | Evitar respuestas dispares y duplicación de controles | Todos los endpoints devuelven errores homogéneos |
| AD-22 | Protección de rutas en frontend y backend | Requisito de seguridad y de dos niveles de acceso | `requireRole` en API y guardas de sesión en React |
| AD-23 | Notificaciones persistentes con baja lógica/física controlada | El usuario necesita gestionar su bandeja | Se pueden listar, leer y eliminar |
| AD-24 | Filtros del lado del servidor para reservas y contratos | Evitar exponer datos ajenos y mejorar performance | El cliente sólo ve sus propios registros |
| AD-25 | Enfoque mobile first con breakpoints SM/MD/LG | Requisito de la cátedra y usabilidad real | Los estilos parten de móvil y escalan |
| AD-26 | Modelos y servicios tipados en el frontend | Requisito de representación de modelos de objetos | Menos errores de integración y mayor claridad |
| AD-27 | Documentación OpenAPI mantenida en el código | La API debe estar documentada para la defensa | Swagger se genera desde `src/docs/openapi.js` |
| AD-28 | Cierre de alcance con deuda técnica explícita | Priorizar funcionalidad entregable y transparentar pendientes | Los pendientes se registran en la sección 3.7 |

#### Backlog / Próximas Tareas Asignadas

| ID | Tarea | Tipo | Responsable | Prioridad | Criterio de aceptación |
|---|---|---|---|---|---|
| STY-22 | Revisar y completar validaciones de todos los formularios | Feature | Luisina Movio / Felicitas Di Pentima | Alta | Formularios con validación y mensajes de error |
| STY-23 | Auditar rutas protegidas y permisos por rol | Seguridad | Nadia Berrino / Luisina Movio | Alta | Ningún rol accede a rutas que no le corresponden |
| STY-24 | Agregar pruebas automatizadas (1 por integrante + integración) | Test | Equipo | Alta | Suite ejecutable y evidencia de resultados |
| STY-25 | Incorporar pruebas unitarias de componentes y E2E | Test | Luisina Movio | Media | Al menos un test de componente y un E2E |
| STY-26 | Revisar consistencia de seeds y datos de demo | Refactor | Nadia Berrino | Media | Setup reproducible desde cero |
| STY-27 | Completar README e instructivo de despliegue | Documentación | Felicitas Di Pentima | Media | Instalación reproducible sin conocimiento previo |
| STY-28 | Preparar video demostrativo y guion de defensa | Documentación | Equipo | Alta | Video y guion disponibles para la entrega |
| STY-29 | Verificar build de producción del frontend | QA | Luisina Movio | Media | `npm run build` sin errores |
| STY-30 | Revisar Swagger y credenciales de la app | Documentación | Nadia Berrino | Media | Swagger completo y credenciales documentadas |

#### Riesgos e Impedimentos

| Riesgo | Probabilidad | Impacto | Mitigación acordada |
|---|---|---|---|
| Falta de pruebas automatizadas para la entrega | Alta | Alto | Priorizar STY-24 y STY-25 en el cierre |
| Regresiones por cambios de seguridad | Media | Alto | Prueba manual de ambos roles antes de subir los cambios |
| Tiempo disponible antes de la defensa | Alta | Alto | Congelar alcance y enfocar en calidad y documentación |
| Datos de demo inconsistentes | Media | Medio | Reejecutar setup desde cero y validar seeds |
| Dependencia de configuración local de MySQL | Media | Medio | Documentar credenciales y usar `.env` |

#### Métricas del corte

| Indicador | Valor |
|---|---|
| Ítems completados | 13 |
| Ítems planificados | 17 |
| Bugs corregidos | 3 (notificaciones, duplicación de contratos y límite de listados) |
| Refactorizaciones | 4 (servicios, modelos de dominio, estilos y seeds) |
| Documentación | OpenAPI/Swagger y `Proposal.md` actualizados |

#### Retrospectiva y acuerdos

- **Qué funcionó:** la integración temprana y la revisión cruzada permitieron cerrar el flujo completo reserva → contrato → pago.
- **Qué mejorar:** la deuda de pruebas automatizadas se acumuló y debe resolverse antes de la entrega final.
- **Acciones:** Nadia audita permisos y esquema; Felicitas cierra README y consistencia admin; Luli completa tests y build.
- **Acuerdo:** no se agregan funcionalidades nuevas por fuera del alcance acordado; todo esfuerzo restante se destina a calidad, pruebas y documentación.

---

## 3. Documentación de trackeo consolidada

La siguiente sección concentra el seguimiento de features, bugfixes, refactorizaciones, scripts de base de datos y asignación de tareas. Los IDs son estables y permiten trazar cada ítem entre minutas, commits y backlog.

### 3.1. Features

| ID | Feature | Sprint | Responsable | Estado | Evidencia |
|---|---|---|---|---|---|
| STY-03 | CRUD inicial de clientes en frontend | 1 | Luisina Movio | Hecho | Componentes `newClient`, `editClient`, `clientList` |
| STY-08 | Login con JWT y dos roles | 2 | Nadia Berrino | Hecho | `auth.controller.js`, `auth.middleware.js` |
| STY-09 | Protección de rutas por rol | 2 | Nadia Berrino | Hecho | Middleware `requireRole` en rutas |
| STY-10 | CRUD de precios | 3 | Luisina Movio | Hecho | Commit `armé front de prices` y API asociada |
| STY-14 | CRUD de reservas en admin | 3 | Felicitas Di Pentima | Hecho | Listado, detalle y cambio de estado |
| STY-15 | CRUD de contratos | 3 | Felicitas Di Pentima / Luisina Movio | Hecho | Generación, revisión, edición y anulación |
| STY-16 | Integración de pagos al flujo del cliente | 3 | Luisina Movio | Hecho | Commit `payment incorporado al CUU` |
| STY-17 | Notificaciones de rechazo y cambios de estado | 3 | Luisina Movio | Hecho | Commit `agregue notificaciones correspondientes a los rechazos del admin` |
| STY-22 | Validaciones de formularios y usuarios | 4 | Luisina Movio / Felicitas Di Pentima | Hecho | Commit `validaciones para los users` |
| STY-23 | Protección de accesos y sesión | 4 | Nadia Berrino / Luisina Movio | Hecho | Commit `protección d los accesos` |
| STY-24 | Notificaciones persistentes y eliminables | 4 | Luisina Movio | Hecho | Commits `mejoré notificaciones, se pueden borrar` y `mejoras notis` |
| STY-25 | Filtrado de reservas y contratos por cliente | 4 | Luisina Movio | Hecho | Commit `filtrado para reservas y contratos de clientes` |
| STY-26 | Selección de ciudad en registro de usuarios | 4 | Luisina Movio | Hecho | Commit `agregué selección de ciudad para ingreso de nuevos users` |
| STY-27 | Mobile first y reacomodo de botones | 4 | Luisina Movio | Hecho | Commits `cambios para el mobile first` y `reacomodé los botones` |
| STY-28 | Modelos de dominio y servicios en frontend | 4 | Luisina Movio | Hecho | Commits `modelos de dominio en el front` y `services implementados` |
| STY-29 | Documentación OpenAPI/Swagger | 4 | Luisina Movio | Hecho | `Backend/src/docs/openapi.js` y `/api-docs` |

### 3.2. Bugfixes

| ID | Bug | Sprint | Responsable | Estado | Evidencia |
|---|---|---|---|---|---|
| STY-31 | Alta de cliente con errores de validación | 3 | Nadia Berrino | Corregido | Commit `Alta cliente funcionando + actualizaciones` |
| STY-32 | Bugs del caso de uso “Realizar reserva” | 3 | Luisina Movio | Corregido | Commit `bugs de realizar reserva resueltos` |
| STY-33 | Creación duplicada de contratos y botón redundante | 3 | Luisina Movio | Corregido | Commit `arreglé redundancia de creación de contratos, botón de más` |
| STY-34 | Límite artificial de resultados en listados | 4 | Luisina Movio | Corregido | Commit `saqué el maxResults = 8...` |
| STY-35 | Notificaciones sin persistencia ni borrado | 4 | Luisina Movio | Corregido | Commits del 20/10 sobre notificaciones |

### 3.3. Refactorizaciones

| ID | Refactor | Sprint | Responsable | Estado | Evidencia |
|---|---|---|---|---|---|
| STY-01 | Estandarización de nomenclatura en inglés en backend | 1 | Felicitas Di Pentima / Nadia Berrino | Hecho | Rutas, controladores y servicios renombrados |
| STY-11 | Ajuste de claves primarias y relaciones | 2 | Nadia Berrino | Hecho | Cambio de PK en precios y esquema actualizado |
| STY-18 | Normalización de datos y atributos de servicios extra | 3 | Luisina Movio | Hecho | Commit `normalicé las mayusculas en extraService` |
| STY-19 | Reorganización de seeds y datos de contrato | 3 | Luisina Movio | Hecho | Commit `reordené la info, creé seed extraServ... BD actualizada` |
| STY-20 | Unificación de vistas de gestión al estándar admin | 3 | Felicitas Di Pentima | Hecho | Commit `Unifico paginas de gestion al estandar admin y tablas a ancho completo` |
| STY-30 | Centralización de errores y validaciones | 4 | Luisina Movio | Hecho | Commit `manejo centralizado de errores y validacion en backend` |

### 3.4. Scripts de base de datos y datos iniciales

| ID | Script / Artefacto | Propósito | Responsable | Estado |
|---|---|---|---|---|
| DB-01 | `database/new_event_hall.sql` | Definición del esquema relacional inicial | Nadia Berrino | Hecho |
| DB-02 | `Backend/prisma/schema.prisma` | Modelo ORM y generación del cliente Prisma | Nadia Berrino | Hecho |
| DB-03 | `Backend/scripts/setup.js` | Crear base, aplicar esquema y ejecutar seeds | Luisina Movio | Hecho |
| DB-04 | `Backend/scripts/seedUsuarios.js` | Usuario administrador inicial (`admin` / `admin123`) | Luisina Movio | Hecho |
| DB-05 | `Backend/scripts/seedLocations.js` | Ciudades y ubicaciones | Luisina Movio | Hecho |
| DB-06 | `Backend/scripts/seedLounges.js` | Salones de ejemplo | Luisina Movio | Hecho |
| DB-07 | `Backend/scripts/seedCardDetails.js` | Datos de tarjetas | Luisina Movio | Hecho |
| DB-08 | `Backend/scripts/seedExtraServices.js` | Servicios extra | Luisina Movio | Hecho |
| DB-09 | `Backend/scripts/seedPrices.js` | Precios de salones | Luisina Movio | Hecho |

### 3.5. Asignación y carga de trabajo

| Integrante | Áreas principales | Ítems asignados | Rol de gestión |
|---|---|---|---|
| Felicitas Di Pentima | Backend, modelos, vistas admin, integración | STY-01, STY-06, STY-14, STY-15, STY-20, STY-27 | Facilitadora Minuta 1; revisión de integración |
| Nadia Berrino | ORM, SQL, base de datos, autenticación, dominio | STY-02, STY-04, STY-05, STY-08, STY-09, STY-11, STY-23, STY-31 | Facilitadora Minuta 2; custodia del esquema |
| Luisina Movio | Frontend, CRUDs, pagos, seeds, mobile, seguridad, notificaciones | STY-03, STY-10, STY-16, STY-17, STY-18, STY-19, STY-22, STY-24, STY-25, STY-26, STY-28, STY-29 | Facilitadora Minutas 3 y 4; QA funcional |

### 3.6. Trazabilidad y evidencia de participación

El repositorio registra **271 commits** en `main` al 26/10/2026. Los contadores incluyen alias de autor utilizados por los integrantes:

| Integrante | Commits | Participación aproximada |
|---|---|---|
| Luisina Movio (`LuliMovio` + `Luli`) | 175 | 64,6 % |
| Felicitas Di Pentima (`Felicitas26` + `Maria Felicitas Di Pentima`) | 48 | 17,7 % |
| Nadia Berrino (`NadiaBerrino` + `Nadia Berrino`) | 48 | 17,7 % |

Ejemplos de commits usados como evidencia:

- `completé funcionalidades del CUU realizar reserva`
- `payment backend` / `payment incorporado al CUU`
- `Estos cambios deberían permitir q los seeds se ejecuten automáticamente y la BD se cree tmb en automático`
- `Unifico paginas de gestion al estandar admin y tablas a ancho completo`
- `manejo centralizado de errores y validacion en backend; componentes con input/output en landing`
- `protección d los accesos`
- `filtrado para reservas y contratos de clientes`
- `mejoré notificaciones, se pueden borrar`
- `document. api back`
- `proposal`

### 3.7. Deuda técnica e ítems abiertos

| ID | Ítem | Tipo | Responsable | Prioridad | Estado |
|---|---|---|---|---|---|
| STY-36 | Un test automatizado por integrante | Test | Equipo | Alta | Pendiente |
| STY-37 | Test de integración del flujo reserva → contrato → pago | Test | Nadia Berrino | Alta | Pendiente |
| STY-38 | Test unitario de componente React | Test | Luisina Movio | Media | Pendiente |
| STY-39 | Test end-to-end del login y la reserva | Test | Felicitas Di Pentima | Media | Pendiente |
| STY-40 | Build de producción del frontend (`npm run build`) | QA | Luisina Movio | Media | Pendiente |
| STY-41 | README final con instalación y credenciales | Documentación | Felicitas Di Pentima | Alta | Pendiente |
| STY-42 | Video demostrativo y guion de defensa | Documentación | Equipo | Alta | Pendiente |
| STY-43 | Verificación final de Swagger y variables de entorno | Documentación | Nadia Berrino | Media | Pendiente |

---

## 4. Estado final y conclusiones

Al cierre del período documentado, Stylo cuenta con:

- Backend en Node.js/Express con arquitectura por capas, autenticación JWT, dos niveles de acceso y manejo centralizado de errores.
- Base de datos MySQL modelada con Prisma, script SQL de referencia y seeds reproducibles.
- Frontend en React + Vite con servicios centralizados, modelos de dominio, enfoque mobile first y rutas protegidas.
- Caso de uso completo de reserva, contrato y pago, con notificaciones y filtros por cliente.
- Documentación de la API con OpenAPI 3.0 y Swagger UI.
- Gestión del proyecto con Scrum + XP, minutas por corte, matriz de seguimiento en planilla de cálculo y trazabilidad por commits.

**Principales aprendizajes del equipo:**

1. La automatización del entorno (setup + seeds) redujo el retrabajo y mejoró la incorporación de cambios.
2. La integración temprana entre frontend y backend permitió detectar incompatibilidades de datos antes del cierre.
3. La revisión cruzada y la propiedad colectiva del código sostuvieron la calidad pese a la rotación de tareas.
4. La deuda de pruebas automatizadas debe planificarse desde el inicio y no al final del proyecto.

**Próximo paso inmediato:** completar la deuda técnica de pruebas y documentación (sección 3.7) antes de la entrega final y la defensa.

---

## 5. Anexos

### 5.1. Glosario

| Término | Definición |
|---|---|
| Sprint / Corte | Período de trabajo con un objetivo y un incremento entregable |
| DoD | Definición de terminado acordada por el equipo |
| CUU | Caso de uso de usuario |
| ORM | Mapeador objeto-relacional (Prisma en este proyecto) |
| Seed | Script que carga datos iniciales en la base de datos |
| Mobile first | Estrategia de diseño que parte de la pantalla móvil y escala a mayores resoluciones |
| RBAC | Control de acceso basado en roles (`administrador` / `cliente`) |

### 5.2. Control de versiones del documento

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 26/10/2026 | Creación del documento con las cuatro minutas, el marco de gestión y el trackeo consolidado | Equipo Stylo |

### 5.3. Documentos relacionados

- `README.md` — objetivos, requisitos y alcance de la cátedra.
- `Proposal.md` — propuesta funcional y alcance del sistema.
- `INSTALL.md` — instalación, configuración y ejecución.
- `Backend/src/docs/openapi.js` — especificación OpenAPI de la API.
- Swagger UI: `http://localhost:3000/api-docs`.
