# Kestrel LOS architecture

## Business context

Kestrel Home Loans services residential mortgage loans. This codebase covers
payment application, delinquency reporting and the audit trail.

## Systems

| Area | Tech | Role |
|------|------|------|
| `legacy-core/` | Java 17 on the in-house Kestrel framework | Event handlers for the loan lifecycle. Most existing code lives here. |
| `contracts/openapi.yaml` | OpenAPI 3.1 | Contract between the API and the UI. Change the spec first. |
| `servicing-api/` | Spring Boot 3 | New REST surface for portals and partners. |
| `servicing-ui/` | React 18 | Servicer UI. |
| `lambdas/` | Python | Nightly exports for reporting. |

## The Kestrel framework

Handlers are not Spring beans. The pattern:

1. Extend `KestrelHandler<T>`, where `T` is the payload type.
2. Implement `handle(KestrelContext ctx, T payload)`.
3. Register the fully qualified class name in `META-INF/kestrel-handlers.xml`.
4. For any customer-impacting write, call `AuditGateway.record(...)` before persisting.
5. Persist through `KestrelRepository`. There is no JPA in `legacy-core`.

`PaymentAppliedHandler` is the reference handler. New handlers follow it.

## Cross-cutting

- Never log full loan numbers. See [compliance-logging.md](compliance-logging.md).
- Business rules from Loan Operations are in [servicing-policy.md](servicing-policy.md).
- Every OpenAPI change needs a contract test under `servicing-api/src/test/contract/`.
