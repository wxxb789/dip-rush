# System Patterns

## Architectural Patterns

### Frontend Architecture
DipRush follows a modern React application architecture with clear separation of concerns:

1. **Component-Based Architecture**
   - UI components in `/src/components/`
   - Page components in `/src/pages/`
   - Reusable layouts in `/src/components/layout/`

2. **Feature-First Organization**
   - Feature modules encapsulate related components, hooks, and utilities
   - Examples: screener, technical analysis, theme management

3. **Context API for State Management**
   - Global state managed through React Context
   - Context providers at the application root
   - Custom hooks for consuming context

### Data Flow Patterns

1. **Custom Hooks for Data Operations**
   - `useTechnicalAnalysis` for market data calculations
   - Encapsulation of complex business logic in hooks

2. **Service Layer Pattern**
   - API clients in `/src/services/`
   - Abstraction over external data providers (AKTools)

3. **Adapter Pattern for API Integration**
   - Data adapters for mapping external API responses
   - Consistent internal data structures

## Code Patterns

### Component Patterns

1. **Functional Components**
   - React functional components with hooks
   - Props typing with TypeScript interfaces
   - Example: `ScreenerPage` using hooks for navigation, i18n

2. **Composition Over Inheritance**
   - Component composition for UI assembly
   - Higher-order components when needed

3. **Container/Presentation Pattern**
   - Container components handle logic
   - Presentation components focus on UI

### State Management Patterns

1. **Context + Hooks Pattern**
   - Context API for global state
   - Custom hooks for accessing context
   - Examples: `ThemeContext`, `LanguageContext`

2. **Local State Management**
   - Component-level state with `useState`
   - Effect management with `useEffect`

3. **Persistent State**
   - `useLocalStorage` hook for client-side persistence
   - Preference data like theme choice stored locally

### UI Patterns

1. **Responsive Design**
   - TailwindCSS utility classes
   - Mobile-first approach
   - Media query handling in theme detection

2. **Theme Management**
   - CSS classes for theming (light/dark)
   - System preference detection
   - User preference override

3. **Internationalization**
   - i18next integration
   - Translation files in `/src/locales/`
   - Translation keys for all user-facing text

## Technical Patterns

### TypeScript Patterns

1. **Type Definitions**
   - Dedicated `/src/types/` directory
   - Interface-driven development
   - Props interfaces for components

2. **Type Safety**
   - Strict type checking
   - Generic types for reusable components
   - Type guards when necessary

### API Integration

1. **API Client Pattern**
   - Centralized API client services
   - Interface-based design for provider switching
   - Error handling and response normalization

2. **Data Fetching Patterns**
   - Async data loading
   - Suspense for loading states
   - Error boundaries for failure handling

### Routing Patterns

1. **Declarative Routing**
   - React Router with declarative route definitions
   - Nested routes for related pages
   - Route parameters for dynamic content

## Testing Patterns

1. **Unit Testing**
   - Component testing with Vitest
   - Hook testing with custom test utilities
   - Service mocking for isolated tests

2. **Integration Testing**
   - Page-level testing
   - Router integration testing
   - Context provider testing

## Development Patterns

1. **Code Quality Tooling**
   - Biome for linting and formatting
   - TypeScript for static type checking
   - Consistent code style

2. **Build Process**
   - Vite for fast development and bundling
   - TypeScript configuration for the project
   - Environment variable management

This document serves as a reference for the system patterns used in the DipRush application. It should be updated as the system evolves and new patterns emerge.