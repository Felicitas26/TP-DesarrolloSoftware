# Tracking de features, bugs e issues

Estado del proyecto al 26/10/2026. Los estados se basan en la revisión del código presente en el repositorio y deben actualizarse cuando se incorporen nuevos cambios o evidencias.

## Estados

- **Completado:** implementado y verificado en el código.
- **En progreso:** parcialmente implementado o pendiente de validación.
- **Pendiente:** todavía no implementado.
- **Bloqueado:** requiere una decisión, recurso o información externa.

## Features

| ID   | Feature             | Estado     | Prioridad | Responsable | Evidencia                                                                                                                                                                                                                                                       |
| ---- | ------------------- | ---------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-01 | Clientes (CRUD)     | Completado | Alta      | Equipo      | Backend/src/controllers/client.controller.js, Backend/src/routes/client.routes.js, frontend/src/pages/clientes/clientList.jsx, frontend/src/pages/clientes/newClient.jsx, frontend/src/pages/clientes/editClient.jsx, frontend/src/pages/clientes/MyProfile.jsx |
| F-02 | Lounge (CRUD)       | Completado | Alta      | Equipo      | Backend/src/controllers/lounge.controller.js, Backend/src/routes/lounge.routes.js                                                                                                                                                                               |
| F-03 | LoungeType (CRUD)   | Completado | Alta      | Equipo      | Backend/src/controllers/loungeType.controller.js, Backend/src/routes/loungeType.routes.js                                                                                                                                                                       |
| F-04 | Payment (CRUD)      | Completado | Alta      | Equipo      | Backend/src/controllers/payment.controller.js, Backend/src/routes/payment.routes.js                                                                                                                                                                             |
| F-05 | Price (CRUD)        | Completado | Alta      | Equipo      | Backend/src/controllers/price.controller.js, Backend/src/routes/price.routes.js. Frontend: pendiente de implementación (frontend/src/pages/price/ existente sin vistas CRUD completas según matriz).                                                            |
| F-06 | Reservation (CRUD)  | Completado | Alta      | Equipo      | Backend/src/controllers/reservation.controller.js, Backend/src/routes/reservation.routes.js, frontend/src/pages/reservation/                                                                                                                                    |
| F-07 | Location (CRUD)     | Completado | Alta      | Equipo      | Backend/src/controllers/location.controller.js, Backend/src/routes/location.routes.js                                                                                                                                                                           |
| F-08 | Contract (CRUD)     | Completado | Alta      | Equipo      | Backend/src/controllers/contract.controller.js, Backend/src/routes/contract.routes.js, frontend/src/pages/contract/                                                                                                                                             |
| F-09 | ExtraService (CRUD) | Completado | Alta      | Equipo      | Backend/src/controllers/extraService.controller.js, Backend/src/routes/extraService.routes.js, frontend/src/pages/extraService/                                                                                                                                 |
| F-10 | CardDetail (CRUD)   | Completado | Alta      | Equipo      | Backend/src/controllers/cardDetail.controller.js, Backend/src/routes/cardDetail.routes.js, frontend/src/pages/cardDetail/                                                                                                                                       |

## Bugs corregidos

| ID    | Bug                                                                                           | Estado     | Prioridad | Solución o evidencia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----- | --------------------------------------------------------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BC-01 | Clave foránea / cardinalidad incorrecta en CardDetail para derivar datos a Reserva y Contrato | Completado | Alta      | Ajustado en SCRIPT SQL V3. Se corrigió la relación de CardDetail para asociarse correctamente with Reserva permitiendo derivar la información hacia Contrato. Se eliminó la asociación errónea que complicaba la recolección de datos y se corrigió la cardinalidad (ya no admitía 0 en la relación correspondiente). Evidencia: database/ (scripts SQL V1-V3) y lógica en Backend/src/controllers/cardDetail.controller.js, Backend/src/controllers/reservation.controller.js, Backend/src/controllers/contract.controller.js. |
| BC-02 | Relación muchos a muchos entre ExtraService y Contract no existente antes de corregir         | Completado | Alta      | Creación de tabla intermedia entre ExtraService y Contract para modelar correctamente la relación muchos a muchos. Evidencia: SCRIPT SQL V3 y modelos/rutas/controladores relacionados a extraService y contract.                                                                                                                                                                                                                                                                                                               |
| BC-03 | Ajustes de carga inicial de datos (Location/Salones)                                          | Completado | Media     | Incorporación de Location de Rosario y carga de dos salones with sus cantidades correspondientes. Evidencia: SCRIPT SQL V3.                                                                                                                                                                                                                                                                                                                                                                                                     |

## Bugs conocidos

| ID    | Bug o riesgo                                                       | Estado    | Prioridad | Impacto                                                                                                                     |
| ----- | ------------------------------------------------------------------ | --------- | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| BK-01 | Ausencia de tests unitarios/automatizados en el repositorio        | Pendiente | Alta      | Sin cobertura de pruebas. Riesgo de regresiones al agregar funcionalidades o corregir errores.                              |
| BK-02 | Validación de tokens JWT pendiente en ciertos endpoints auxiliares | Pendiente | Alta      | Posible exposición de endpoints auxiliares ante accesos no autenticados/autorizados. Requiere revisión por ruta/middleware. |

## Issues y tareas pendientes

| ID    | Issue                                                   | Estado    | Prioridad | Próximo paso                                                                                                                                                                      |
| ----- | ------------------------------------------------------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IP-01 | Incorporar tests con Jest/Supertest/Vitest              | Pendiente | Alta      | Definir stack de testing (evaluar uso en Backend/package.json), agregar configuración y tests iniciales para controladores/rutas críticos (Auth, Reservation, Contract, Payment). |
| IP-02 | Capturar evidencias responsive Mobile First en SM/MD/LG | Pendiente | Alta      | Realizar pruebas y capturas responsive Mobile First para vistas principales (Clientes, Reservation, Contract, Lounge). Registrar evidencias en docs/.                             |
| IP-03 | Completar vistas CRUD de Price en frontend              | Pendiente | Media     | Implementar crear/listar/editar para Price en frontend/src/pages/price/ acorde al patrón utilizado en el resto de módulos.                                                        |

## Historial de actualización

| Fecha      | Cambio                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| 13/10/2026 | Se crea el tracking inicial de features, bugs e issues.                                                                   |
| 26/10/2026 | Actualización basada en la matriz de seguimiento (Asignacion de tareas_DSW) y estructura de commits/scripts SQL de Stylo. |
