import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No autenticado. Falta el token." });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
}

export function requireRole(roles) {
    return (req, res, next) => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: `Acceso denegado. Esta acción solo está permitida para: ${roles.join(" o ")}.`
            });
        }
        next();
    };
}
