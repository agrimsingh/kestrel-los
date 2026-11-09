# Logging standards (regulated lender)

- Log **loanId** (internal UUID) or last-4 of loan number only.
- Do **not** log full loan numbers, SSN, or bank account numbers in CloudWatch or application logs.
- Structured fields: `loanId`, `eventType`, `correlationId`.

The delinquency export Lambda must redact identifiers in debug logs.
