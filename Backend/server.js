import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import clientRoutes from "./src/routes/client.routes.js";
import loungeRoutes from "./src/routes/lounge.routes.js";
import loungeTypeRoutes from "./src/routes/loungeType.routes.js";
import priceRoutes from "./src/routes/price.routes.js";
import locationRoutes from "./src/routes/location.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import usuarioRoutes from "./src/routes/usuario.routes.js";
import reservationRoutes from "./src/routes/reservation.routes.js";
import extraServiceRoutes from "./src/routes/extraService.routes.js";
import cardDetailRoutes from "./src/routes/cardDetail.routes.js";
import contractRoutes from "./src/routes/contract.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/client", clientRoutes);
app.use("/api/lounge", loungeRoutes);
app.use("/api/loungeType", loungeTypeRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/extraService", extraServiceRoutes);
app.use("/api/cardDetail", cardDetailRoutes);
app.use("/api/contract", contractRoutes);
app.use("/api/notificacion", notificationRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
