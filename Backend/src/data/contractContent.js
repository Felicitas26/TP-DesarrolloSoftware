export const CLAUSULAS = [
    {
        title: "1. OBJETO",
        text: "El presente contrato regula la prestación del servicio de alquiler del salón de eventos y servicios conexos por parte de SALON STYLO en favor del CLIENTE, para la realización del evento detallado en la reserva."
    },
    {
        title: "2. PRECIO Y SEÑA",
        text: "El precio total del servicio es el detallado en el apartado de 'Desglose de precios' del presente contrato. El CLIENTE abonará una seña equivalente al porcentaje estipulado por SALON STYLO a la firma de este contrato, y el saldo restante conforme a las condiciones de pago acordadas. El monto de la seña será imputado al precio final."
    },
    {
        title: "3. HORARIOS",
        text: "El evento se desarrollará en el horario indicado en el presente contrato. El CLIENTE se compromete a respetar los horarios de ingreso y egreso acordados, así como los tiempos de montaje y desmontaje fijados por SALON STYLO."
    },
    {
        title: "4. CANTIDAD DE INVITADOS",
        text: "La cantidad exacta de invitados queda fijada en el presente contrato y deberá encontrarse dentro del rango de cantidades prestablecidas en la reserva. El precio del servicio puede variar en función de la cantidad de invitados informada."
    },
    {
        title: "5. OBLIGACIONES DEL CLIENTE",
        text: "El CLIENTE deberá concurrir en tiempo y forma, respetar las normas del establecimiento, no introducir elementos dañinos ni realizar modificaciones no autorizadas. Todo servicio extra solicitado deberá ser abonado según su valor."
    },
    {
        title: "6. DAÑOS Y RESPONSABILIDAD",
        text: "El CLIENTE será responsable por los daños ocasionados en las instalaciones, mobiliario y/o equipamiento durante el evento. SALON STYLO no se responsabiliza por objetos personales dejados en las instalaciones."
    },
    {
        title: "7. CANCELACIÓN Y RESOLUCIÓN",
        text: "En caso de cancelación, se aplicarán las penalidades establecidas por SALON STYLO. SALON STYLO podrá resolver el contrato si el CLIENTE incumple las obligaciones establecidas, sin perjuicio de las acciones legales correspondientes."
    },
    {
        title: "8. JURISDICCIÓN",
        text: "Las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad donde se encuentra el salón, renunciando a cualquier otro fuero que pudiera corresponder."
    }
];

export const TERMINOS = [
    "El presente contrato constituye el acuerdo definitivo entre el CLIENTE y SALON STYLO para la realización del evento detallado en la reserva.",
    "Al aceptar, el CLIENTE se compromete al cumplimiento de todas las cláusulas del contrato, incluidas las condiciones de pago, los horarios y la cantidad de invitados informada.",
    "La cantidad exacta de invitados y los valores asociados quedan fijados según el desglose de precios del contrato.",
    "La seña abonada será imputada al precio final y la cancelación del evento queda sujeta a las penalidades de la cláusula de cancelación.",
    "El CLIENTE se compromete a respetar las normas del establecimiento y a responder por los daños ocasionados durante el evento.",
    "SALON STYLO no se responsabiliza por los objetos personales dejados en las instalaciones.",
    "Cualquier modificación posterior a la firma debe solicitarse hasta 2 semanas antes del evento y queda sujeta a la aprobación del administrador."
];

export const DEFAULT_CONTRACT_CONTENT = {
    clausulas: CLAUSULAS,
    terminos: TERMINOS
};

export default DEFAULT_CONTRACT_CONTENT;