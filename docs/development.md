# Developer Setup Guide

This guide will help developers set up and contribute to the MyRide Vehicle Service Management System.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (version 7 or higher) or yarn
- Git
- A code editor (VS Code recommended)

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-ride-admin
```

### 2. Install Dependencies
Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Project Structure

```
.
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── docs/               # Documentation
├── tests/              # Test files
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Development Workflow

### Creating Components
1. Create a new component in the appropriate directory under `src/components/`
2. Use TypeScript for type safety
3. Follow the existing component structure and styling patterns
4. Export the component for use in other files

### Adding New Pages
1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Ensure proper authentication protection if needed

### Working with APIs
1. Add new service functions in `src/services/`
2. Create corresponding hooks in `src/hooks/`
3. Use React Query for data fetching and caching

### Styling
1. Use Tailwind CSS classes for styling
2. Leverage shadcn-ui components when possible
3. Create custom components in `src/components/ui/` when needed

## Code Standards

### TypeScript
- Use TypeScript for all new components and functions
- Define interfaces for props and state
- Use proper typing for API responses

### Component Structure
```tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface ComponentNameProps {
  // Define props interface
}

const ComponentName: React.FC<ComponentNameProps> = ({ prop }) => {
  // Component implementation
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Hooks
- Create custom hooks for reusable logic
- Place hooks in `src/hooks/`
- Follow the `use` prefix naming convention

### Services
- Encapsulate API calls in service files
- Place services in `src/services/`
- Handle errors appropriately

## Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
1. Create test files with `.test.tsx` extension
2. Place tests alongside the components they test
3. Use React Testing Library for component tests
4. Use Jest for unit tests

### Test Structure
```tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

## Git Workflow

### Branching Strategy
- `main` - Production code
- `develop` - Development code
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Commit Messages
Follow conventional commit format:
- `feat: Add new feature`
- `fix: Resolve bug`
- `docs: Update documentation`
- `refactor: Restructure code`
- `test: Add tests`

### Pull Requests
1. Create a PR from your feature branch to `develop`
2. Ensure all tests pass
3. Get code review from team members
4. Merge after approval

## Database Setup

### Local Development
For local development, you can:
1. Set up a Supabase project
2. Use Supabase local development CLI
3. Configure environment variables to point to your local instance

### Database Schema
Refer to the API documentation for database schema definitions.

## Deployment

### Building for Production
```bash
npm run build
```

### Previewing Production Build
```bash
npm run preview
```

### Deployment Platforms
The application can be deployed to:
- Vercel
- Netlify
- AWS S3
- Any static hosting provider

## Troubleshooting

### Common Issues

1. **Dependency Installation Failures**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors**
   - Check type definitions in `src/types/`
   - Ensure all props are properly typed
   - Run `npm run lint` to identify issues

3. **Styling Issues**
   - Verify Tailwind CSS classes are correctly applied
   - Check for conflicting styles
   - Ensure shadcn-ui components are properly imported

4. **API Connection Issues**
   - Verify environment variables are correctly set
   - Check network connectivity
   - Ensure Supabase project is properly configured

### Debugging
- Use browser developer tools
- Check the console for error messages
- Use React DevTools for component inspection
- Enable React Query DevTools for data fetching debugging

## Contributing

### Code Review Process
1. All code changes require review
2. At least one team member must approve PRs
3. Automated tests must pass
4. Code must follow established standards

### Reporting Issues
1. Use the issue tracker
2. Provide detailed reproduction steps
3. Include environment information
4. Attach screenshots if applicable

### Feature Requests
1. Create an issue with detailed description
2. Discuss with the team before implementation
3. Follow the established architecture patterns

## Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.io/docs)