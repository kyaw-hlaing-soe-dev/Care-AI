import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { onRequest } from "firebase-functions/v2/https";
import { onTaskDispatched } from "firebase-functions/v2/tasks";
import {
  analyzeVitals,
  providerConfig,
  retryAnalysis,
} from "./functions/analyzeVitals.js";
import { getDashboard } from "./functions/getDashboard.js";
import { getHistory, getHistoryDetail } from "./functions/getHistory.js";
import { managePreference, manageProfile } from "./functions/manageProfile.js";
import { getAllowedOrigins, openRouterApiKey } from "./config/env.js";
import { runAnalysis } from "./services/aiAnalysisService.js";
import { toAppError } from "./utils/errors.js";
import { logError, logInfo } from "./utils/logger.js";

const REGION = "asia-southeast1";
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb", strict: true }));
app.use((request, response, next) => {
  const origin = request.header("origin");
  const allowed = !origin || getAllowedOrigins().includes(origin);
  if (!allowed) {
    response
      .status(403)
      .json({
        success: false,
        error: {
          code: "PERMISSION_ERROR",
          message: "Request origin is not allowed.",
          requestId: requestId(request),
        },
      });
    return;
  }
  if (origin) response.setHeader("access-control-allow-origin", origin);
  response.setHeader("vary", "Origin");
  response.setHeader(
    "access-control-allow-headers",
    "Authorization, Content-Type, Idempotency-Key",
  );
  response.setHeader(
    "access-control-allow-methods",
    "GET, PUT, PATCH, POST, OPTIONS",
  );
  response.setHeader("cache-control", "no-store");
  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }
  next();
});

app.all("/profile", route(manageProfile));
app.all("/profile/preferences", route(managePreference));
app.all("/vitals/analyze", route(analyzeVitals));
app.all("/vitals/:readingId/retry-analysis", route(retryAnalysis));
app.all("/dashboard", route(getDashboard));
app.all("/history/:readingId", route(getHistoryDetail));
app.all("/history", route(getHistory));
app.use((_request, response) =>
  response
    .status(404)
    .json({
      success: false,
      error: { code: "PERMISSION_ERROR", message: "Not found." },
    }),
);

export const api = onRequest(
  {
    region: REGION,
    cors: false,
    secrets: [openRouterApiKey],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  app,
);

export const processAnalysisRetry = onTaskDispatched(
  {
    region: REGION,
    secrets: [openRouterApiKey],
    retryConfig: {
      maxAttempts: 3,
      minBackoffSeconds: 60,
      maxBackoffSeconds: 300,
      maxRetrySeconds: 900,
    },
    rateLimits: { maxConcurrentDispatches: 5 },
    invoker: "private",
  },
  async (request) => {
    const data = request.data as { uid?: unknown; readingId?: unknown };
    if (typeof data.uid !== "string" || typeof data.readingId !== "string")
      return;
    const result = await runAnalysis(
      data.uid,
      data.readingId,
      providerConfig(),
    );
    if (result.retryable) throw new Error("Transient AI provider failure");
  },
);

function route(
  handler: (request: Request, response: Response) => Promise<void>,
) {
  return (request: Request, response: Response, next: NextFunction) => {
    void handler(request, response).catch(next);
  };
}

app.use(
  (
    error: unknown,
    request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    const safe = toAppError(error);
    const id = requestId(request);
    logError("API request failed", {
      requestId: id,
      operation: `${request.method} ${request.path}`,
      code: safe.code,
      status: safe.status,
    });
    response
      .status(safe.status)
      .json({
        success: false,
        error: { code: safe.code, message: safe.message, requestId: id },
      });
  },
);

function requestId(request: Request): string {
  const incoming = request.header("x-request-id");
  const id =
    incoming && /^[A-Za-z0-9_-]{8,100}$/.test(incoming)
      ? incoming
      : crypto.randomUUID();
  logInfo("API request", {
    requestId: id,
    operation: `${request.method} ${request.path}`,
  });
  return id;
}
