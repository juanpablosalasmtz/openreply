import { prisma } from "@/lib/db/client";

/**
 * Temporary diagnostics for tracing why comments do not turn into DMs.
 *
 * Writes an INFO row to OperationalEvent so it appears in the Diagnostics
 * page's "Operational Event Timeline". Payloads carry only ids, counts and
 * booleans: never tokens, comment text or usernames. Failures are swallowed so
 * diagnostics can never break the webhook, the sweep or the worker.
 */
export async function recordDiag(
  message: string,
  payload: Record<string, unknown>,
  workspaceId?: string | null
): Promise<void> {
  await prisma.operationalEvent
    .create({
      data: {
        workspaceId: workspaceId ?? null,
        source: "SYSTEM",
        level: "INFO",
        message: `[diag] ${message}`,
        payload: JSON.parse(JSON.stringify(payload)),
      },
    })
    .catch(() => {});
}
