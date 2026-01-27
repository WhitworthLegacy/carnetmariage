import { NextResponse } from "next/server";
import type { AppError } from "@carnetmariage/core";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(error: AppError, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export function jsonCreated<T>(data: T) {
  return jsonOk(data, 201);
}
