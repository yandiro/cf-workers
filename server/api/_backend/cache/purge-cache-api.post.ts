// Example: delete responses stored with the Workers Cache API (caches.default).
//
// Caveats:
// - Only purges the data center that handles this request. For a global purge use
//   POST https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache {"files":[...]}
// - No-op on *.workers.dev; only works on custom domains/routes.
//
// curl -X POST https://<host>/api/_backend/cache/purge-cache-api \
//   -H "Authorization: Bearer $SECRET" -H "Content-Type: application/json" \
//   -d '{"urls":["https://dev-tulio.cf.noq-servers.net/some/page"]}'
export default defineEventHandler(async (event) => {
  if (getHeader(event, 'authorization') !== `Bearer ${useRuntimeConfig(event).backendApiSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { urls = [] } = (await readBody<{ urls?: string[] }>(event)) ?? {}

  const results = await Promise.all(
    urls.map(async url => ({ url, deleted: await caches.default.delete(new Request(url)) })),
  )

  return { ok: true, results }
})
