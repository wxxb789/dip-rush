# Project Summary

DipRush is a financial application designed to assist retail investors in detecting market dips through advanced technical analysis tools. By leveraging integration with the AKTools service, the application provides real-time stock data and visualizations, empowering users to make informed trading decisions. The main objective of DipRush is to streamline the stock screening process, focusing on identifying buying opportunities during market dips and making professional-grade analytical tools accessible and user-friendly. The application improves upon traditional screening methods by utilizing a predefined list of high-volume stocks and ETFs, enhancing the efficiency and relevance of market analysis for retail investors.

# Project Module Description

## Functional Modules

1. **Market Screening Tool**

   - The app identifies stocks that meet specific technical criteria, such as:
     - RSI below 30 (indicating potential oversold conditions)
     - MACD showing bullish reversals
     - Prices crossing below the lower Bollinger Band
     - The 50-day moving average crossing above the 200-day moving average (Golden Cross)
   - Results are displayed in a sortable table format along with meaningful messages when no matches are found.

2. **Data Visualization**

   - Visualization of stock data trends and technical indicators using interactive charts, allowing users to analyze potential dip opportunities.

3. **Responsive Design**

   - The application is built to be accessible on various devices, including mobile, tablet, and desktop.

4. **Internationalization Support**

   - The user interface supports both English and Chinese languages, easily toggled by the user.

5. **Theme Customization**
   - Users can toggle between dark and light modes, adapting the application interface to their preferences.

# Directory Tree

```plaintext
.
+-- .gitignore
+-- .roomodes
+-- README.md
+-- biome.json
+-- components.json
+-- docs
|   +-- WIKI.md
|   +-- aktools.llm.txt
|   +-- diprush_class_diagram.mermaid
|   +-- diprush_prd.md
|   +-- diprush_sequence_diagram.mermaid
|   +-- diprush_system_design.md
|   +-- target_assets.md
|   +-- TODO.md
+-- index.html
+-- memory-bank
|   +-- activeContext.md
|   +-- decisionLog.md
|   +-- productContext.md
|   +-- progress.md
+-- package.json
+-- public
|   +-- locales
|   |   +-- en
|   |   |   +-- common.json
|   |   +-- zh
|   |       +-- common.json
|   +-- vite.svg
+-- src
|   +-- App.css
|   +-- App.tsx
|   +-- assets
|   |   +-- react.svg
|   +-- components
|   |   +-- charts
|   |   |   +-- StockChart.tsx
|   |   +-- layout
|   |   |   +-- Footer.tsx
|   |   |   +-- Header.tsx
|   |   +-- tables
|   |   |   +-- ResultsTable.tsx
|   |   +-- ui
|   |       +-- accordion.tsx
|   |       +-- alert-dialog.tsx
|   |       +-- alert.tsx
|   |       +-- aspect-ratio.tsx
|   |       +-- avatar.tsx
|   |       +-- badge.tsx
|   |       +-- badge.variants.ts
|   |       +-- button.tsx
|   |       +-- button.variants.ts
|   |       +-- [... other UI components]
|   +-- constants
|   |   +-- defaultAssets.ts
|   +-- context
|   |   +-- LanguageContext.tsx
|   |   +-- ThemeContext.tsx
|   +-- hooks
|   |   +-- use-mobile.ts
|   |   +-- useLocalStorage.ts
|   |   +-- useTechnicalAnalysis.ts
|   +-- lib
|   |   +-- utils.ts
|   +-- main.tsx
|   +-- pages
|   |   +-- index.tsx
|   +-- services
|   |   +-- aktools
|   |   |   +-- AKToolsClient.ts
|   |   +-- analyticsService.ts
|   |   +-- market
|   |       +-- MarketDataProvider.ts
|   +-- types
|   |   +-- api.ts
|   |   +-- indicators.ts
|   |   +-- ui.ts
|   +-- utils
|   |   +-- formatters.ts
|   |   +-- indicators.ts
|   |   +-- validators.ts
|   +-- vite-env.d.ts
+-- tailwind.config.js
+-- template_config.json
+-- tsconfig.app.json
+-- tsconfig.json
+-- tsconfig.node.json
+-- vite.config.ts
```

# File Description Inventory

- `diprush_prd.md`: Contains the product requirement document detailing the core functionalities and requirements of the DipRush application.
- `diprush_system_design.md`: Details the system design including the chosen technologies, architecture, and implementation approach.
- `diprush_class_diagram.mermaid`: A class diagram showing components, services, and data structures.
- `diprush_sequence_diagram.mermaid`: A sequence diagram illustrating user interactions and system processes.
- `target_assets.md`: Documentation of selected 10 assets with justifications.
- `defaultAssets.ts`: Default assets configuration for the application.
- `MarketDataProvider.ts`: Service for handling market data operations and API integrations.
- `AKToolsClient.ts`: Client for interacting with AK Tools service.
- `memory-bank/*.md`: Project management and documentation files tracking progress, decisions, and context.

# Technology Stack

- **Frontend**: React with Vite, TypeScript
- **Styling**: TailwindCSS
- **UI Components**: ShadcnUI
- **Data Visualization**: Chart.js
- **State Management**: React Context API and external libraries like SWR
- **Backend Services**: Integration with AKTools API
- **Testing**: Jest, React Testing Library
- **Deployment**: Cloudflare Pages

# Usage

## Install Dependencies

To install all the necessary dependencies for the project, run:

```bash
pnpm i
pnpm i chart.js react-chartjs-2 axios
```

## Build

To build the project for production, you can run:

```bash
pnpm run build
```

## Run

To start the development server, execute:

```bash
pnpm run dev
```

Project root is located at `q:/repos/dip-rush`
