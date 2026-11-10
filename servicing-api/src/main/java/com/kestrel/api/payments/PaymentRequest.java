package com.kestrel.api.payments;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Request body for {@code applyPayment}. Mirrors {@code PaymentRequest} in contracts/openapi.yaml. */
public record PaymentRequest(@NotNull Long amountCents, @NotBlank String appliedBy) {}
