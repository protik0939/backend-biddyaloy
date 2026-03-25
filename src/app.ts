import express, { Application, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRouters } from "./app/routes";

const app: Application = express();

const defaultAllowedOrigins = ["http://localhost:3000"];
const envAllowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
]
  .filter(Boolean)
  .map((origin) => origin as string);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins]);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  cors(corsOptions),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api/v1/', IndexRouters);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Biddyaloy!");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
