// Mock "backend" DB. Keyed by host (tenant key).
export interface TenantConfig {
  id: string
  name: string
  origin: string
  theme: { primary: string }
}

export const TENANTS: Record<string, Omit<TenantConfig, 'origin'>> = {
  // local dev (nuxt dev / wrangler dev)
  'localhost:3000': { id: 't_local', name: 'Local Dev Tenant', theme: { primary: '#16a34a' } },
  'localhost:8787': { id: 't_local_wrangler', name: 'Local Wrangler Tenant', theme: { primary: '#0ea5e9' } },

  // shared domain subdomains (dev / qa)
  'dev-tulio-workers-test.noq-servers.net': { id: 't_acme', name: 'Acme Corp', theme: { primary: '#ef4444' } },
  'qa-tulio-workers-test.noq-servers.net': { id: 't_acme', name: 'Acme Corp', theme: { primary: '#ef4444' } },
  'tulio-workers-test.noq-servers.net': { id: 'tulio-workers-test', name: 'Globex Inc', theme: { primary: '#8b5cf6' } },
  
  // tenant-owned domains (do we have any??)
  'app.acme.com': { id: 't_acme', name: 'Acme Corp', theme: { primary: '#ef4444' } },
  'portal.globex.io': { id: 't_globex', name: 'Globex Inc', theme: { primary: '#8b5cf6' } },
}
