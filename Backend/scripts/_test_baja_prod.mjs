// Verificación de baja lógica contra PRODUCCIÓN.
const BASE = "https://stylo-api-nu.vercel.app";

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
    console.log(`${label}: [${r.status}] ${typeof r.data === "object" ? JSON.stringify(r.data).slice(0, 160) : r.data}`);

const lounges = await req("/api/lounge");
console.log("1. lounges activos:", lounges.data?.map(l => l.idLounge).join(", "));

const admin = await req("/api/auth/login", "POST", { username: "admin", password: "admin123" });
log("2. login admin", { status: admin.status, data: { rol: admin.data?.rol } });
const A = admin.data.token;

const client = await req("/api/client", "POST", {
    nameCli: "Verif", surnameCli: "Produccion", phoneCli: "3415559999",
    dniCli: 40111222, emailCli: "verif.prod@stylo.com",
    addressCli: "Calle 9", idLocation: 1
}, A);
log("3. alta cliente", client);

const cli = await req("/api/auth/login", "POST", { username: "verif.prod@stylo.com", password: "40111222" });
log("4. login cliente", { status: cli.status, data: { idCli: cli.data?.idCli } });

const types = await req("/api/loungeType");
const t1 = types.data?.find(t => t.idLounge === 1);
const res = await req("/api/reservation", "POST", {
    dateEvent: "2099-07-20", eventType: "cumpleanos", cantInvit: 12,
    status: "pendiente", idLounge: 1, idLoungeType: t1?.idLoungeType, idCardDetail: null
}, cli.data.token);
log("5. reserva lounge 1", res);

const del = await req("/api/lounge/1", "DELETE", null, A);
log("6. DELETE lounge 1 (con reserva)", del);

const after = await req("/api/lounge");
console.log("7. lounges tras baja:", after.data?.map(l => l.idLounge).join(", "));

const resAll = await req("/api/reservation", "GET", null, A);
const r = (resAll.data || []).find(x => x.client?.dniCli === 40111222);
console.log("8. historial:", r ? `status=${r.status} lounge='${r.lounge?.name}'` : "NO ENCONTRADA");

const inactive = await req("/api/reservation", "POST", {
    dateEvent: "2099-07-21", eventType: "casamiento", cantInvit: 8,
    status: "pendiente", idLounge: 1, idLoungeType: t1?.idLoungeType, idCardDetail: null
}, cli.data.token);
log("9. reserva sobre lounge de baja", inactive);
