import type { Request, Response } from "express";
import { verifyAuth } from "../auth/verifyAuth.js";
import {
  getProfile,
  savePreference,
  saveProfile,
} from "../services/profileService.js";
import {
  validatePreference,
  validateProfile,
} from "../validators/profileValidator.js";
import { AppError } from "../utils/errors.js";

export async function manageProfile(
  request: Request,
  response: Response,
): Promise<void> {
  const uid = await verifyAuth(request);
  if (request.method === "GET")
    response.json({ success: true, data: { profile: await getProfile(uid) } });
  else if (request.method === "PUT")
    response.json({
      success: true,
      data: { profile: await saveProfile(uid, validateProfile(request.body)) },
    });
  else throw new AppError("VALIDATION_ERROR", 405, "Unsupported method.");
}

export async function managePreference(
  request: Request,
  response: Response,
): Promise<void> {
  if (request.method !== "PATCH")
    throw new AppError("VALIDATION_ERROR", 405, "Unsupported method.");
  const uid = await verifyAuth(request);
  response.json({
    success: true,
    data: {
      profile: await savePreference(uid, validatePreference(request.body)),
    },
  });
}
