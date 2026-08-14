import express from "express";
import cors from "cors";
import clientRoutes from "./src/routes/client.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/client", clientRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
