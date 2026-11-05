// Prueba de integración local: cascada de capacidad, edición admin que
// conserva datos, contrato y bajas lógicas.
const BASE = "http://localhost:3000";

let failed = 0;

function check(label, condition, extra = "") {
    console.log(`${condition ? "OK  " : "FAIL"} ${label}${extra ? ` :: ${extra}` : ""}`);
    if (!condition) failed++;
}

async function req(path, method = "GET", body = null, token = null) {
    const res = await fetch(BASE + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    });
    let data = null;
    try { data = await res.json(); } catch {}
    return { status: res.status, data };
}

const admin = await req("/api/auth/login", "POST", { username: "admin", password: "admin123" });
check("login admin", admin.status === 200 && admin.data?.token);

const email = "integracion@stylo.com";
const dni = 42345678;

const client = await req("/api/client", "POST", {
    nameCli: "Integracion", surnameCli: "Test", phoneCli: "3415551111",
    dniCli: dni, emailCli: email, addressCli: "Calle 9", idLocation: 1
}, admin.data.token);
check("alta cliente", client.status === 201 || client.status === 200, JSON.stringify(client.data)?.slice(0, 160));

const cliLogin = await req("/api/auth/login", "POST", { username: email, password: String(dni) });
check("login cliente", cliLogin.status === 200 && cliLogin.data?.token);
const cliToken = cliLogin.data.token;

const lounges = (await req("/api/lounge", "GET", null, admin.data.token)).data;
const types = (await req("/api/loungeType", "GET", null, admin.data.token)).data;

const firstLounge = lounges.find(l => types.some(t => t.idLounge === l.idLounge));
const firstType = types.find(t => t.idLounge === firstLounge.idLounge);
const otherLounge = lounges.find(l => l.idLounge !== firstLounge.idLounge && types.some(t => t.idLounge === l.idLounge));
const otherType = types.find(t => t.idLounge === otherLounge.idLounge);

console.log(`\nSalón A: ${firstLounge.idLounge} ${firstLounge.name} / tipo ${firstType.idLoungeType} ${firstType.nameLoungeType} (${firstType.minQuantity}-${firstType.maxQuantity})`);
console.log(`Salón B: ${otherLounge.idLounge} ${otherLounge.name} / tipo ${otherType.idLoungeType} ${otherType.nameLoungeType} (${otherType.minQuantity}-${otherType.maxQuantity})\n`);

// 1) create ignora cantidades enviadas y deriva del tipo
const created = await req("/api/reservation", "POST", {
    dateEvent: "2099-07-10", eventType: "casamiento", status: "pendiente",
    cantInvit: 1, maxCantInvit: 2,
    idLounge: firstLounge.idLounge, idLoungeType: firstType.idLoungeType,
    idCardDetail: 1, idServices: [1, 2]
}, cliToken);
check("crear reserva", created.status === 201, JSON.stringify(created.data)?.slice(0, 160));
const resId = created.data?.idReservation;
check("capacidad derivada al crear", created.data?.cantInvit === firstType.minQuantity && created.data?.maxCantInvit === firstType.maxQuantity,
    `${created.data?.cantInvit}-${created.data?.maxCantInvit}`);

// 2) tipo que no pertenece al salón -> 400
const mismatch = await req("/api/reservation", "POST", {
    dateEvent: "2099-07-11", eventType: "cumpleanos", status: "pendiente",
    idLounge: firstLounge.idLounge, idLoungeType: otherType.idLoungeType,
    idCardDetail: null
}, cliToken);
check("rechaza tipo de otro salón", mismatch.status === 400, `${mismatch.status} ${mismatch.data?.error}`);

// 3) edición cliente: cambio de salón/tipo deriva capacidad nueva
const cliEdit = await req(`/api/reservation/${resId}`, "PUT", {
    dateEvent: "2099-07-10", eventType: "casamiento", status: "pendiente",
    cantInvit: 999, maxCantInvit: 999,
    idCli: client.data.idCli,
    idLounge: otherLounge.idLounge, idLoungeType: otherType.idLoungeType,
    idCardDetail: 1, idServices: [1, 2]
}, cliToken);
check("editar como cliente", cliEdit.status === 200, JSON.stringify(cliEdit.data)?.slice(0, 160));
check("capacidad derivada al editar", cliEdit.data?.reservation?.cantInvit === otherType.minQuantity && cliEdit.data?.reservation?.maxCantInvit === otherType.maxQuantity,
    `${cliEdit.data?.reservation?.cantInvit}-${cliEdit.data?.reservation?.maxCantInvit}`);

// 4) edición admin sin eventType/menú/extras (como el formulario nuevo)
const before = (await req(`/api/reservation/${resId}`, "GET", null, admin.data.token)).data;
const adminEdit = await req(`/api/reservation/${resId}`, "PUT", {
    dateEvent: before.dateEvent.split("T")[0], status: before.status,
    cantInvit: otherType.minQuantity, maxCantInvit: otherType.maxQuantity,
    idCli: Number(before.idCli),
    idLounge: otherLounge.idLounge, idLoungeType: otherType.idLoungeType
}, admin.data.token);
check("editar como admin", adminEdit.status === 200, JSON.stringify(adminEdit.data)?.slice(0, 160));
const after = (await req(`/api/reservation/${resId}`, "GET", null, admin.data.token)).data;
check("admin conserva tipo de evento", after.eventType === "casamiento", String(after.eventType));
check("admin conserva menú", Number(after.idCardDetail) === 1, String(after.idCardDetail));
check("admin conserva extras", (after.extraServices || []).length === 2, String(after.extraServices?.length));

// 5) aceptar reserva -> contrato con el rango del salón
const accept = await req(`/api/reservation/${resId}/status`, "PUT", { status: "aceptada" }, admin.data.token);
check("aceptar reserva", accept.status === 200 && accept.data?.contract, JSON.stringify(accept.data)?.slice(0, 200));
const contractId = accept.data?.contract?.idContract;
const contract = (await req(`/api/contract/${contractId}`, "GET", null, cliToken)).data;
check("contrato con rango del salón",
    contract?.reservation?.cantInvit === otherType.minQuantity &&
    contract?.reservation?.maxCantInvit === otherType.maxQuantity,
    `${contract?.reservation?.cantInvit}-${contract?.reservation?.maxCantInvit}`);
check("contrato generado", contract?.status === "generado", contract?.status);

// 6) contrato: cantidad exacta dentro del rango y edición conserva la reserva
const inRange = Math.min(otherType.maxQuantity, otherType.minQuantity + 3);
const contractEdit = await req(`/api/contract/${contractId}`, "PUT", {
    dateEvent: before.dateEvent.split("T")[0],
    eventType: "casamiento",
    cantExactaInvit: inRange,
    idCardDetail: 1,
    idServices: [1, 2]
}, cliToken);
check("guardar contrato con cantidad exacta", contractEdit.status === 200, JSON.stringify(contractEdit.data)?.slice(0, 200));
check("cantidad exacta guardada", contractEdit.data?.contract?.cantExactaInvit === inRange, String(contractEdit.data?.contract?.cantExactaInvit));
const afterContract = (await req(`/api/reservation/${resId}`, "GET", null, admin.data.token)).data;
check("contrato no pisa la capacidad", afterContract.cantInvit === otherType.minQuantity && afterContract.maxCantInvit === otherType.maxQuantity,
    `${afterContract.cantInvit}-${afterContract.maxCantInvit}`);
check("contrato no pisa tipo de evento", afterContract.eventType === "casamiento", String(afterContract.eventType));

const outOfRange = await req(`/api/contract/${contractId}`, "PUT", {
    cantExactaInvit: otherType.maxQuantity + 1
}, cliToken);
check("rechaza cantidad fuera de rango", outOfRange.status === 400, `${outOfRange.status} ${outOfRange.data?.error}`);

// 7) baja de salón/tipo: la reserva histórica sigue accesible, no se puede volver a reservar
const delLounge = await req(`/api/lounge/${otherLounge.idLounge}`, "DELETE", null, admin.data.token);
check("baja lógica salón", delLounge.status === 200, JSON.stringify(delLounge.data)?.slice(0, 120));

const loungesAfter = (await req("/api/lounge", "GET", null, admin.data.token)).data;
check("salón oculto del catálogo", !loungesAfter.some(l => l.idLounge === otherLounge.idLounge));

const hist = (await req(`/api/reservation/${resId}`, "GET", null, admin.data.token)).data;
check("historial conserva el salón dado de baja", hist.lounge?.name === otherLounge.name, hist.lounge?.name);

const blocked = await req("/api/reservation", "POST", {
    dateEvent: "2099-08-01", eventType: "cumpleanos", status: "pendiente",
    idLounge: otherLounge.idLounge, idLoungeType: otherType.idLoungeType,
    idCardDetail: null
}, cliToken);
check("rechaza reservar sobre salón de baja", blocked.status === 409, `${blocked.status} ${blocked.data?.error}`);

// 8) baja de tipo usada por la reserva: sigue visible en el historial
const typesAfter = (await req("/api/loungeType", "GET", null, admin.data.token)).data;
check("tipo del salón de baja oculto", !typesAfter.some(t => t.idLoungeType === otherType.idLoungeType));

console.log(`\n${failed === 0 ? "TODO OK" : `${failed} PRUEBAS FALLIDAS`}`);
process.exit(failed === 0 ? 0 : 1);
