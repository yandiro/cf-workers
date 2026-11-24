// Mock "backend" DB. Keyed by host (tenant key).
export interface TenantConfig {
  id: string
  name: string
  origin: string
  theme: { primary: string }
}

export const TENANTS: Record<string, Omit<TenantConfig, 'origin'>> = {
  // local dev
  // nuxt dev
  'localhost:3000': { id: 't_local', name: 'Local Dev Tenant', theme: { primary: '#16a34a' } },
  // wrangler dev
  'localhost:8787': { id: 't_local_wrangler', name: 'Local Wrangler Tenant', theme: { primary: '#0ea5e9' } },

  // Using Cloudflare workers.dev domain
  // Only ONE workers.dev subdomain per app (qa-tulio doesn't work)
  'dev-tulio.tulio-workers-test.workers.dev': { id: 'dev-tulio', name: 'Globex Inc', theme: { primary: '#8b5cf6' } },
  'qa-tulio.tulio-workers-test.workers.dev': { id: 'qa-tulio', name: 'Globex Inc', theme: { primary: '#8b5cf6' } },
  
  /*
   * The folowing domains need a CNAME like this: https://photos.app.goo.gl/fPxx2xFW8VnykpYE6
   */

  // Using noq-servers.net domain
  // I chose to use <franchise>.cf.noq-servers.net but the "cf." is not needed
  // AWS Route 53 CNAME record poinst to "fallback.noq-cf.win", which is managed in CloudFlare 
  'dev-tulio.cf.noq-servers.net': { id: 'dev-tulio1', name: 'Tulio`s Produce', theme: { primary: '#8b5cf6' } },
  'dev-tulio2.cf.noq-servers.net': { id: 'dev-tulio2', name: 'Tulio`s Cuts', theme: { primary: '#f6b85c' } },
  'dev-tulio3.cf.noq-servers.net': { id: 'dev-tulio3', name: 'Tulio`s Fishmonger', theme: { primary: '#5cf685' } },
  
  // Tenant-owned domains
  // AWS Route 53 CNAME record points to "fallback.noq-cf.win", which is managed in CloudFlare 
  'orderonline.freshgroceronline.com': { id: 'fg_online', name: 'Fresh Grocer Online', theme: { primary: '#ef4444' } },
}
