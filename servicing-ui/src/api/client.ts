import createClient from "openapi-fetch";
import type { paths } from "./schema";

/**
 * Typed client for the servicing API. `schema.d.ts` is generated from
 * contracts/openapi.yaml; run `npm run generate:api` after the spec changes.
 */
export const api = createClient<paths>({
  // Same origin: the Vite dev server proxies API paths to the servicing API.
  baseUrl: window.location.origin,
  // Look fetch up per call so tests can stub it.
  fetch: (request) => globalThis.fetch(request),
});
