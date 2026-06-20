# Cloudflare One Architecture Builder

Interactive visual walkthrough for building Cloudflare One (SASE and Zero Trust) architectures. Users drag-and-drop infrastructure and user components onto a canvas, then connect them through Cloudflare's global network using real connectivity options.

Built as a Cloudflare Worker with static assets. No frameworks, no build step for the frontend.

## Features

- **Drag-and-drop canvas** with infrastructure (Data Center, AWS, GCP, Azure, SaaS, Email Provider, MCP Server, Cloudflare Workers, Branch Office) and user components (Remote Worker, Office Worker, Contractor/BYOD, IoT/Devices, AI Agent, Visitors/Guests)
- **19 connectivity options** matching [Cloudflare's connectivity documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectivity-options/): Cloudflare Tunnel, Cloudflare One Client, Cloudflare Mesh, Workers VPC, Private Origin Routing, IPsec, GRE, CNI, Multi-Cloud Networking, DNS Location, Proxy Endpoint, Clientless RBI, Cloudflare One Appliance, Access SSO, CASB API, Mutual TLS, MCP Server Portal, Email Security (API/BCC), Email Security (MX/Inline)
- **Quick Start Templates** (collapsible) for common use cases: VPN Replacement, Secure Internet Traffic, Multi-Cloud, Branch SD-WAN, Private Origins, Agentic AI Access, Holistic AI Security, Clientless Contractor Access
- **Full SASE button** that populates a complete sample architecture with relevant connections to reach 100%
- **Export diagram** as PNG (raster, 2x resolution) or SVG (vector, scalable) via dropdown menu
- **Per-element remove** via X button on hover
- **Detail panel** showing compatible connectors, active connections, and documentation links to Cloudflare Developer Docs
- **Gamification** with progress tracking and 10 achievements
- **Connection line spreading** so multiple connections from one element are visually distinct
- **Dark and light themes** with OS preference auto-detection

## Project Structure

```
.
├── src/
│   └── index.ts                    # Cloudflare Worker (serves assets + security headers)
├── public/
│   ├── index.html                  # Single-page application shell
│   ├── llms.txt                    # Agentic browsing metadata
│   ├── css/
│   │   └── app.css                 # Styles (dark and light themes, blueprint grid, animations)
│   └── js/
│       ├── app.js                  # Entry point — thin orchestrator, renderAll, init
│       ├── data/
│       │   ├── components.js       # Component definitions (infra + user elements)
│       │   ├── connectors.js       # Connector definitions (19 connectivity options)
│       │   ├── templates.js        # Use case templates (VPN replacement, Private Origins, AI security, etc.)
│       │   └── achievements.js     # Achievement definitions (10 milestones)
│       ├── engine/
│       │   ├── state.js            # State object + mutations (add/remove/reset)
│       │   ├── connections.js      # SVG connection line rendering (Bezier curves)
│       │   └── progress.js         # Progress bar + achievement checking
│       ├── ui/
│       │   ├── toast.js            # Toast notification system
│       │   ├── theme-toggle.js     # Dark/light theme toggle
│       │   ├── drag-drop.js        # Drag-and-drop from sidebar to canvas
│       │   ├── sidebar.js          # Sidebar clicks, connector buttons, templates
│       │   ├── detail-panel.js     # Right panel (info, docs, connections)
│       │   ├── canvas.js           # Placed elements rendering + in-canvas drag
│       │   ├── onboarding.js       # Onboarding overlay
│       │   └── export-image.js     # Export diagram as PNG or SVG
│       └── presets/
│           └── full-sase.js        # Full SASE architecture preset
├── wrangler.jsonc                  # Wrangler config (assets binding, SPA routing, observability)
├── tsconfig.json                   # TypeScript configuration
├── vitest.config.mjs               # Workers Vitest configuration
├── worker-configuration.d.ts       # Auto-generated types from `wrangler types`
└── package.json
```

## Architecture

### Modular Frontend

The frontend is vanilla JavaScript with **no build step**. Modules communicate via a shared `window.App` namespace. Each file registers its exports on `window.App` and reads dependencies from it. Script load order in `index.html` ensures dependencies are available.

| Layer | Files | Responsibility |
|---|---|---|
| **Data** | `data/*.js` | Pure data objects — components, connectors, templates, achievements. No DOM access. Edit these to add/remove/modify content. |
| **Engine** | `engine/*.js` | State management, SVG rendering, progress tracking. Core logic with no setup/event binding. |
| **UI** | `ui/*.js` | DOM event handlers, rendering functions. Each file owns one UI concern (drag-drop, sidebar, detail panel, canvas, toasts, onboarding, export). |
| **Presets** | `presets/*.js` | Predefined architecture layouts (Full SASE). Add new preset files here. |
| **App** | `app.js` | Thin orchestrator — defines `renderAll()`, wires up reset/deselect, calls all `setup*()` functions on `DOMContentLoaded`. |

### Worker (`src/index.ts`)

Minimal TypeScript Worker that serves static assets via the `ASSETS` binding and adds security headers (`CSP`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). Uses `satisfies ExportedHandler<Env>` with the generated `Env` type.

The Wrangler Static Assets configuration uses `not_found_handling: "single-page-application"` so deep links serve `index.html`, and `run_worker_first: true` so the Worker consistently applies security headers before asset responses.

This project intentionally uses Wrangler Static Assets rather than the Cloudflare Vite plugin because the frontend has no Vite build step. If the frontend is later migrated to a Vite or framework build, add `@cloudflare/vite-plugin` and update the asset directory to the generated build output.

### Connection Line Rendering

Lines are drawn as SVG `<path>` elements using quadratic Bezier curves (`Q` command). Each line runs from the component position to the nearest point on the Cloudflare network circle edge (computed via unit vector * radius). When multiple connections originate from the same element, a perpendicular spread offset fans them apart so all lines remain visible.

### Export

The export dropdown (PNG / SVG) lives in `ui/export-image.js`:

- **PNG**: Renders to an offscreen `<canvas>` at 2x device pixel ratio for crisp output. SVG icons are pre-loaded as `Image` objects via blob URLs before drawing to ensure they appear in the final bitmap.
- **SVG**: Builds a standalone SVG document string with embedded elements, connection paths, and the Cloudflare Network node. Fully scalable — suitable for presentations and print.

Both formats respect the current theme (dark / light).

## Development

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/DavidJKTofan/cf-cloudflare-one-architecture-builder-demo)

```bash
npm install
npm run dev        # Start local dev server (wrangler dev)
npm run check      # TypeScript type-check
npm run test       # Run Workers runtime tests
npm run types      # Regenerate Env types from wrangler.jsonc
npx wrangler deploy --dry-run  # Validate deployment without publishing
npm run deploy     # Deploy to Cloudflare Workers
```

### Adding a New Component

1. Add an entry to `public/js/data/components.js`
2. Add a sidebar button in `public/index.html` (section 1 or 2)
3. Optionally update templates in `public/js/data/templates.js`

### Adding a New Connector

1. Add an entry to `public/js/data/connectors.js`
2. Add a sidebar button in `public/index.html` (section 3)
3. Add a CSS variable in `public/css/app.css` (`:root` block)
4. Add the connector key to relevant components' `compatibleConnectors` arrays

### Adding a New Template

1. Add an entry to `public/js/data/templates.js`
2. Add a button in `public/index.html` (inside `#templatesGroup`)

### Adding a New Preset

1. Create a new file in `public/js/presets/`
2. Add a `<script>` tag in `index.html` (before `app.js`)
3. Wire up the button in `app.js` or in the preset file itself

## Connectivity Options Reference

Based on [Cloudflare One Connectivity Options](https://developers.cloudflare.com/cloudflare-one/networks/connectivity-options/) and [SASE Reference Architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/).

| Connector | Protocol | Direction | Typical Use |
|---|---|---|---|
| Cloudflare Tunnel | HTTP/2, QUIC | Off-ramp | Private web apps, SSH, RDP without public IPs |
| Cloudflare One Client | MASQUE (PQC), WireGuard | Bidirectional | Secure remote workforce devices |
| Cloudflare Mesh | MASQUE (PQC) | Bidirectional | Private networking for users, nodes, agents, and site-to-site traffic |
| Workers VPC | HTTP, TCP, Gateway egress | Bidirectional | Workers access to private networks and Gateway-governed egress |
| Private Origin Routing | HTTP/HTTPS, proxied DNS | Off-ramp | Public hostnames routed to private HTTP/HTTPS origins |
| IPsec Tunnel | IPsec (IKEv2) | Bidirectional | Encrypted site-to-site over Internet |
| GRE Tunnel | GRE | Bidirectional | Lightweight site connectivity |
| Network Interconnect | Direct/Partner/Cloud | Bidirectional | Private dedicated connections |
| Multi-Cloud Networking | IPsec (automated) | Bidirectional | AWS, Azure, GCP VPC automation |
| DNS Location | DoH, DoT, IPv4/6 | On-ramp | Agentless DNS filtering |
| Proxy Endpoint | HTTP/HTTPS (PAC) | On-ramp | Agentless HTTP filtering |
| Clientless RBI | HTTP/HTTPS | On-ramp | Secure browser for unmanaged devices |
| Cloudflare One Appliance | IPsec | Bidirectional | Zero-touch branch deployment |
| Access SSO | SAML, OIDC | App-level | SaaS identity-aware authentication |
| CASB API | REST API | App-level | SaaS misconfiguration scanning |
| Mutual TLS | TLS client certificates | App-level | Certificate-based device/service auth |
| MCP Server Portal | OAuth 2.1, HTTP | App-level | Centralized AI agent access to MCP servers |
| Email Security (API/BCC) | Graph API, BCC/Journaling | App-level | Post-delivery email scanning |
| Email Security (MX/Inline) | MX record, SMTP | App-level | Pre-delivery email scanning |

## Cloudflare Workers References

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

* * * *

## Disclaimer

This project is for **educational and demonstration purposes only**. It is not an official Cloudflare product. For up-to-date and accurate information about Cloudflare One, SASE, and Zero Trust architecture, refer to the [Cloudflare Developer Documentation](https://developers.cloudflare.com/cloudflare-one/).

Connectivity options, product names, and features may change. Always consult the official documentation before making architectural decisions.
