// This would be the DABATASE
import { TENANTS } from '#server/utils/tenants.mock'

// This would be the .NET BE
export default defineEventHandler((event) => {
  const auth = getHeader(event, 'authorization')
  if (auth !== `Bearer ${useRuntimeConfig(event).backendApiSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const key = decodeURIComponent(getRouterParam(event, 'key') || '').toLowerCase()
  // .NET BE reads from the DB
  const tenant = TENANTS[key]
  if (!tenant) {
    throw createError({ statusCode: 404, statusMessage: `Unknown tenant: ${key}` })
  }

  console.log(`[backend] tenant lookup HIT backend for ${key}`)
  return { ...tenant, origin: key, fetchedAt: new Date().toISOString() }
})
