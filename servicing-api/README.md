# Servicing API (Spring Boot)

Implements the endpoints defined in [`contracts/openapi.yaml`](../contracts/openapi.yaml).
Change the spec first, then the code. State is held in memory; there is no database.

| Path | What it is |
|------|------------|
| `src/main/java/com/kestrel/api/payments/` | Controller, service and request type for `POST /loans/{loanId}/payments`. |
| `src/test/java/` | Unit and controller tests. |
| `src/test/contract/` | Contract tests. Each one checks an operation in the spec and that the API answers it. |

## Run it

```bash
mvn -q test
```

```bash
mvn spring-boot:run
```

The API listens on `http://localhost:8080`.
