import type { Request } from "express";
import { adminAuth } from "../config/firebase.js";
import { AppError } from "../utils/errors.js";

export async function verifyAuth(request: Request): Promise<string> {
  const authorization = request.header("authorization") ?? "";
  const match = /^Bearer ([^\s]+)$/.exec(authorization);
  if (!match?.[1]) throw new AppError("AUTH_ERROR", 401);

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    if (!decoded.uid) throw new Error("Token has no UID");
    return decoded.uid;
  } catch {
    throw new AppError("AUTH_ERROR", 401);
  }
}
