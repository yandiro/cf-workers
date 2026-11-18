// Resolve tenant once per request and attach it to the event context.
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/_backend')) {
    return
    // don't recurse into the mock backend
  }

  const tenantKey = getTenantKey(event)
  try {
    event.context.tenant = await getTenantConfig(event, tenantKey)
  } catch (err: any) {
    throw createError({ statusCode: err?.statusCode || 500, statusMessage: err?.statusMessage || 'Tenant resolution failed' })
  }
})
