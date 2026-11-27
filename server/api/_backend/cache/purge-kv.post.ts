// Example: clear Nitro cached-function entries stored in Workers KV (tenant_config_cache).
// KV key format: nitro:functions:<name>:<getKey()>.json
// See node_modules/nitropack/dist/runtime/internal/cache.mjs
//
// curl -X POST https://<host>/api/_backend/cache/purge-kv \
//   -H "Authorization: Bearer $SECRET" -H "Content-Type: application/json" \
//   -d '{"tenant":"dev-tulio.cf.noq-servers.net"}'   # omit "tenant" to clear all
export default defineEventHandler(async (event) => {
  if (getHeader(event, 'authorization') !== `Bearer ${useRuntimeConfig(event).backendApiSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { tenant } = (await readBody<{ tenant?: string }>(event)) ?? {}
  const storage = useStorage('cache') // mounted to KV in nuxt.config.ts
  const prefix = 'nitro:functions:tenant-config'

  // Note: KV is eventually consistent — other locations may serve the old value for ~60s.
  if (tenant) {
    const key = `${prefix}:${tenant.toLowerCase()}.json`
    await storage.removeItem(key)
    return { ok: true, removed: [key] }
  }

  const keys = await storage.getKeys(prefix)
  await Promise.all(keys.map(k => storage.removeItem(k)))
  return { ok: true, removed: keys }
})
