import usuarioService from "../services/usuario.service.js";

class UsuarioController {

    async getPerfil(req, res) {
        try {
            const perfil = await usuarioService.getPerfil(req.usuario.idUsuario);
            return res.status(200).json(perfil);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async cambiarPassword(req, res) {
        try {
            const perfil = await usuarioService.cambiarPassword(req.usuario.idUsuario, req.body);
            return res.status(200).json(perfil);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async darDeBaja(req, res) {
        try {
            await usuarioService.darDeBaja(req.usuario.idUsuario);
            return res.status(200).json({ message: "Cuenta eliminada correctamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new UsuarioController();
