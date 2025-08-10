# Technical Documentation

## Architecture Overview

MyRide follows a modern React architecture with a component-based structure and clear separation of concerns.

### Key Architectural Patterns

1. **Component-Based UI**: Reusable UI components built with React and TypeScript
2. **State Management**: React Query for server state management
3. **Context API**: For global state like authentication
4. **Custom Hooks**: Encapsulated business logic in reusable hooks
5. **Service Layer**: API integrations separated in service modules

## Project Structure Details

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components (shadcn-ui)
│   ├── dashboard/       # Dashboard specific components
│   ├── auth/            # Authentication components
│   └── ...              # Feature-specific components
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useVehicles.ts   # Vehicle data hooks
│   ├── useServiceRecords.ts # Service record hooks
│   └── useCallRecords.ts # Call record hooks
├── pages/               # Page components
│   ├── Index.tsx        # Main dashboard page
│   └── NotFound.tsx     # 404 page
├── services/            # API service integrations
│   └── supabaseService.ts # Supabase integration
├── types/               # TypeScript type definitions
│   ├── vehicle.ts       # Vehicle type definitions
│   ├── serviceRecord.ts # Service record types
│   └── ...              # Other type definitions
├── config/              # Configuration files
│   └── theme.ts         # Theme configuration
└── utils/               # Utility functions
```

## Data Models

### Vehicle
```typescript
interface Vehicle {
  id: string;
  type: 'bike' | 'car';
  bikeModel?: string;
  carModel?: string;
  year: number;
  engineCapacity: number;
  owner: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: string;
  lastServiceKilometers: number;
  currentKilometers: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
```

### ServiceRecord
```typescript
interface Part {
  name: string;
  cost: number;
}

interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  parts: Array<Part>;
  laborCost: number;
  discount: number;
  technician: string;
  notes: string;
  hasCoupon: boolean;
  couponType: string | null;
  kilometers: number;
  serviceCenterName?: string;
}
```

## API Integration

The application uses Supabase as its backend service. All API calls are encapsulated in the service layer:

- `supabaseService.ts` - Main service file for all Supabase integrations
- Custom hooks abstract the API calls for components

## Authentication Flow

1. User visits login page
2. Credentials are validated through Supabase Auth
3. Upon successful login, user profile is fetched
4. JWT token is stored for authenticated requests
5. Protected routes check authentication status

## State Management

### Server State
Managed with React Query:
- `useVehicles()` - Fetch all vehicles
- `useServiceRecords()` - Fetch service records
- `useCallRecords()` - Fetch call records
- Mutations for creating/updating/deleting records

### Client State
Managed with:
- React Context API for global state (authentication)
- Component local state for UI interactions

## Styling

The application uses:
- Tailwind CSS for utility-first styling
- shadcn-ui components built on Radix UI primitives
- Custom CSS classes for specific styling needs

## Routing

React Router is used for navigation:
- `/` - Protected dashboard route
- `/auth` - Authentication page
- `/setup-superadmin` - Super admin setup
- `/reset-password` - Password reset page
- `/*` - 404 Not Found page

## Error Handling

- React Query provides automatic retry mechanisms
- Error boundaries for component-level errors
- Toast notifications for user feedback
- Proper loading states during data fetching

## Performance Considerations

- Code splitting through dynamic imports
- Memoization with `useMemo` for expensive calculations
- Efficient re-rendering with proper dependency arrays
- Lazy loading for non-critical components

## Testing

Testing strategy includes:
- Unit tests for utility functions
- Component tests for UI components
- Integration tests for API interactions
- End-to-end tests for critical user flows

## Deployment

The application is built with Vite and can be deployed as a static site:
1. Run `npm run build` to create production build
2. Deploy the `dist/` folder to any static hosting service
3. Environment variables should be configured in the hosting platform