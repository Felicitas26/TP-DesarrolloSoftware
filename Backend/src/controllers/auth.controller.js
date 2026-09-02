import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import usuarioModel from "../models/usuario.model.js";
import usuarioService from "../services/usuario.service.js";

function generarToken(usuario) {
    return jwt.sign(
        {
            idUsuario: usuario.idUsuario,
            rol: usuario.rol,
            idCli: usuario.idCli
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );
}

class AuthController {

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
            }

            const usuario = await usuarioModel.findByUsername(username);
            if (!usuario) {
                return res.status(401).json({ error: "Credenciales incorrectas." });
            }

            const match = await bcrypt.compare(password, usuario.password);
            if (!match) {
                return res.status(401).json({ error: "Credenciales incorrectas." });
            }

            const token = generarToken(usuario);

            return res.status(200).json({
                token,
                idUsuario: usuario.idUsuario,
                rol: usuario.rol,
                idCli: usuario.idCli,
                passwordTemporal: Boolean(usuario.passwordTemporal),
                username: usuario.username
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async register(req, res) {
        try {
            const { dniCli, password } = req.body;

            const usuario = await usuarioService.registerCliente({
                dniCli,
                passwordNueva: password
            });

            const token = generarToken(usuario);

            return res.status(201).json({
                message: "Registro exitoso.",
                token,
                idUsuario: usuario.idUsuario,
                rol: usuario.rol,
                idCli: usuario.idCli,
                passwordTemporal: Boolean(usuario.passwordTemporal),
                username: usuario.username
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new AuthController();
