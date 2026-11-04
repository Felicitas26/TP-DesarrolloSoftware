// Test de bajas logicas: resto de entidades (pago, contrato, tipo de salon,
// ubicacion, menu, extra, notificacion y administradores).
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
    console.log(`${label}: [${r.status}] ${typeof r.data === "object" ? JSON.stringify(r.data).slice(0, 200) : r.data}`);

const admin = await req("/api/auth/login", "POST", { username: "admin", password: "admin123" });
const A = admin.data.token;

// preparar contrato: aceptar la reserva 1 (crea contrato + pago pendiente)
const accept = await req("/api/reservation/1/status", "PUT", { status: "aceptada" }, A);
log("1. aceptar reserva 1 (genera contrato+pago)", { status: accept.status, data: { contract: accept.data?.contract?.idContract ?? accept.data?.idContract } });

// pago
const pays = await req("/api/payment", "GET", null, A);
console.log("2. pagos visibles:", pays.data?.map(p => p.idPayment).join(", "));
if (pays.data?.length) {
    const idPay = pays.data[0].idPayment;
    log(`3. DELETE pago ${idPay}`, await req(`/api/payment/${idPay}`, "DELETE", null, A));
    const pays2 = await req("/api/payment", "GET", null, A);
    console.log("4. pagos tras baja:", JSON.stringify(pays2.data?.map(p => p.idPayment) ?? []));
}

// contrato
const contracts = await req("/api/contract", "GET", null, A);
console.log("5. contratos visibles:", contracts.data?.map(c => c.idContract).join(", "));
if (contracts.data?.length) {
    const idC = contracts.data[0].idContract;
    log(`6. DELETE contrato ${idC}`, await req(`/api/contract/${idC}`, "DELETE", { motivo: "Test de baja logica" }, A));
    const contracts2 = await req("/api/contract", "GET", null, A);
    console.log("7. contratos tras baja:", JSON.stringify(contracts2.data?.map(c => c.idContract) ?? []));
    const resv = await req("/api/reservation/1", "GET", null, A);
    console.log("8. reserva del contrato:", resv.data?.status);
}

// tipo de salon: baja + reactivacion por nombre
const types = await req("/api/loungeType", "GET", null, A);
console.log("9. tipos visibles:", types.data?.map(t => t.idLoungeType).join(", "));
const t0 = types.data?.[0];
if (t0) {
    log(`10. DELETE tipo ${t0.idLoungeType}`, await req(`/api/loungeType/${t0.idLoungeType}`, "DELETE", null, A));
    const types2 = await req("/api/loungeType", "GET", null, A);
    console.log("11. tipos tras baja:", types2.data?.map(t => t.idLoungeType).join(", "));
    log("12. recrear mismo tipo (reactivación)", await req("/api/loungeType", "POST", {
        nameLoungeType: t0.nameLoungeType,
        minQuantity: t0.minQuantity,
        maxQuantity: t0.maxQuantity,
        idLounge: t0.idLounge ?? t0.lounge?.idLounge
    }, A));
}

// ubicacion
const locs = await req("/api/locations", "GET", null, A);
const loc0 = locs.data?.[locs.data.length - 1];
log(`13. DELETE ubicacion ${loc0?.idLocation}`, await req(`/api/locations/${loc0?.idLocation}`, "DELETE", null, A));
const locs2 = await req("/api/locations", "GET", null, A);
console.log("14. ubicaciones tras baja:", locs2.data?.length, "de", locs.data?.length);

// menu (cardDetail)
const menus = await req("/api/cardDetail", "GET", null, A);
log(`15. DELETE menu ${menus.data?.[0]?.idCardDetail}`, await req(`/api/cardDetail/${menus.data?.[0]?.idCardDetail}`, "DELETE", null, A));
const menus2 = await req("/api/cardDetail", "GET", null, A);
console.log("16. menus tras baja:", menus2.data?.map(m => m.idCardDetail).join(", "));

// servicio extra
const extras = await req("/api/extraService", "GET", null, A);
log(`17. DELETE extra ${extras.data?.[0]?.idService}`, await req(`/api/extraService/${extras.data?.[0]?.idService}`, "DELETE", null, A));
const extras2 = await req("/api/extraService", "GET", null, A);
console.log("18. extras tras baja:", extras2.data?.map(e => e.idService).join(", "));

// notificaciones del admin (el alta de reserva generó una)
const notifs = await req("/api/notificacion", "GET", null, A);
console.log("19. notificaciones:", notifs.data?.notifications?.length, "no leidas:", notifs.data?.unread);
const n0 = notifs.data?.notifications?.[0];
if (n0) {
    log(`20. DELETE notificacion ${n0.idNotificacion}`, await req(`/api/notificacion/${n0.idNotificacion}`, "DELETE", null, A));
    const notifs2 = await req("/api/notificacion", "GET", null, A);
    console.log("21. notificaciones tras baja:", notifs2.data?.notifications?.length);
}

// administradores: alta, baja, listado, login, reactivacion
const newAdmin = await req("/api/usuario/administradores", "POST", { username: "admin2", password: "admin234" }, A);
log("22. alta admin2", newAdmin);
const idAdm = newAdmin.data?.idUsuario;
log(`23. DELETE admin2 (${idAdm})`, await req(`/api/usuario/administradores/${idAdm}`, "DELETE", null, A));
const admins = await req("/api/usuario/administradores", "GET", null, A);
console.log("24. admins visibles:", JSON.stringify(admins.data?.map(a => a.username)));
log("25. login admin2 dado de baja", await req("/api/auth/login", "POST", { username: "admin2", password: "admin234" }));
log("26. recrear admin2 (reactivación)", await req("/api/usuario/administradores", "POST", { username: "admin2", password: "admin234" }, A));
log("27. login admin2 reactivado", { status: (await req("/api/auth/login", "POST", { username: "admin2", password: "admin234" })).status });

