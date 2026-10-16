import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import usuarioModel from "../models/usuario.model.js";
import usuarioService from "../services/usuario.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

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

    login = asyncHandler(async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            const error = new Error("Usuario y contraseña son obligatorios.");
            error.statusCode = 400;
            throw error;
        }

        const usuario = await usuarioModel.findByUsername(username);
        if (!usuario) {
            const error = new Error("Credenciales incorrectas.");
            error.statusCode = 401;
            throw error;
        }

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            const error = new Error("Credenciales incorrectas.");
            error.statusCode = 401;
            throw error;
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
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { email, passwordNueva } = req.body;

        const result = await usuarioService.resetPassword({
            email,
            passwordNueva
        });

        return res.status(200).json(result);
    });

    register = asyncHandler(async (req, res) => {
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
    });
}

export default new AuthController();
