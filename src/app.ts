import express from "express";
import { Sentry } from "./config/sentry";
import routes from "./routes/route";

const app = express();

Sentry.setupExpressErrorHandler(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.use(Sentry.expressErrorHandler());

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
);

export default app;
