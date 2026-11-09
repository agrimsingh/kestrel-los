---
name: add-kestrel-handler
description: Add a new Kestrel legacy event handler with registry, audit, and tests.
---

# Add Kestrel handler

1. Read `.cursor/rules/kestrel-legacy.mdc` and copy patterns from `PaymentAppliedHandler`.
2. Create handler class under `com.kestrel.servicing`.
3. Add FQCN to `META-INF/kestrel-handlers.xml`.
4. Use `AuditGateway` then `KestrelRepository` for persistence.
5. Add focused JUnit test; run `mvn test` in `legacy-core/`.
