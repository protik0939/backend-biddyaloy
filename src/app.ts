import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRouters } from "./app/routes";
import { auth } from "./app/lib/auth";
import { buildOriginPolicy } from "./app/shared/originPolicy";

const app: Application = express();

const originPolicy = buildOriginPolicy();

const isNoOriginRequest = (origin: string | undefined) => {
  if (!origin) {
    return true;
  }

  return origin.trim().toLowerCase() === "null";
};

const isAllowedRequestOrigin = (origin: string | undefined) => {
  if (isNoOriginRequest(origin)) {
    return true;
  }

  return originPolicy.isAllowedOrigin(origin);
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isAllowedRequestOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedRequestOrigin(origin)) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: "CORS origin denied",
    errors: [{ path: "origin", message: `Origin ${origin} is not allowed` }],
  });
});

app.use(
  cors(corsOptions),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const authHandler = toNodeHandler(auth);
app.all("/api/auth", authHandler);
app.all(/^\/api\/auth\/.*/, authHandler);

app.use('/api/v1/', IndexRouters);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Biddyaloy!");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
