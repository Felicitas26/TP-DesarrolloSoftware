# Propuesta TP DSW

## Grupo
### Integrantes
* 55372 - Berrino, Nadia Belén
* 54345 - Movio, Luisina
* 53722 - Di Pentima, María Felicitas

### Repositorios
* [Frontend](https://github.com/Felicitas26/Frontend)
* [Backend](https://github.com/Felicitas26/Backend)

## Tema
### Descripción
El proyecto es un sistema de reservación de salones de fiesta para eventos, donde los clientes pueden registrarse, iniciar sesión, completar un formulario de solicitud y hacer un seguimiento del mismo. Una vez aceptado, 
el cliente accede al contrato y debe firmarlo para continuar con el pago.Desde el lado del administrador,el sistema permitirá llevar un seguimiento de los eventos programados, aceptar o rechazar solicitudes y gestionar actualizaciones con respecto a pagos y/o cancelaciones. 

### Modelo
<img width="496" height="544" alt="image" src="https://github.com/user-attachments/assets/d4001c91-0f5f-43e7-8bd5-e8ffc46d5f2d" />



## Alcance Funcional 

### Alcance Mínimo
|Req|Detalle|
|:-|:-|
|CRUD simple |1. CRUD Cliente<br>2. CRUD Salón<br>3. CRUD Ubicación|
|CRUD dependiente |1. CRUD Reserva (depende de) CRUD Cliente<br>2. CRUD TipoSalón (depende de) CRUD Salón|
|Listado<br>+<br>detalle |1. Listado de salones filtrado por tipo de salón o nombre, muestra nombre, cantidad mínima y máxima de invitados ⇒ detalle CRUD Salón<br>2. Listado de reservas filtrado por cliente, muestra id  de reserva, fecha, cantidad invitados y estado de reserva ⇒ detalle muestra datos completos de la reserva y servicios incluidos| 
|CUU/Epic|1. Realizar reserva de salón para un evento<br>2. Visualizar agenda de eventos|



Adicionales
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Salón<br>3. CRUD Ubicación<br>4. CRUD tipoSalon<br>5. CRUD Precio<br>6. CRUD Reserva<br>7. Contrato<br>8. DetalleTarjeta<br>9. ServicioExtra|
|CUU/Epic|1. Realizar una reserva de un salón<br>2. Modificar contrato de salón<br>3. Realizar pago de seña del evento|
