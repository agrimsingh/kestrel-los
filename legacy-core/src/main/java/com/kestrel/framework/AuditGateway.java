package com.kestrel.framework;

public final class AuditGateway {
  private AuditGateway() {}

  public static void record(KestrelContext ctx, String eventType, String loanId, String detail) {
    // In-memory audit trail
    AuditTrail.INSTANCE.append(ctx.correlationId(), eventType, loanId, detail);
  }
}
