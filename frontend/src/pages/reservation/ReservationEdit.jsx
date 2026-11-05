import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    reservationService,
    loungeService,
    loungeTypeService,
    clientService
} from "../../services";
import FeedbackModal from "../../components/FeedbackModal";
import "./ReservationEdit.css";

const initialReservation = {
    dateEvent: "",
    status: "",
    cantInvit: "",
    maxCantInvit: "",
    idCli: "",
    idLounge: "",
    idLoungeType: ""
};

const STATUS_LABELS = {
    pendiente: "Pendiente",
    aceptada: "Aceptada",
    confirmada: "Confirmada",
    cancelada: "Cancelada"
};

function ReservationEdit() {

    const { id } = useParams();

    const [reservations, setReservations] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    const [reservation, setReservation] = useState(initialReservation);
    const [savedStatus, setSavedStatus] = useState("");

    const [lounges, setLounges] = useState([]);
    const [loungeTypes, setLoungeTypes] = useState([]);
    const [clients, setClients] = useState([]);

    // Datos de las entidades actuales, para poder mostrarlas aunque hayan
    // sido dadas de baja (el listado de catálogo solo trae activas).
    const [currentLounge, setCurrentLounge] = useState(null);
    const [currentType, setCurrentType] = useState(null);
    const [currentClient, setCurrentClient] = useState(null);

    const [feedback, setFeedback] = useState(null);

    // El backend exige un motivo para que el cliente sepa por qué se canceló.
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteMotivo, setDeleteMotivo] = useState("");

    const getReservations = async () => {

        try {
            const data = await reservationService.getAll();

            setReservations(data);

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const loadReservation = async (reservationId) => {

        if (!reservationId) {
            setSelectedId("");
            setReservation(initialReservation);
            setSavedStatus("");
            setCurrentLounge(null);
            setCurrentType(null);
            setCurrentClient(null);
            return;
        }

        try {
            const data = await reservationService.getById(reservationId);

            setSelectedId(String(reservationId));

            setReservation({
                dateEvent: data.dateEvent
                    ? data.dateEvent.split("T")[0]
                    : "",
                status: data.status || "",
                cantInvit: data.cantInvit ?? "",
                maxCantInvit: data.maxCantInvit ?? data.cantInvit ?? "",
                idCli: data.idCli ? String(data.idCli) : "",
                idLounge: data.idLounge ? String(data.idLounge) : "",
                idLoungeType: data.idLoungeType
                    ? String(data.idLoungeType)
                    : ""
            });

            setSavedStatus(data.status || "");

            setCurrentLounge(data.lounge || null);
            setCurrentType(data.loungeType || null);
            setCurrentClient(data.client || null);

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    useEffect(() => {

        const getCatalog = async () => {

            try {
                const [loungesData, typesData, clientsData] =
                    await Promise.all([
                        loungeService.getAll(),
                        loungeTypeService.getAll(),
                        clientService.getAll()
                    ]);

                setLounges(loungesData);
                setLoungeTypes(typesData);
                setClients(clientsData);

            } catch (error) {
                console.error("Error al obtener el catálogo:", error);
                setFeedback({ type: "error", title: "Error", message: error.message });
            }
        };

        getReservations();
        getCatalog();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (id) loadReservation(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSelect = (e) => {

        const value = e.target.value;

        if (!value) {
            loadReservation("");
            return;
        }

        loadReservation(value);
    };

    const handleChange = (e) => {

        setReservation({
            ...reservation,
            [e.target.name]: e.target.value
        });
    };

    const loungeOptions = [...lounges];

    if (
        reservation.idLounge &&
        !lounges.some(
            (lounge) => String(lounge.idLounge) === String(reservation.idLounge)
        )
    ) {
        loungeOptions.push({
            idLounge: Number(reservation.idLounge),
            name: currentLounge?.name || `Salón #${reservation.idLounge}`,
            loungeAddress: currentLounge?.loungeAddress || "",
            inactivo: true
        });
    }

    const typeOptions = loungeTypes.filter(
        (type) => String(type.idLounge) === String(reservation.idLounge)
    );

    if (
        reservation.idLoungeType &&
        !typeOptions.some(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        )
    ) {
        typeOptions.push({
            idLoungeType: Number(reservation.idLoungeType),
            nameLoungeType:
                currentType?.nameLoungeType ||
                `Capacidad #${reservation.idLoungeType}`,
            minQuantity: currentType?.minQuantity ?? reservation.cantInvit,
            maxQuantity: currentType?.maxQuantity ?? reservation.maxCantInvit,
            idLounge: Number(reservation.idLounge),
            inactivo: true
        });
    }

    const handleLoungeChange = (idLounge) => {

        const activeTypes = loungeTypes.filter(
            (type) => String(type.idLounge) === String(idLounge)
        );

        // Cascada: si el salón tiene una única capacidad, se selecciona sola.
        const onlyType = activeTypes.length === 1 ? activeTypes[0] : null;

        setReservation((prev) => ({
            ...prev,
            idLounge: String(idLounge),
            idLoungeType: onlyType ? String(onlyType.idLoungeType) : "",
            cantInvit: onlyType ? String(onlyType.minQuantity) : "",
            maxCantInvit: onlyType ? String(onlyType.maxQuantity) : ""
        }));
    };

    const handleTypeChange = (idLoungeType) => {

        const selected = typeOptions.find(
            (type) => String(type.idLoungeType) === String(idLoungeType)
        );

        setReservation((prev) => ({
            ...prev,
            idLoungeType: String(idLoungeType),
            cantInvit: selected ? String(selected.minQuantity) : "",
            maxCantInvit: selected ? String(selected.maxQuantity) : ""
        }));
    };

    const saveChanges = async () => {

        setFeedback(null);

        const selectedType = typeOptions.find(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        );

        if (!selectedType) return;

        try {
            await reservationService.update(selectedId, {
                dateEvent: reservation.dateEvent,
                status: reservation.status,
                cantInvit: Number(selectedType.minQuantity),
                maxCantInvit: Number(selectedType.maxQuantity),
                idCli: Number(reservation.idCli),
                idLounge: Number(reservation.idLounge),
                idLoungeType: Number(reservation.idLoungeType)
            });

            setFeedback({ type: "success", title: "Reserva actualizada", message: "La reserva se actualizó correctamente." });

            await getReservations();
            await loadReservation(selectedId);

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const handleUpdate = (e) => {

        e.preventDefault();

        const selectedType = typeOptions.find(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        );

        if (!reservation.idCli || !reservation.idLounge || !selectedType) {
            setFeedback({
                type: "error",
                title: "Datos incompletos",
                message: "Seleccioná el cliente, el salón y la capacidad del salón."
            });
            return;
        }

        if (reservation.status !== savedStatus) {
            const estadoAnterior = STATUS_LABELS[savedStatus] || "sin estado";
            const estadoNuevo = STATUS_LABELS[reservation.status] || "sin estado";
            const avisoCancelada = reservation.status === "cancelada"
                ? " La reserva quedará cancelada y no se puede deshacer. Para avisarle al cliente, usá la opción Eliminar reserva con motivo."
                : "";

            setFeedback({
                type: "confirm",
                title: "Cambiar estado de la reserva",
                message: `¿Confirmás que querés cambiar el estado de la reserva de "${estadoAnterior}" a "${estadoNuevo}"?${avisoCancelada}`,
                confirmLabel: "Sí, guardar",
                onConfirm: saveChanges,
                onCancel: () => setFeedback(null)
            });
            return;
        }

        saveChanges();
    };

    const handleDeleteClick = () => {
        setDeleteMotivo("");
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {

        const motivo = deleteMotivo.trim();

        if (!motivo) {
            setFeedback({
                type: "error",
                title: "Falta el motivo",
                message: "Indicá el motivo de la eliminación para avisarle al cliente."
            });
            return;
        }

        try {
            await reservationService.remove(selectedId, { motivo });

            setDeleteOpen(false);
            setDeleteMotivo("");

            setFeedback({ type: "success", title: "Reserva eliminada", message: "La reserva se eliminó correctamente." });

            setSelectedId("");
            setReservation(initialReservation);
            setCurrentLounge(null);
            setCurrentType(null);
            setCurrentClient(null);

            await getReservations();

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const selectedClient = clients.find(
        (client) => String(client.idCli) === String(reservation.idCli)
    );

    const clientFallbackName = currentClient
        ? `${currentClient.nameCli || ""} ${currentClient.surnameCli || ""}`.trim()
        : "";

    return (
        <div className="reservation-edit-container">

            <h1>Editar reserva</h1>
            <p>Seleccioná la reserva que querés modificar.</p>

            <div className="reservation-edit-field">

                <label>Reserva</label>

                <select
                    value={selectedId}
                    onChange={handleSelect}
                >
                    <option value="">
                        Seleccionar reserva
                    </option>

                    {reservations.map((item) => (

                        <option
                            key={item.idReservation}
                            value={item.idReservation}
                        >
                            Reserva #{item.idReservation}
                            {item.client
                                ? ` — ${item.client.nameCli} ${item.client.surnameCli}`
                                : ""}
                            {item.dateEvent
                                ? ` (${new Date(item.dateEvent).toLocaleDateString("es-AR")})`
                                : ""}
                        </option>

                    ))}

                </select>

            </div>

            {selectedId && (

                <form onSubmit={handleUpdate}>

                    <div className="reservation-edit-field">

                        <label>Fecha del evento</label>

                        <input
                            type="date"
                            name="dateEvent"
                            value={reservation.dateEvent}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="reservation-edit-field">

                        <label>Estado</label>

                        <select
                            name="status"
                            value={reservation.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccionar estado
                            </option>

                            <option value="pendiente">
                                Pendiente
                            </option>

                            <option value="aceptada">
                                Aceptada
                            </option>

                            <option value="confirmada">
                                Confirmada
                            </option>

                            <option value="cancelada">
                                Cancelada
                            </option>

                        </select>

                    </div>

                    <div className="reservation-edit-field">

                        <label>Cliente</label>

                        <select
                            name="idCli"
                            value={reservation.idCli}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Seleccionar cliente
                            </option>

                            {clients.map((client) => (

                                <option
                                    key={client.idCli}
                                    value={client.idCli}
                                >
                                    {client.nameCli} {client.surnameCli}
                                    {client.dniCli ? ` — DNI ${client.dniCli}` : ""}
                                </option>

                            ))}

                            {reservation.idCli && !selectedClient && (
                                <option value={reservation.idCli} disabled>
                                    {clientFallbackName || `Cliente #${reservation.idCli}`}
                                    {" — dado de baja"}
                                </option>
                            )}

                        </select>

                    </div>

                    <div className="reservation-edit-field">

                        <label>Salón</label>

                        <select
                            name="idLounge"
                            value={reservation.idLounge}
                            onChange={(e) => handleLoungeChange(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Seleccionar salón
                            </option>

                            {loungeOptions.map((lounge) => (

                                <option
                                    key={lounge.idLounge}
                                    value={lounge.idLounge}
                                    disabled={lounge.inactivo}
                                >
                                    {lounge.name}
                                    {lounge.loungeAddress
                                        ? ` — ${lounge.loungeAddress}`
                                        : ""}
                                    {lounge.inactivo ? " — dado de baja" : ""}
                                </option>

                            ))}

                        </select>

                        {reservation.idLounge && typeOptions.length === 0 && (
                            <small className="reservation-edit-hint">
                                Este salón no tiene capacidades cargadas.
                            </small>
                        )}

                    </div>

                    <div className="reservation-edit-field">

                        <label>Capacidad del salón</label>

                        <select
                            name="idLoungeType"
                            value={reservation.idLoungeType}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            disabled={!reservation.idLounge || typeOptions.length === 0}
                            required
                        >
                            <option value="" disabled>
                                {!reservation.idLounge
                                    ? "Primero seleccioná un salón"
                                    : typeOptions.length === 0
                                        ? "Sin capacidades cargadas"
                                        : "Seleccionar capacidad"}
                            </option>

                            {typeOptions.map((type) => (

                                <option
                                    key={type.idLoungeType}
                                    value={type.idLoungeType}
                                    disabled={type.inactivo}
                                >
                                    {type.nameLoungeType}
                                    {` — ${type.minQuantity} a ${type.maxQuantity} invitados`}
                                    {type.inactivo ? " (dada de baja)" : ""}
                                </option>

                            ))}

                        </select>

                        {reservation.idLoungeType && (
                            <small className="reservation-edit-hint">
                                La capacidad se define con el salón: no hace falta
                                cargar invitados a mano.
                            </small>
                        )}

                    </div>

                    <div className="reservation-edit-buttons">

                        <button
                            type="submit"
                            className="reservation-update-button"
                        >
                            Guardar cambios
                        </button>

                        <button
                            type="button"
                            className="reservation-delete-button"
                            onClick={handleDeleteClick}
                        >
                            Eliminar reserva
                        </button>

                    </div>

                </form>

            )}

            {deleteOpen && (
                <div className="reservation-edit-modal-backdrop">
                    <div className="reservation-edit-modal">
                        <h2>Eliminar reserva</h2>
                        <p>
                            La reserva se marcará como cancelada y se le avisará
                            al cliente. Indicá el motivo:
                        </p>

                        <textarea
                            value={deleteMotivo}
                            onChange={(e) => setDeleteMotivo(e.target.value)}
                            rows={3}
                            placeholder="Motivo de la eliminación"
                        />

                        <div className="reservation-edit-modal-actions">
                            <button
                                type="button"
                                className="reservation-edit-modal-cancel"
                                onClick={() => setDeleteOpen(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="reservation-edit-modal-confirm"
                                onClick={handleDeleteConfirm}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {feedback && (
                <FeedbackModal
                    type={feedback.type}
                    title={feedback.title}
                    message={feedback.message}
                    onClose={() => setFeedback(null)}
                    onConfirm={feedback.onConfirm}
                    confirmLabel={feedback.confirmLabel}
                    cancelLabel="Cancelar"
                    onCancel={feedback.onCancel}
                />
            )}

        </div>
    );
}

export default ReservationEdit;
