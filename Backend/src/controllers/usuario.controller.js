import usuarioService from "../services/usuario.service.js";

class UsuarioController {

    async getPerfil(req, res) {
        try {
            const perfil = await usuarioService.getPerfil(
                req.usuario.idUsuario
            );

            return res.status(200).json(perfil);

        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({ error: error.message });
        }
    }

    async cambiarPassword(req, res) {
        try {
            const perfil = await usuarioService.cambiarPassword(
                req.usuario.idUsuario,
                req.body
            );

            return res.status(200).json(perfil);

        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({ error: error.message });
        }
    }

    async darDeBaja(req, res) {
        try {
            await usuarioService.darDeBaja(
                req.usuario.idUsuario
            );

            return res.status(200).json({
                message: "Cuenta eliminada correctamente."
            });

        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({ error: error.message });
        }
    }

    // ADMINISTRADORES

    async getAdministradores(req, res) {
        try {
            const administradores =
                await usuarioService.getAllAdministradores();

            return res.status(200).json(administradores);

        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({ error: error.message });
        }
    }

    async createAdministrador(req, res) {
        try {
            const administrador =
                await usuarioService.createAdministrador(req.body);

            const { password, ...perfil } = administrador;

            return res.status(201).json(perfil);

        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({ error: error.message });
        }
    }

    async updateAdministrador(req, res) {
        try {
            const administrador =
                await usuarioService.updateAdministrador(
                    req.params.id,
                    req.body
                );

            return res.status(200).json(administrador);

        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({ error: error.message });
        }
    }

    async deleteAdministrador(req, res) {
        try {
            await usuarioService.deleteAdministrador(
                req.params.id
            );

            return res.status(200).json({
                message: "Administrador eliminado correctamente."
            });

        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({ error: error.message });
        }
    }
}

export default new UsuarioController();
