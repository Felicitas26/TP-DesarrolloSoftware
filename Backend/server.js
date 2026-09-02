import express from "express";
import cors from "cors";
import clientRoutes from "./src/routes/client.routes.js";
import loungeRoutes from "./src/routes/lounge.routes.js";
import loungeTypeRoutes from "./src/routes/loungeType.routes.js";
import priceRoutes from "./src/routes/price.routes.js";
import locationRoutes from "./src/routes/location.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import usuarioRoutes from "./src/routes/usuario.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/client", clientRoutes);
app.use("/api/lounge", loungeRoutes);
app.use("/api/loungeType", loungeTypeRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuario", usuarioRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
