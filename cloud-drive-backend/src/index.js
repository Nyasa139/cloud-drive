import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import filesRoutes from "./routes/files.routes.js";
import foldersRoutes from "./routes/folders.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/folders", foldersRoutes);

app.get("/", (_, res) => {
  res.send("Cloud Drive API running");
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
