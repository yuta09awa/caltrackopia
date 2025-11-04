# NutriMap - Health-Focused Food Discovery Platform

A modern web application that helps users discover restaurants, markets, and food options based on their nutritional preferences and dietary needs. Built with React, TypeScript, and powered by Lovable Cloud.

## 🌟 Features

- **Interactive Maps**: Discover restaurants and food vendors using Google Maps integration
- **Smart Search**: Search by ingredients, dietary restrictions, and nutritional goals
- **Shopping Cart**: Multi-location cart with intelligent conflict resolution
- **Nutrition Tracking**: Track nutritional information and set health goals
- **User Profiles**: Manage dietary preferences, allergens, and favorite locations
- **Offline Support**: Progressive Web App (PWA) with offline-first capabilities
- **Role-Based Access**: Different experiences for customers and restaurant owners

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Set up environment variables:
   - Add your Google Maps API key
   - Supabase credentials are configured via Lovable Cloud

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn-ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router v6
- **Maps**: Google Maps API
- **Backend**: Lovable Cloud (Supabase-based)
  - Authentication
  - PostgreSQL Database
  - Edge Functions
  - Storage
- **PWA**: Service Workers, IndexedDB

## 📁 Project Structure

```
src/
├── app/              # App-level configuration (providers, routing, store)
├── features/         # Feature modules (auth, cart, map, locations, etc.)
│   ├── auth/        # Authentication & authorization
│   ├── cart/        # Shopping cart management
│   ├── map/         # Map functionality
│   ├── locations/   # Location discovery
│   ├── profile/     # User profile management
│   └── ...
├── components/       # Shared UI components
├── hooks/           # Shared custom hooks
├── services/        # Service layer (API clients, data services)
├── shared/          # Shared utilities and types
└── pages/           # Route pages

docs/
├── phases/          # Development phase documentation
├── architecture/    # Architecture documentation
└── refactoring/     # Refactoring guidelines
```

## 🎯 Key Concepts

### Feature-First Architecture
Code is organized by feature/domain rather than technical layers. Each feature contains its own components, hooks, services, and types.

### State Management Strategy
- **Zustand**: Global application state (cart, auth, user preferences)
- **TanStack Query**: Server state and caching
- **Local State**: Component-specific state with useState/useReducer

### Service Layer
Standardized service architecture with:
- Base service classes
- Unified error handling
- Quota-aware API services
- Enhanced caching strategies

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component-driven development

## 📚 Documentation

- [Architecture Overview](./docs/architecture/system-overview.md)
- [Refactoring Guidelines](./docs/refactoring/guidelines.md)
- [Phase Documentation](./docs/phases/)
- [Changelog](./CHANGELOG.md)

## 🚀 Deployment

This project is deployed using Lovable:

1. Click the **Publish** button (top-right on desktop, bottom-right on mobile in Preview mode)
2. Your app will be deployed to a Lovable subdomain (e.g., `yoursite.lovable.app`)
3. For custom domains, see [Lovable's domain documentation](https://docs.lovable.dev/user-guides/custom-domains)

### Alternative Deployment Options

You can also deploy to:
- Netlify
- Vercel
- Any static hosting service

Build the app with `npm run build` and deploy the `dist/` folder.

## 🔐 Environment Variables

Required environment variables:

```env
# Google Maps (required for map features)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase (automatically configured with Lovable Cloud)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

See [Refactoring Guidelines](./docs/refactoring/guidelines.md) for code standards.

## 📝 License

This project is created with [Lovable](https://lovable.dev).

## 🆘 Support

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Project URL**: https://lovable.dev/projects/23c5f33e-d895-48be-b1b1-5813d60ad506

---

Built with ❤️ using [Lovable](https://lovable.dev)
