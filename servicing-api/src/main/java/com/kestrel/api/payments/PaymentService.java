package com.kestrel.api.payments;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/** In-memory payment store. There is no database in this sample. */
@Service
public class PaymentService {
  private final Map<UUID, PaymentRequest> lastPaymentByLoan = new ConcurrentHashMap<>();

  public void applyPayment(UUID loanId, PaymentRequest request) {
    lastPaymentByLoan.put(loanId, request);
  }

  public Optional<PaymentRequest> lastPayment(UUID loanId) {
    return Optional.ofNullable(lastPaymentByLoan.get(loanId));
  }
}
