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

<img width="641" height="800" alt="MD - Desarrollo drawio (1)" src="https://github.com/user-attachments/assets/0ef8a672-7595-4a84-925e-77c9815e2792" />




## Alcance Funcional 

### Alcance Mínimo
|Req|Detalle|
|:-|:-|
|CRUD simple |1. CRUD Client<br>2. CRUD LoungeType<br>3. CRUD Location|
|CRUD dependiente |1. CRUD Reservation (depende de) CRUD Client<br>2. CRUD Lounge(depende de) CRUD LoungeType|
|Listado<br>+<br>detalle |1. Listado de salones filtrado por tipo de salón o nombre, muestra nombre, cantidad mínima y máxima de invitados ⇒ detalle CRUD Lounge<br>2. Listado de reservas filtrado por cliente, muestra id  de reserva, fecha, cantidad invitados y estado de reserva ⇒ detalle muestra datos completos de la reserva, del cliente y servicios incluidos| 
|CUU/Epic|1. Realizar reserva de salón para un evento<br>2. Aprobación / Rechazo de una reserva<br>3. Generación y envío del contrato.|



Adicionales
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Client<br>2. CRUD LoungeType<br>3. CRUD Location<br>4. CRUD Lounge<br>5. CRUD Price<br>6. CRUD Reservation<br>7. Contract<br>8. CardDetail<br>9. ExtraService|
|CUU/Epic|1. Anular contrato vigente<br>2. Modificar contrato de salón<br>3. Realizar pago de seña del evento|
