# Propuesta TP DSW

## Grupo
### Integrantes
* 55372 - Berrino, Nadia Belén
* 54345 - Movio, Luisina
* 53722 - Di Pentima, María Felicitas

## Tema
### Descripción
El proyecto es un sistema de reservación de salones de fiesta para eventos, donde los clientes pueden registrarse, iniciar sesión, completar un formulario de solicitud y hacer un seguimiento del mismo. Una vez aceptado, 
el cliente accede al contrato y debe firmarlo para continuar con el pago.Desde el lado del administrador,el sistema permitirá llevar un seguimiento de los eventos programados, aceptar o rechazar solicitudes y gestionar actualizaciones con respecto a pagos y/o cancelaciones. 

### Modelo

<img width="1082" height="790" alt="image" src="https://github.com/user-attachments/assets/68bf0eac-ab47-4317-a152-1fd00bf7f451" />





## Alcance Funcional 

### Alcance Mínimo
|Req|Detalle|
|:-|:-|
|CRUD simple |1. CRUD Client<br>2. CRUD Lounge<br>3. CRUD Location|
|CRUD dependiente |1. CRUD Reservation (depende de) CRUD Client + CRUD Lounge<br>2. CRUD LoungeType (depende de) CRUD Lounge|
|Listado<br>+<br>detalle |1. Listado de salones filtrado por id de salón, muestra nombre, dirección, localidad ⇒ detalle muestra datos completos de tipos de salón<br>2. Listado de reservas filtrado por cliente, muestra id  de reserva, fecha de reserva, fecha de evento, tipo de evento, cantidad invitados, estado de reserva, salon, tipo de salon⇒ detalle muestra datos completos del cliente| 
|CUU/Epic|1. Realizar reserva de salón para un evento<br>2. Aprobación / Rechazo de una reserva|



Adicionales
|Req|Detalle|
|:-|:-|
|CRUD simple |1. CRUD Client<br>2. CRUD Lounge<br>3. CRUD Location<br>4. CardDetail<br>5. ExtraService|
|CRUD dependiente |1. CRUD Reservation (depende de) CRUD Client + CRUD Lounge<br>2. CRUD LoungeType (depende de) CRUD Lounge<br>3. CRUD Contract (depende de) CRUD Reservation<br>4. CRUD Payment (depende de) CRUD Contract<br>5. CRUD Price (depende de) CRUD LoungeType|
|CUU/Epic|1. Realizar reserva de salón para un evento<br>2. Aprobación / Rechazo de una reserva<br>3. Generación y envío del contrato|

### Alcance Adicional Voluntario
|Req|Detalle|
|:-|:-|
|Listados |1. Listado de clientes, muestra nombre y apellido, dni, telèfono, email ⇒ detalle muestra datos completos del cliente<br>2. Listado de contratos filtra por estado del contrato, muestra id, nombre y apellido del cliente, fecha de evento, cantidad de invitados estimada, valor final, estado ⇒ detalle muestra datos completos del contrato, precios y pagos<br>3. Listado de servicios extras muestra nombre, detalle, costo ⇒ detalle muestra datos del servicio<br>3. Listado de menues muestra imagen, nombre, detalle, presupuesto ⇒ detalle muestra descripciòn detallada del plato<br>3. Listado de precios de tipos de salones muestra nombre del tipo de salòn, fecha de vigencia desde, feche de vigencia hasta, valor ⇒ detalle muestra datos completos de los precios|
|CUU/Epic|1. Anular contrato vigente<br>2. Modificar contrato de salón<br>3. Registrar pago del evento<br>4. Alta/Baja/Edición de menues<br>5. Alta/Baja/Edición de servicios extra|
|Otros |1. Envío de notificaciones sobre novedades de la reserva| 

