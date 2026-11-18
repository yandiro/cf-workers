// Copies the tenant resolved by server middleware (event.context) into useState,
// so it's available in the Vue app and hydrated to the client.
export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  useState('tenant', () => event?.context.tenant ?? null)
})
