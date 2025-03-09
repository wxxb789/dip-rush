# Sidebar Navigation Refactoring Plan

## Overview

Converting the current tab-based navigation in `src/pages/index.tsx` to a sidebar layout with separate pages. This refactoring will improve code organization and user experience while maintaining existing functionality.

## Architecture Changes

### 1. Router Implementation
- Add React Router for page navigation
- Define routes for Screener and Stock Detail pages
- Use URL parameters for passing stock symbols (/stock-detail/:symbol)

### 2. Component Structure

```
src/
├── components/
│   ├── features/          # Feature components remain unchanged
│   ├── layout/           
│   │   ├── MainLayout.tsx # New layout with sidebar
│   │   ├── Header.tsx    # Existing
│   │   └── Footer.tsx    # Existing
│   └── ui/               # UI components including sidebar
├── pages/
│   ├── index.tsx         # New home page with layout
│   ├── screener.tsx      # New screener page
│   └── stock-detail.tsx  # New stock detail page
└── App.tsx              # Updated with router
```

### 3. New Components

#### MainLayout.tsx
```typescript
// Main layout component with sidebar navigation
// Wraps all pages with consistent layout
export function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex">
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/screener">Screener</Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/stock-detail">Stock Detail</Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

### 4. Page Components

#### screener.tsx
- Receives stock selection handler
- Uses router navigation for switching to detail view

#### stock-detail.tsx
- Reads symbol from URL parameters
- Uses existing StockDetailTab functionality

### 5. Navigation Flow

1. User selects stock in screener:
   ```typescript
   const handleResultRowClick = (symbol: string) => {
     selectSymbol(symbol);
     navigate(`/stock-detail/${symbol}`);
   };
   ```

2. Stock detail page loads symbol:
   ```typescript
   const { symbol } = useParams();
   useEffect(() => {
     if (symbol) {
       selectSymbol(symbol);
     }
   }, [symbol]);
   ```

## Implementation Steps

1. Create MainLayout component with sidebar
2. Set up React Router in App.tsx
3. Create new page components
4. Move tab content to respective pages
5. Implement navigation with URL parameters
6. Test functionality across pages

## Migration Strategy

1. Keep existing components working during migration
2. Implement new layout and routing
3. Move functionality page by page
4. Test thoroughly before removing old code

## Testing Considerations

1. Verify all existing functionality works
2. Test navigation between pages
3. Ensure stock selection persists
4. Check responsive behavior
5. Verify i18n support