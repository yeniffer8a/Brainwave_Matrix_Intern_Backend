import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import apiRouter from "./routes/api.router.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./openapi.yaml");

const app = express();
const PORT = process.env.APP_PORT || "3001";

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("", apiRouter);

app.listen(PORT, () => {
  console.log(`[Server] Server running on port ${PORT}`);
});

export default app;
