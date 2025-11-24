# NutriMap Edge API

Production-ready Cloudflare Workers + Turso edge architecture with CDC sync from Supabase.

## Architecture

```
User (Global) → Cloudflare Edge (Sub-50ms)
                ↓
                ├─ READ: Turso (SQLite, Replicated Globally)
                └─ WRITE: Supabase (Source of Truth)
                           ↓
                      Webhook → Worker → Turso Sync
```

## Features

- **Global Restaurant Search** - FTS5 full-text search, geolocation, allergen filtering
- **CDC Sync** - Automatic Supabase → Turso replication via webhooks
- **Disclaimer Tracking** - GDPR-compliant legal acceptance records
- **Edge Caching** - 5-minute edge cache for restaurant data
- **Error Alerting** - Slack/Discord notifications on sync failures

## Setup

### 1. Install Dependencies

```bash
cd workers
npm install
```

### 2. Create Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create production database
turso db create nutrimap-production

# Get credentials
turso db show nutrimap-production --url
turso db tokens create nutrimap-production

# Apply schema
turso db shell nutrimap-production < migrations/001_initial_schema.sql
```

### 3. Configure Secrets

```bash
# Set all required secrets
wrangler secret put TURSO_DB_URL
wrangler secret put TURSO_AUTH_TOKEN
wrangler secret put SYNC_SECRET_KEY     # Generate: openssl rand -hex 32
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SLACK_WEBHOOK_URL   # Optional
```

### 4. Deploy

```bash
# Deploy to Cloudflare
wrangler deploy

# Test health check
curl https://nutrimap-api.your-username.workers.dev/health
```

### 5. Migrate Existing Data

```bash
# One-time migration from Supabase to Turso
npm run migrate:restaurants
```

### 6. Configure Supabase Webhooks

**Supabase Dashboard → Database → Webhooks**

Create 4 webhooks:

**Webhook 1: sync-restaurants-to-turso**
- Table: `cached_places`
- Events: `INSERT`, `UPDATE`, `DELETE`
- Type: `HTTP Request`
- Method: `POST`
- URL: `https://nutrimap-api.your-username.workers.dev/webhooks/sync`
- Headers: `x-service-key: YOUR_SYNC_SECRET_KEY`
- Payload:
```json
{
  "type": "[event.type]",
  "table": "[event.table]",
  "schema": "[event.schema]",
  "record": "[event.record]",
  "old_record": "[event.old_record]"
}
```

Repeat for tables:
- `suppliers`
- `supplier_relationships`
- `allergen_protocols`

## API Endpoints

### Public Endpoints

**GET /health**
```bash
curl "https://your-worker.workers.dev/health"
```

**GET /api/restaurants/search**
```bash
curl "https://your-worker.workers.dev/api/restaurants/search?q=pizza&lat=37.7749&lng=-122.4194&radius=5000"
```

Parameters:
- `q` - Text search (name, address)
- `lat`, `lng` - Geolocation
- `radius` - Search radius in meters (default: 5000)
- `cuisine` - Cuisine type filter
- `priceLevel` - Price range 1-4
- `allergen` - Allergen filter (can be multiple)

**POST /api/disclaimer**
```bash
curl -X POST "https://your-worker.workers.dev/api/disclaimer" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-here",
    "disclaimer_type": "allergen_view",
    "disclaimer_version": "1.0",
    "page_url": "https://nutrimap.com/restaurants/abc"
  }'
```

### Protected Endpoints

**POST /webhooks/sync** (Requires `x-service-key` header)

## Monitoring

### Cloudflare Dashboard
- Workers → Metrics (request count, latency, errors)
- Pages → Analytics (page views, bandwidth)

### Turso Dashboard
- Row reads/writes
- Database size
- Replication lag

### Supabase Dashboard
- Database → Webhooks (delivery success rate)

## Cost Estimation

| Traffic Level | Cloudflare | Turso | Total |
|---------------|------------|-------|-------|
| 100K req/day | $0 | $0 | $0 |
| 1M req/day | $5/mo | $0 | $5/mo |
| 10M req/day | $50/mo | $0 | $50/mo |

## Troubleshooting

**Webhook not syncing?**
1. Check Cloudflare Worker logs: `wrangler tail`
2. Verify `x-service-key` header matches `SYNC_SECRET_KEY`
3. Check Supabase webhook delivery logs

**Search returning no results?**
1. Verify data was migrated: `turso db shell nutrimap-production "SELECT COUNT(*) FROM restaurants;"`
2. Check FTS5 triggers are working
3. Test without geolocation filters

**Disclaimer not recording?**
1. Check user is authenticated
2. Verify all required fields are provided
3. Check Turso table: `SELECT * FROM user_disclaimer_acceptances ORDER BY accepted_at DESC LIMIT 10;`
