package com.kestrel.servicing;

public record PaymentAppliedPayload(String loanId, long amountCents, String appliedBy) {}
