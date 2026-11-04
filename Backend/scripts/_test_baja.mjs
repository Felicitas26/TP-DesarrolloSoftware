// Test bajas logicas: usa la API local como lo haria el front.
const BASE = "http://localhost:3000";

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

const log = (label, r) =>
    console.log(`${label}: [${r.status}] ${typeof r.data === "object" ? JSON.stringify(r.data).slice(0, 220) : r.data}`);

// 1) login admin
const admin = await req("/api/auth/login", "POST", { username: "admin", password: "admin123" });
log("1. login admin", { status: admin.status, data: { rol: admin.data?.rol } });

// 2) alta cliente
const client = await req("/api/client", "POST", {
    nameCli: "Test", surnameCli: "BajaLogica", phoneCli: "3415550000",
    dniCli: 41234567, emailCli: "test.baja@stylo.com",
    addressCli: "Calle 1", idLocation: 1
}, admin.data.token);
log("2. alta cliente", client);

// 3) login cliente (password temporal = DNI)
const cliLogin = await req("/api/auth/login", "POST", {
    username: "test.baja@stylo.com", password: "41234567"
});
log("3. login cliente", { status: cliLogin.status, data: { idCli: cliLogin.data?.idCli } });

// 4) reserva sobre lounge 2
const reservation = await req("/api/reservation", "POST", {
    dateEvent: "2099-06-15", eventType: "cumpleanos", cantInvit: 10,
    status: "pendiente", idLounge: 2, idLoungeType: 3, idCardDetail: null
}, cliLogin.data.token);
log("4. reserva creada", reservation);

// 5) DELETE lounge 2 con reservas -> baja logica permitida
const delLounge = await req("/api/lounge/2", "DELETE", null, admin.data.token);
log("5. DELETE lounge 2 (con reservas)", delLounge);

// 6) listado de lounges ya no lo incluye
const lounges = await req("/api/lounge", "GET", null, admin.data.token);
console.log("6. lounges visibles:", lounges.data?.map(l => l.idLounge).join(", "));

// 7) historial: la reserva sigue referenciando el lounge dado de baja
const reservations = await req("/api/reservation", "GET", null, admin.data.token);
const r = (reservations.data || []).find(x => x.client?.dniCli === 41234567);
console.log("7. historial de la reserva:", r ? `idLounge=${r.lounge.idLounge} nombre='${r.lounge.name}' status=${r.status}` : "NO ENCONTRADA");

// 8) DELETE cliente (dado de baja + su cuenta)
const delClient = await req(`/api/client/${client.data.idCli}`, "DELETE", null, admin.data.token);
log("8. DELETE cliente", delClient);

// 9) login del cliente de baja -> 401
const banned = await req("/api/auth/login", "POST", {
    username: "test.baja@stylo.com", password: "41234567"
});
log("9. login cuenta de baja", banned);

// 10) re-registro mismo DNI -> reactivacion
const react = await req("/api/client", "POST", {
    nameCli: "Test2", surnameCli: "BajaLogica", phoneCli: "3415550001",
    dniCli: 41234567, emailCli: "test.baja@stylo.com",
    addressCli: "Calle 2", idLocation: 1
}, admin.data.token);
log("10. re-registro mismo DNI", { status: react.status, data: react.data?.token ? "TOKEN" : react.data });

// 11) login de la cuenta reactivada account
const relog = await req("/api/auth/login", "POST", {
    username: "test.baja@stylo.com", password: "41234567"
});
log("11. login cuenta reactivada", { status: relog.status, data: { idCli: relog.data?.idCli } });

// 12) reserva sobre lounge dado de baja (listado oculto, API directa -> viable?)
const resInactive = await req("/api/reservation", "POST", {
    dateEvent: "2099-06-16", eventType: "casamiento", cantInvit: 5,
    idLounge: 2, idLoungeType: 3, idCardDetail: null
}, relog.data?.token || cliLogin.data.token);
log("12. reserva sobre lounge de baja", resInactive);
