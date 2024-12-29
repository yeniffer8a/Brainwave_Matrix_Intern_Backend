import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";

const app = express();
const PORT = process.env.APP_PORT || "3001";

connectDB();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`[Server] Server running on port ${PORT}`);
});

export default app;
