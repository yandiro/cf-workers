import type { H3Event } from 'h3'
import type { TenantConfig } from './tenants.mock'

// Event is passed first so Nitro uses event.waitUntil() for SWR background
// revalidation — required on Workers, otherwise the refresh may be killed.

/*
 * Cloudflare Workers KV cache called tenant_config_cache.
 * See: nuxt.config.ts and wrangler.jsonc
 */
export const getTenantConfig = defineCachedFunction(
  async (event: H3Event, tenantKey: string) => {
    // Only executes on cache miss or background revalidation
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

// Tenant key = request host (incl. port). Works for shared-domain subdomains and custom domains.
export const getTenantKey = (event: H3Event) => getRequestHost(event).toLowerCase()
