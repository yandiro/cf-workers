import type { H3Event } from 'h3'
import type { TenantConfig } from './tenants.mock'

// Unknown hosts are cached separately with a short TTL ("negative caching"), so bots /
// stray domains don't hit the backend on every request, while newly added tenants
// still show up quickly. KV enforces a 60s minimum TTL.
const NEGATIVE_TTL = 60
const negativeKey = (tenantKey: string) => `tenant-config-miss:${tenantKey}`

// Event is passed first so Nitro uses event.waitUntil() for SWR background
// revalidation — required on Workers, otherwise the refresh may be killed.

/**
 * Cloudflare Workers KV cache called tenant_config_cache.
 * See: nuxt.config.ts and wrangler.jsonc
 */
const getCachedTenantConfig = defineCachedFunction(
  async (event: H3Event, tenantKey: string) => {
    // Only executes on cache miss or background revalidation.
    // Errors (incl. 404) are not cached here; 404s are negative-cached in getTenantConfig.
    return await $fetch<TenantConfig & { fetchedAt: string }>(
      `/api/_backend/tenants/${encodeURIComponent(tenantKey)}`,
      { headers: { Authorization: `Bearer ${useRuntimeConfig(event).backendApiSecret}` } },
    )
  },
  {
    maxAge: 60 * 5,
    staleMaxAge: 60 * 60,
    swr: true,
    name: 'tenant-config',
    getKey: (_event: H3Event, tenantKey: string) => tenantKey.toLowerCase(),
    shouldBypassCache: (_event: H3Event, tenantKey: string) => !tenantKey,
  },
)

export async function getTenantConfig(event: H3Event, tenantKey: string) {
  const key = tenantKey.toLowerCase()
  const storage = useStorage('cache')

  if (key && await storage.getItem(negativeKey(key))) {
    throw createError({ statusCode: 404, statusMessage: `Unknown tenant: ${key}` })
  }

  try {
    return await getCachedTenantConfig(event, key)
  } catch (err: any) {
    // Only cache "not found" — never 5xx/network errors.
    if (key && err?.statusCode === 404) {
    await storage.setItem(
      negativeKey(key),
      { missedAt: new Date().toISOString() },
      { ttl: NEGATIVE_TTL }
    )}
    throw err
  }
}

// Tenant key = request host (incl. port). Works for shared-domain subdomains and custom domains.
export const getTenantKey = (event: H3Event) => getRequestHost(event).toLowerCase()
