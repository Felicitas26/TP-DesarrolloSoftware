import usuarioService from "../services/usuario.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class UsuarioController {

    getPerfil = asyncHandler(async (req, res) => {
        const perfil = await usuarioService.getPerfil(req.usuario.idUsuario);
        return res.status(200).json(perfil);
    });

    cambiarPassword = asyncHandler(async (req, res) => {
        const perfil = await usuarioService.cambiarPassword(
            req.usuario.idUsuario,
            req.body
        );
        return res.status(200).json(perfil);
    });

    darDeBaja = asyncHandler(async (req, res) => {
        await usuarioService.darDeBaja(req.usuario.idUsuario);
        return res.status(200).json({
            message: "Cuenta eliminada correctamente."
        });
    });

    // ADMINISTRADORES

    getAdministradores = asyncHandler(async (req, res) => {
        const administradores = await usuarioService.getAllAdministradores();
        return res.status(200).json(administradores);
    });

    createAdministrador = asyncHandler(async (req, res) => {
        const administrador = await usuarioService.createAdministrador(req.body);
        const { password, ...perfil } = administrador;
        return res.status(201).json(perfil);
    });

    updateAdministrador = asyncHandler(async (req, res) => {
        const administrador = await usuarioService.updateAdministrador(
            req.params.id,
            req.body
        );
        return res.status(200).json(administrador);
    });

    deleteAdministrador = asyncHandler(async (req, res) => {
        await usuarioService.deleteAdministrador(req.params.id);
        return res.status(200).json({
            message: "Administrador eliminado correctamente."
        });
    });
}

export default new UsuarioController();
