# NutriMap Cloudflare Workers API

Edge-first API layer using Cloudflare Workers + Turso (SQLite) for global performance.

## Prerequisites

1. **Cloudflare Account** (free tier): https://dash.cloudflare.com/sign-up
2. **Turso Account** (free tier): https://turso.tech

## Setup Instructions

### 1. Install Dependencies

```bash
cd workers
npm install
```

### 2. Create Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth signup

# Create database
turso db create nutrimap-production

# Get connection details
turso db show nutrimap-production
# Copy the URL (libsql://nutrimap-production-yourname.turso.io)

# Create auth token
turso db tokens create nutrimap-production
# Copy the token (starts with eyJ...)
```

### 3. Configure Secrets

```bash
# Set Turso credentials
wrangler secret put TURSO_DB_URL
# Paste: libsql://nutrimap-production-yourname.turso.io

wrangler secret put TURSO_AUTH_TOKEN
# Paste: your-token-from-above

# Set Supabase credentials (from your .env)
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
```

### 4. Run Locally

```bash
npm run dev
```

Visit:
- http://localhost:8787/ - Root endpoint
- http://localhost:8787/health - Health check
- http://localhost:8787/db-test - Turso connection test

### 5. Deploy to Cloudflare

```bash
npm run deploy
```

Your API will be live at: `https://nutrimap-api.your-username.workers.dev`

## Testing the Deployment

```bash
# Health check (should return edge location)
curl https://nutrimap-api.your-username.workers.dev/health

# Database test (should return successful connection)
curl https://nutrimap-api.your-username.workers.dev/db-test
```

## Next Steps

1. **Custom Domain Setup**:
   - Add domain in Cloudflare Dashboard
   - Update `wrangler.toml` routes section
   - Deploy with custom domain (e.g., api.nutrimap.com)

2. **Migrate Restaurant Search** (Phase 2):
   - Create Turso schema for restaurants
   - Implement `/restaurants/search` endpoint
   - Migrate data from Supabase

3. **Add Authentication**:
   - Verify Supabase JWT tokens in Workers
   - Protect endpoints with auth middleware

## Cost

- **Cloudflare Workers**: FREE for 100,000 requests/day (~3M/month)
- **Turso**: FREE for 9GB storage, 1 billion row reads/month

Total: **$0/month** until significant scale 🎉

## Troubleshooting

**Error: "Missing TURSO_DB_URL"**
- Run `wrangler secret put TURSO_DB_URL` and set the value

**Error: "Network request failed"**
- Check Turso database is active: `turso db show nutrimap-production`
- Verify auth token is valid: `turso db tokens create nutrimap-production`

**CORS errors in browser**
- CORS is configured for all origins in development
- Update `src/index.ts` cors config for production

## Documentation

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Turso Docs](https://docs.turso.tech/)
- [Hono Framework](https://hono.dev/)
