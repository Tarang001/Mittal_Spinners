import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { ensureDefaultAdminUser } from "./services/authService.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", apiRoutes);
app.use(errorHandler);

ensureDefaultAdminUser()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`API listening on http://localhost:${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
