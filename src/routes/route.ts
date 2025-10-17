import { Router, Request, Response } from "express";
import * as Sentry from "@sentry/node";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ ok: true, message: "Hello from TypeScript + Sentry demo" });
});

router.get("/error", (req: Request, _res: Response) => {
  throw new Error(
    "This is a test uncaught error - should be captured by Sentry"
  );
});

router.get("/capture", (req: Request, res: Response) => {
  try {
    throw new Error("Manual error captured via Sentry.captureException");
  } catch (error) {
    Sentry.captureException(error);
    res.status(200).json({ captured: true });
  }
});

router.get("/user", (req: Request, res: Response) => {
  Sentry.setUser({ id: "kyawsoe-123", email: "kyawsoedeveloper@gmail.com" });
  res.json({ user: "set" });
});

export default router;
