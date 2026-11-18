<script setup lang="ts">
/** Maps to .env:NUXT_PUBLIC_APP_ENV */
const { appEnv } = useRuntimeConfig().public
const tenant = useState<{ id: string; name: string; origin: string; fetchedAt: string; theme: { primary: string } } | null>('tenant')

useHead({ title: () => tenant.value?.name ?? 'Unknown tenant' })
</script>

<template>
  <main v-if="tenant" :style="{ fontFamily: 'system-ui', padding: '2rem', borderTop: `6px solid ${tenant.theme.primary}` }">
    <h1>{{ tenant.name }}</h1>
    <dl>
      <dt>Environment</dt><dd>{{ appEnv }}</dd>
      <dt>ID</dt><dd>{{ tenant.id }}</dd>
      <dt>Origin</dt><dd>{{ tenant.origin }}</dd>
      <dt>Fetched from backend at</dt><dd>{{ tenant.fetchedAt }}</dd>
    </dl>
  </main>
  <main v-else>No tenant</main>
</template>
