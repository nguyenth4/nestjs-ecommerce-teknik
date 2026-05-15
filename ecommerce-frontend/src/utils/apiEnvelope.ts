import axios from 'axios';

function unwrapIfEnvelope(body: unknown): unknown {
  if (
    body != null &&
    typeof body === 'object' &&
    'data' in body &&
    'meta' in body &&
    (body as { meta: unknown }).meta != null &&
    typeof (body as { meta: unknown }).meta === 'object' &&
    'timestamp' in ((body as { meta: Record<string, unknown> }).meta as object)
  ) {
    return (body as { data: unknown }).data;
  }
  return body;
}

/** Backend success shape `{ data, meta }` — unwrap so `response.data` stays the inner payload. */
export function installApiEnvelopeInterceptor(): void {
  axios.interceptors.response.use((res) => {
    res.data = unwrapIfEnvelope(res.data) as typeof res.data;
    return res;
  });
}
