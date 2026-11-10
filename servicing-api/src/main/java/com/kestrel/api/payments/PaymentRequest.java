package com.kestrel.api.payments;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/** Request body for {@code applyPayment}. Mirrors {@code PaymentRequest} in contracts/openapi.yaml. */
public record PaymentRequest(@NotNull @Positive Long amountCents, @NotBlank String appliedBy) {}
