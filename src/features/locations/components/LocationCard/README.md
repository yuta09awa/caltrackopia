# LocationCard Compound Component

A refactored compound component pattern for rendering location cards with full composability.

## Usage

### Basic Usage (Recommended)
```tsx
import LocationCard from '@/features/locations/components/LocationCard';

<LocationCard location={location} isHighlighted={false} />
```

### Advanced Compound Usage
For custom layouts, use the sub-components:

```tsx
import LocationCard from '@/features/locations/components/LocationCard';

<LocationCard.Root location={location} detailLink={`/location/${location.id}`}>
  <div className="flex gap-2">
    <LocationCard.Image images={location.images} name={location.name} />
    <div className="flex-1">
      <LocationCard.Header location={location} />
      <LocationCard.Body 
        location={location} 
        currentHours="9:00 AM - 5:00 PM"
        popularItems={[]}
      />
      <LocationCard.Actions location={location} />
    </div>
  </div>
</LocationCard.Root>
```

## Sub-Components

- `LocationCard.Root` - Wrapper with navigation
- `LocationCard.Image` - Image carousel
- `LocationCard.Header` - Title, rating, badges
- `LocationCard.Body` - Address, hours, popular items
- `LocationCard.Address` - Clickable address for directions
- `LocationCard.Actions` - Call/action buttons

## Props (StandardComponentProps)

All components support:
- `className` - Custom CSS classes
- `loading` - Loading state
- `error` - Error message
- `disabled` - Disabled state
- `testId` - Test identifier
- ...all standard HTML div attributes

## Example with StandardComponentProps

```tsx
<LocationCard 
  location={location}
  className="border-2"
  testId="featured-location"
  loading={isLoading}
  error={error}
/>
```
