import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
dotenv.config({ path: "../.env" });
const { default: apiRoutes } = await import("./routes/index.js");
const { requestLogger } = await import("./middlewares/requestLogger.js");
const { errorHandler } = await import("./middlewares/errorHandler.js");
const { sendError } = await import("./utils/response.js");
const { env } = await import("./config/env.js");

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../client/dist");
const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: isDev ? true : ["https://your-frontend.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(requestLogger);
app.get("/health", (_req, res) => res.status(200).send("OK"));
app.use("/api", apiRoutes);
app.use(/^\/api\/.*/, (_req, res) => sendError(res, "API route not found.", 404));
app.use(express.static(clientDistPath));
app.get(/^\/(?!api).*/, (_req, res) => {
  return res.sendFile(path.join(clientDistPath, "index.html"));
});
app.use(errorHandler);

async function bootstrap() {
  if (env.NODE_ENV === "production" && env.DATABASE_ENABLED) {
    try {
      const { ensureDefaultAdminUser } = await import("./services/authService.js");
      await ensureDefaultAdminUser();
    } catch (error) {
      throw error;
    }
  } else {
    console.log("[startup] Skipping default admin seed in development.");
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
