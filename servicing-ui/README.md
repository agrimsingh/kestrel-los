# Servicing UI (React)

The servicer UI. It talks to the servicing API through a typed client generated from
[`contracts/openapi.yaml`](../contracts/openapi.yaml). Change the spec first, then
regenerate the client, then the UI.

| Path | What it is |
|------|------------|
| `src/api/schema.d.ts` | Types generated from the spec. Do not edit by hand. |
| `src/api/client.ts` | The typed client the UI calls. |
| `src/loans/` | The loan queue and the summary of the selected loan. |
| `src/payments/` | The apply-payment form, the activity list and their tests. |
| `src/fixtures/loans.ts` | In-memory loans. Last four digits of the loan number only. |
| `src/index.css` | Design tokens and every style. New screens reuse `card`, `field`, `button` and `notice`. |

The activity list shows payments applied since the page loaded. The API cannot read
payments back yet, so nothing survives a refresh.

## Run it

```bash
npm install
npm test
```

```bash
npm run dev
```

The UI runs on `http://localhost:5173` and proxies API calls to the servicing API on
`http://localhost:8080`, so start that first (`mvn spring-boot:run` in `servicing-api/`).

## After a spec change

```bash
npm run generate:api
```

`npm run check:api` fails if `src/api/schema.d.ts` is out of date with the spec.
