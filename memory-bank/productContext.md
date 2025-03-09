# DipRush Project Context

## Project Overview
DipRush is a modern financial application designed for detecting market dips, implemented as a pure frontend TypeScript/React application. The project aims to help retail investors identify potential buying opportunities through technical analysis.

### Key Features
- AKTools API integration for market data
- Technical analysis with multiple indicators (RSI, MACD, Bollinger Bands, Moving Averages)
- Responsive design with multilingual support
- Dark/light mode theming
- Local storage for user preferences

### Technical Stack
- Frontend: React with TypeScript
- Styling: TailwindCSS
- Charts: Recharts/Chart.js
- Data: AKTools API
- Deployment: Cloudflare Pages

## Memory Bank Structure

This Memory Bank contains the following core files:

1. **productContext.md** (this file)
   - Purpose: Project overview and documentation structure
   - Content: Technical stack, features, and Memory Bank organization

2. **activeContext.md**
   - Purpose: Track current development session context
   - Content: Active tasks, recent decisions, and ongoing discussions

3. **progress.md**
   - Purpose: Track project progress and manage tasks
   - Content: Task lists organized by priority (P0, P1, P2) with status tracking

4. **decisionLog.md**
   - Purpose: Document architectural and technical decisions
   - Content: Dated entries with decision context, rationale, and implications

Additionally, at the project root:

5. **TODO.md**
   - Purpose: Long-term planning and feature roadmap
   - Content: High-level tasks and features that need further breakdown
   - Serves as a bridge between strategic planning and tactical implementation

## Architecture Overview

```mermaid
flowchart TB
    Client(Client Browser) --> LocalStorage[(Local Storage)]
    Client --> AKToolsAPI[AKTools API]
    
    subgraph Frontend[Frontend Application]
        UI[UI Components] --> TechAnalysis[Technical Analysis]
        UI --> DataFetching[Data Fetching]
        TechAnalysis --> Indicators[Market Indicators]
        DataFetching --> APIClient[API Client]
    end
    
    APIClient --> AKToolsAPI
    LocalStorage --> UserPrefs[User Preferences]
    UserPrefs --> UI