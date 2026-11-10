package com.kestrel.api.contract;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PaymentsContractTest {
  private static final String PATH = "/loans/{loanId}/payments";

  @Autowired private MockMvc mockMvc;

  @Test
  void specDeclaresApplyPayment() throws Exception {
    OpenApiSpec spec = OpenApiSpec.load();

    Map<String, Object> operation = spec.operation("post", PATH);
    assertNotNull(operation, "spec is missing POST " + PATH);
    assertEquals("applyPayment", operation.get("operationId"));
    assertTrue(OpenApiSpec.child(operation, "responses").containsKey("202"));
    assertTrue(OpenApiSpec.child(operation, "responses").containsKey("400"));
    assertEquals(List.of("amountCents", "appliedBy"), spec.requiredProperties("PaymentRequest"));
  }

  @Test
  void apiRejectsAmountBelowSpecMinimum() throws Exception {
    mockMvc
        .perform(
            post(PATH, UUID.randomUUID())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amountCents\": 0, \"appliedBy\": \"agent-42\"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void apiAcceptsRequestShapedLikeTheSpec() throws Exception {
    mockMvc
        .perform(
            post(PATH, UUID.randomUUID())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amountCents\": 125000, \"appliedBy\": \"agent-42\"}"))
        .andExpect(status().isAccepted());
  }
}
