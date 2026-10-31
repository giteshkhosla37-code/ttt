# EcoPulse Frontend

A responsive React + Vite prototype for the EcoPulse carbon-aware energy optimization project.

## Requirements
- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run locally
```bash
cd EcoPulse
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Included screens
- Overview dashboard
- AI demand, occupancy and solar forecasting
- MPC optimization recommendations and safety constraints
- Battery and storage management
- HVAC comfort management
- Smart load prioritization
- Carbon intelligence and cleaner-energy windows
- Digital Twin campus scenario comparison
- Grid outage / islanding simulation
- Anomaly detection
- Reports and success metrics

## Current data status
All displayed readings, forecasts, savings, model scores and alerts are **illustrative sample data**. They are for UI review and demonstration only, not operational control or validated performance claims.

## Backend integration plan
The frontend is currently self-contained so the team leader can review it without a backend. Later, replace sample values with FastAPI responses. Suggested API contracts:

- `GET /api/v1/overview`
- `GET /api/v1/forecasts?type=demand&horizon=24h`
- `GET /api/v1/optimization/recommendations`
- `POST /api/v1/optimization/simulate`
- `GET /api/v1/battery/status`
- `GET /api/v1/buildings`
- `POST /api/v1/simulation/outage`
- `GET /api/v1/anomalies`
- `GET /api/v1/reports/summary`

Keep critical-load protection, comfort bounds, battery SOC limits and human approval as backend-enforced constraints. The browser UI must never be the only safety layer.

## Suggested team workflow
Create a feature branch for frontend work, commit changes regularly, and merge through pull requests. Coordinate API field names with the backend and forecasting members before integration.

## Visual direction — Apple Red / Porcelain

The frontend uses apple red (`#c9283e`), off-white (`#f8f5f0`), porcelain panels
and warm ink. Chart colors and legends follow the same palette; success,
warning and severity indicators retain distinct semantic colors.

## Motion

- Continuous background: drifting red/rose gradients, moving dot grid and slow orbit lines.
- All 11 navigation screens: 150 ms zoom-out/fade, then 440 ms zoom-in/fade.
- Forecast type, chart range, load filters, anomaly filters, twin scenarios and report period use the same transition controller.
- Fast repeated clicks cancel the previous pending swap and open the latest selection.
- A compact two-line menu icon in the header replaces the always-visible tab row.
- The icon morphs into a close control as a layered red/off-white circular reveal opens the full-screen menu.
- All 11 destinations appear in three groups, with staggered link entrances and hover growth.
- Selecting a destination closes the menu and opens its screen; the current destination is highlighted.
- Native modal focus containment, Escape-to-close, focus restoration and background scroll locking are included.
- On phones the menu has its own scroll area and a persistent close header.
- Menu motion is inspired by the supplied reference; the clip does not include a fully opened menu to reproduce exactly.
- Tabs, cards, panels and information rows grow on hover on devices with a mouse.
- IntersectionObserver reveals text and rows from above as they enter the viewport, with short top-to-bottom staggering.
- Offscreen content stays unrevealed until reached; each item reveals once per screen visit.
- Newly inserted filter/chart content is registered automatically; reduced-motion changes are handled live.
- System reduced-motion settings disable decorative movement and make view changes immediate.
- Background layers are decorative, ignore pointer events and stay behind dashboard content.

The page motion controller (`useAnimatedValue`) is in `src/App.jsx`. Menu and scroll-reveal controllers are in `src/Motion.jsx`. Palette tokens,
background effects and keyframes are in `src/styles.css`. No animation dependency is required.

## Validation

Run `npm run build` to generate the production bundle in `dist/`.
The Vite configuration also accepts the managed preview hostname `terminal.local`.

Browser checks cover all 11 menu destinations, Escape-to-close, progressive scroll reveals,
and a 390 px phone-width menu including lower-link navigation.
