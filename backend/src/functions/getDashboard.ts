import type { Request, Response } from "express";
import { verifyAuth } from "../auth/verifyAuth.js";
import { getDashboard as loadDashboard } from "../services/dashboardService.js";
import { AppError } from "../utils/errors.js";

export async function getDashboard(
  request: Request,
  response: Response,
): Promise<void> {
  if (request.method !== "GET")
    throw new AppError("VALIDATION_ERROR", 405, "Unsupported method.");
  response.json({
    success: true,
    data: await loadDashboard(await verifyAuth(request)),
  });
}
