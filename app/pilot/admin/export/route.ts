import { NextResponse, type NextRequest } from "next/server";
import { isPilotAdminAuthed } from "@/app/pilot/admin/actions";
import { getPilotExportRows, getPilotContactRows, type ExportRow } from "@/lib/domain/pilot";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: ExportRow[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n");
}

/**
 * GET /pilot/admin/export            -> de-identified analysis dataset
 *                                       (one row per participant x condition)
 * GET /pilot/admin/export?type=contacts -> name + contact per participant,
 *                                          for compensation; keep separate
 *                                          from the analysis data.
 * Both are gated by the admin session cookie and read via the service-role
 * client only.
 */
export async function GET(request: NextRequest) {
  const authed = await isPilotAdminAuthed();
  if (!authed) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get("type");
  const isContacts = type === "contacts";
  const rows = isContacts ? await getPilotContactRows() : await getPilotExportRows();
  const csv = toCsv(rows);
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="karigarsetu-pilot-${isContacts ? "contacts" : "analysis"}-${stamp}.csv"`,
    },
  });
}
