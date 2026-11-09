# Bugbot review rules — Kestrel LOS

- Reject logging of full loan numbers, SSN, or bank account numbers; see `docs/compliance-logging.md`.
- Legacy handlers must register in `kestrel-handlers.xml` and call `AuditGateway` before save.
- OpenAPI changes must include or update contract tests under `servicing-api/src/test/contract/`.
