<script setup lang="ts">
import type { TenantConfig } from '~~/server/utils/tenants.mock'

/** Maps to .env:NUXT_PUBLIC_APP_ENV */
const { appEnv } = useRuntimeConfig().public
const tenant = useState<(TenantConfig & { fetchedAt: string }) | null>('tenant')

// Theme tokens -> CSS variables, rendered during SSR so there's no flash of unstyled content.
const themeCss = computed(() => {
  const t = tenant.value?.theme
  if (!t) return ''
  return `:root{
    --color-primary:${t.primary};
    --color-secondary:${t.secondary};
    --color-bg:${t.bg};
    --color-text:${t.text};
    --font-family:${t.fontFamily};
    --radius:${t.radius};
  }`
})

useHead({
  title: () => tenant.value?.name ?? 'Unknown tenant',
  style: [{ key: 'tenant-theme', innerHTML: themeCss }],
  link: () => tenant.value ? [{ rel: 'stylesheet', href: tenant.value.theme.fontUrl }] : [],
})
</script>

<template>
  <main v-if="tenant" class="tenant">
    <h1>{{ tenant.name }}</h1>
    <dl>
      <dt>Environment</dt><dd>{{ appEnv }}</dd>
      <dt>ID</dt><dd>{{ tenant.id }}</dd>
      <dt>Origin</dt><dd>{{ tenant.origin }}</dd>
      <dt>Fetched from backend at</dt><dd>{{ tenant.fetchedAt }}</dd>
    </dl>
    <button class="btn">Primary button</button>
  </main>
  <main v-else>No tenant</main>
</template>

<style>
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-family);
}
.tenant {
  padding: 2rem;
  border-top: 6px solid var(--color-primary);
}
.tenant h1 { color: var(--color-primary); }
.tenant dt { color: var(--color-secondary); font-weight: 600; }
.btn {
  background: var(--color-primary);
  color: #fff;
  border: 0;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius);
  font: inherit;
  cursor: pointer;
}
</style>
