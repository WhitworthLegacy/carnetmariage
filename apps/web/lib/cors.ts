import { NextResponse } from "next/server";

// CORS headers for admin app
export const adminCorsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_ADMIN_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function corsOptions() {
  return NextResponse.json({}, { headers: adminCorsHeaders });
}

export function corsJson<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: adminCorsHeaders });
}

export function corsError(message: string, status = 400) {
  return NextResponse.json(
    { ok: false, error: { code: "ERROR", message } },
    { status, headers: adminCorsHeaders }
  );
}
