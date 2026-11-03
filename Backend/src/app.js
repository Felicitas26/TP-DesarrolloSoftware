import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import openapi from "./docs/openapi.js";

import clientRoutes from "./routes/client.routes.js";
import loungeRoutes from "./routes/lounge.routes.js";
import loungeTypeRoutes from "./routes/loungeType.routes.js";
import priceRoutes from "./routes/price.routes.js";
import locationRoutes from "./routes/location.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import extraServiceRoutes from "./routes/extraService.routes.js";
import cardDetailRoutes from "./routes/cardDetail.routes.js";
import contractRoutes from "./routes/contract.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api-docs.json", (req, res) => res.json(openapi));
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapi, {
        customSiteTitle: "API SALON STYLO",
        swaggerOptions: { persistAuthorization: true }
    })
);

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

app.use(notFound);
app.use(errorHandler);

export default app;
