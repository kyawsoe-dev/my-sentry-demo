import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import {
  httpIntegration,
  expressIntegration,
  requestDataIntegration,
} from "@sentry/node";

export function initSentry() {
  const dsn = process.env.SENTRY_DSN || "";
  const tracesSampleRate = Number(process.env.TRACES_SAMPLE_RATE ?? 1.0);

  if (!dsn) {
    console.warn("Sentry DSN not set. Errors will not be sent to Sentry.");
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      httpIntegration(),
      expressIntegration(),
      requestDataIntegration(),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate,
    profilesSampleRate: tracesSampleRate,
    environment: process.env.NODE_ENV || "development",
  });

  console.log(
    `Sentry initialized (env=${process.env.NODE_ENV}, tracesSampleRate=${tracesSampleRate})`
  );
}

export { Sentry };
