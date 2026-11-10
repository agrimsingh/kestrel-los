package com.kestrel.api.payments;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PaymentController.class)
@Import(PaymentService.class)
class PaymentControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private PaymentService paymentService;

  @Test
  void acceptsPaymentAndStoresIt() throws Exception {
    UUID loanId = UUID.randomUUID();

    mockMvc
        .perform(
            post("/loans/{loanId}/payments", loanId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amountCents\": 125000, \"appliedBy\": \"agent-42\"}"))
        .andExpect(status().isAccepted());

    assertEquals(
        new PaymentRequest(125000L, "agent-42"), paymentService.lastPayment(loanId).orElseThrow());
  }

  @Test
  void rejectsPaymentWithoutAppliedBy() throws Exception {
    UUID loanId = UUID.randomUUID();

    mockMvc
        .perform(
            post("/loans/{loanId}/payments", loanId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amountCents\": 125000}"))
        .andExpect(status().isBadRequest());

    assertTrue(paymentService.lastPayment(loanId).isEmpty());
  }
}
