package com.kestrel.servicing;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.kestrel.framework.AuditTrail;
import com.kestrel.framework.KestrelContext;
import com.kestrel.framework.KestrelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PaymentAppliedHandlerTest {
  @BeforeEach
  void reset() {
    AuditTrail.INSTANCE.clear();
    KestrelRepository.clear();
  }

  @Test
  void recordsAuditAndPersistsPayment() {
    var handler = new PaymentAppliedHandler();
    handler.handle(new KestrelContext("corr-1"), new PaymentAppliedPayload("loan-uuid-1", 125000L, "agent-42"));

    assertEquals("125000", KestrelRepository.get("loan-uuid-1", "lastPaymentCents"));
    assertEquals(1, AuditTrail.INSTANCE.events().size());
  }
}
