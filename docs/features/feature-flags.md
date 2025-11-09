# Feature Flags System

## Overview
Phase 2 of the Enterprise Architecture migration introduces a comprehensive feature flag system that enables safe, controlled rollout of new features without redeployment.

## Architecture

### Feature Flag Evaluation Flow

```
┌─────────────────────────────────────────────┐
│ Application Code                            │
│ const { enabled } = useFeatureFlag('flag')  │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ FeatureFlagService (Memory Cached)          │
│ - Check cache (5 min TTL)                   │
│ - Evaluate flag rules                       │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ Supabase feature_flags Table                │
│ - Global enabled/disabled                   │
│ - User-specific access (user_ids[])         │
│ - Regional rollout (regions[])              │
│ - Percentage-based gradual rollout          │
└─────────────────────────────────────────────┘
```

## Features

### 1. Global On/Off
Simple feature enablement for everyone:
```typescript
{ flag_name: 'cache-metrics', enabled: true, rollout_percentage: 100 }
```

### 2. User-Specific Rollout
Enable features for specific users (beta testers, internal team):
```typescript
{ 
  flag_name: 'ai-calorie-tracking', 
  enabled: true,
  user_ids: ['user-uuid-1', 'user-uuid-2']
}
```

### 3. Regional Rollout
Deploy features to specific regions first:
```typescript
{ 
  flag_name: 'enhanced-search', 
  enabled: true,
  regions: ['NA', 'EU']
}
```

### 4. Percentage-Based Gradual Rollout
Roll out to a percentage of users (uses consistent hashing):
```typescript
{ 
  flag_name: 'ai-meal-suggestions', 
  enabled: true,
  rollout_percentage: 25 // 25% of users
}
```

## Usage

### Basic Usage in React Components

```tsx
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function AICalorieTracker() {
  const { enabled, loading } = useFeatureFlag('ai-calorie-tracking');

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!enabled) {
    return null; // Feature hidden
  }

  return <CalorieTrackerUI />;
}
```

### Conditional Rendering

```tsx
function MapScreen() {
  const { enabled: aiSearchEnabled } = useFeatureFlag('enhanced-search');

  return (
    <div>
      {aiSearchEnabled ? (
        <EnhancedSearchBar />
      ) : (
        <StandardSearchBar />
      )}
    </div>
  );
}
```

### With Default Values

```tsx
// Default to enabled while loading (useful for low-risk features)
const { enabled } = useFeatureFlag('cache-metrics-dashboard', true);
```

### Service-Level Usage (Non-React)

```typescript
import { featureFlagService } from '@/services/featureFlags';

async function processData() {
  const userId = getCurrentUserId();
  const aiEnabled = await featureFlagService.isEnabled('ai-processing', userId);

  if (aiEnabled) {
    return await processWithAI(data);
  } else {
    return await processStandard(data);
  }
}
```

## Managing Feature Flags

### Via Developer Panel (Dev Mode)
The Feature Flags Panel appears automatically in development mode alongside the Cache Metrics Panel:

**Location:**
- Mobile: Bottom-right corner
- Desktop: Bottom-right corner (separate from cache panel)

**Features:**
- View all flags and their status
- Toggle flags on/off (requires admin role)
- See rollout percentage, user count, and regions
- Real-time refresh

### Via Supabase Dashboard

Directly edit the `feature_flags` table:
```sql
-- Enable a flag globally
UPDATE feature_flags 
SET enabled = true, rollout_percentage = 100
WHERE flag_name = 'ai-calorie-tracking';

-- Enable for 50% of users
UPDATE feature_flags 
SET enabled = true, rollout_percentage = 50
WHERE flag_name = 'enhanced-search';

-- Enable for specific users
UPDATE feature_flags 
SET enabled = true, user_ids = ARRAY['user-uuid-1', 'user-uuid-2']::uuid[]
WHERE flag_name = 'ai-meal-suggestions';

-- Regional rollout
UPDATE feature_flags 
SET enabled = true, regions = ARRAY['NA', 'EU']
WHERE flag_name = 'new-payment-method';
```

### Via API (Admin Only)

```typescript
import { featureFlagService } from '@/services/featureFlags';

// Toggle a flag
await featureFlagService.toggleFlag('ai-calorie-tracking');

// Update flag settings
await featureFlagService.updateFlag('enhanced-search', {
  enabled: true,
  rollout_percentage: 75,
  regions: ['NA', 'EU', 'APAC']
});

// Create a new flag
await featureFlagService.createFlag({
  flag_name: 'new-feature',
  enabled: false,
  description: 'Description of new feature',
  user_ids: [],
  regions: [],
  rollout_percentage: 0
});
```

## Pre-Configured Flags

The system comes with 4 initial feature flags:

| Flag Name | Description | Default State |
|-----------|-------------|---------------|
| `ai-calorie-tracking` | AI-powered calorie tracking | Disabled (0%) |
| `ai-meal-suggestions` | AI-generated meal suggestions | Disabled (0%) |
| `enhanced-search` | AI-powered map search | Disabled (0%) |
| `cache-metrics-dashboard` | Dev mode cache panel | Enabled (100%) |

## Rollout Strategies

### Strategy 1: Internal Beta → Public Launch
```
1. Create flag (enabled: false, rollout: 0%)
2. Enable for internal team (user_ids: [team members])
3. Enable for beta users (rollout: 10%)
4. Gradual increase (25% → 50% → 75%)
5. Full launch (rollout: 100%)
```

### Strategy 2: Regional Staged Rollout
```
1. Launch in test region (regions: ['NA'])
2. Monitor metrics for 1 week
3. Expand to more regions (regions: ['NA', 'EU'])
4. Full global launch (regions: [], rollout: 100%)
```

### Strategy 3: A/B Testing
```
1. Create two flags: feature-a, feature-b
2. Set both to rollout: 50%
3. Use different hash seeds to ensure no overlap
4. Measure performance and user engagement
5. Winner becomes default
```

## Performance

### Caching
- Flags cached in memory for 5 minutes
- Cache invalidated on flag updates
- No database query on cache hit

### Evaluation Speed
- Cache hit: ~0.1ms
- Cache miss: ~50-100ms (Supabase query)
- User-specific check: +0.01ms (array lookup)
- Percentage hash: +0.05ms (hash calculation)

### Network Efficiency
- Flags loaded once per 5 minutes
- Single query fetches all flags
- No per-flag database queries

## Security

### Row-Level Security (RLS)
```sql
-- Everyone can read flags
CREATE POLICY "Anyone can read feature flags"
ON feature_flags FOR SELECT USING (true);

-- Only admins can modify flags
CREATE POLICY "Admins can update feature flags"
ON feature_flags FOR UPDATE
USING (is_admin(auth.uid()));
```

### Admin-Only Operations
- Creating flags
- Updating flags
- Deleting flags
- Toggling flag state

### Safe Defaults
- Flags default to `enabled: false`
- Errors fail open (return `false`)
- Unknown flags return `false`

## Testing

### Manual Testing
1. Open dev tools console
2. Check logs: `[FeatureFlag] flag-name: enabled/disabled`
3. Use Feature Flags Panel to toggle flags
4. Verify feature appears/disappears

### Unit Testing
```typescript
import { featureFlagService } from '@/services/featureFlags';

test('should enable flag for specific user', async () => {
  await featureFlagService.updateFlag('test-flag', {
    enabled: true,
    user_ids: ['user-123'],
  });

  const enabled = await featureFlagService.isEnabled('test-flag', 'user-123');
  expect(enabled).toBe(true);

  const notEnabled = await featureFlagService.isEnabled('test-flag', 'user-456');
  expect(notEnabled).toBe(false);
});
```

### E2E Testing
```typescript
// Cypress example
cy.intercept('GET', '**/feature_flags*', {
  statusCode: 200,
  body: [
    { flag_name: 'test-feature', enabled: true, rollout_percentage: 100 }
  ]
});

cy.visit('/map');
cy.get('[data-testid="ai-calorie-tracker"]').should('exist');
```

## Troubleshooting

### Flag Not Working
1. Check flag exists in database: `SELECT * FROM feature_flags WHERE flag_name = 'flag-name'`
2. Verify flag is enabled: `enabled = true`
3. Check rollout settings (percentage, user_ids, regions)
4. Clear cache: `featureFlagService.invalidateCache()`
5. Check console logs for evaluation results

### Permission Denied When Toggling
- Ensure user has admin role: `SELECT * FROM user_roles WHERE user_id = 'your-user-id'`
- Grant admin role: `INSERT INTO user_roles (user_id, role, approved) VALUES ('your-user-id', 'admin', true)`

### Inconsistent Flag Behavior
- Percentage-based rollout uses consistent hashing (same user always gets same result)
- If behavior seems random, check rollout_percentage
- User-specific flags override percentage rollout

## Best Practices

1. **Use Descriptive Names**: `ai-calorie-tracking` not `feature1`
2. **Add Descriptions**: Help team understand what the flag controls
3. **Start Small**: Begin with 0-10% rollout, increase gradually
4. **Monitor Metrics**: Track performance and errors during rollout
5. **Clean Up Old Flags**: Remove flags for fully-launched features
6. **Document Dependencies**: Note if flags depend on other flags
7. **Test Both States**: Verify feature works when enabled AND disabled

## Future Enhancements

- [ ] Flag dependencies (flag A requires flag B)
- [ ] Time-based automatic rollout schedules
- [ ] Metrics dashboard (track flag usage and performance)
- [ ] User feedback collection per flag
- [ ] Flag override for testing (query param: `?flag=name:true`)
- [ ] Multi-variant flags (A/B/C testing)
- [ ] Flag audit log (who changed what, when)

## Related Files

- `src/services/featureFlags/FeatureFlagService.ts` - Core service
- `src/hooks/useFeatureFlag.ts` - React hook
- `src/features/map/components/FeatureFlagsPanel.tsx` - Dev UI
- Database table: `public.feature_flags`

## Support

For issues or questions:
1. Check console logs for flag evaluation
2. Verify database state in Supabase dashboard
3. Review this documentation
4. Check code examples above
