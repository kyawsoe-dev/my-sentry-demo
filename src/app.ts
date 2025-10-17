import express from "express";
import routes from "./routes/route";
import sentryDashboard from "./routes/sentry";
import { Sentry } from "./config/sentry";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.use("/dashboard", sentryDashboard);

Sentry.setupExpressErrorHandler(app);

app.use(Sentry.expressErrorHandler());

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

export default app;
