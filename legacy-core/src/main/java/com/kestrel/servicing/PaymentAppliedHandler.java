package com.kestrel.servicing;

import com.kestrel.framework.AuditGateway;
import com.kestrel.framework.KestrelContext;
import com.kestrel.framework.KestrelHandler;
import com.kestrel.framework.KestrelRepository;

/** Golden example — mirror this for new servicing handlers. */
public class PaymentAppliedHandler extends KestrelHandler<PaymentAppliedPayload> {
  @Override
  public void handle(KestrelContext ctx, PaymentAppliedPayload payload) {
    AuditGateway.record(
        ctx,
        "PAYMENT_APPLIED",
        payload.loanId(),
        "amountCents=" + payload.amountCents() + ";by=" + payload.appliedBy());
    KestrelRepository.save(payload.loanId(), "lastPaymentCents", Long.toString(payload.amountCents()));
  }
}
