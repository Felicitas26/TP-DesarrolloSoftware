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
![dsw2](https://github.com/user-attachments/assets/27058b21-ed13-409d-8c8a-8d640d9f9215)


## Alcance Funcional 

### Alcance Mínimo
|Req|Detalle|
|:-|:-|
|CRUD simple |1. CRUD Cliente<br>2. CRUD Salón<br>3. CRUD Ubicación|
|CRUD dependiente |1. CRUD Reserva (depende de) CRUD Cliente<br>2. CRUD TipoSalón (depende de) CRUD Salón|
|Listado<br>+<br>detalle |1. Listado de salones filtrado por tipo de salón o nombre, muestra nombre, cantidad mínima y máxima de invitados ⇒ detalle CRUD Salón<br>2. Listado de reservas filtrado por cliente, muestra id  de reserva, fecha, cantidad invitados y estado de reserva ⇒ detalle muestra datos completos de la reserva y servicios incluidos| 
|CUU/Epic|1. Agregar productos al carrito y realizar una compra<br>2. Visualizar historial de compras|



Adicionales
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Reseñas de productos<br>2. CRUD Métodos de pago<br>3. CRUD Dirección de envío<br>4. CRUD Estado de pedido<br>5. CRUD Notificaciones<br>6. CRUD Carrito de compras|
|CUU/Epic|1. Calificar productos comprados<br>2. Modificar datos personales y dirección<br>3. Consultar estado de un pedido|
