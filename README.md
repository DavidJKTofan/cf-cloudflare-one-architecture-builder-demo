# Cloudflare One Architecture Builder

Interactive visual walkthrough for building Cloudflare One (SASE and Zero Trust) architectures. Users drag-and-drop infrastructure and user components onto a canvas, then connect them through Cloudflare's global network using real connectivity options.

Built as a Cloudflare Worker with static assets. No frameworks, no build step for the frontend.

## Features

- **Drag-and-drop canvas** with infrastructure (Data Center, AWS, GCP, Azure, SaaS, Branch Office) and user components (Remote Worker, Office Worker, Contractor/BYOD, IoT/Devices)
- **13 connectivity options** matching [Cloudflare's connectivity documentation](https://developers.cloudflare.com/cloudflare-wan/zero-trust/connectivity-options/): Cloudflare Tunnel, WARP Client, WARP Connector, IPsec, GRE, CNI, Multi-Cloud Networking, DNS Location, Proxy Endpoint, Clientless RBI, Appliance, Access SSO, CASB API
- **Quick Start Templates** (collapsible) for common use cases: VPN Replacement, Secure Internet Traffic, Multi-Cloud, Branch SD-WAN, Clientless Contractor Access
- **Full SASE button** that populates all 9 element types with relevant connections to reach 100%
- **Per-element remove** via X button on hover
- **Detail panel** showing compatible connectors, active connections, and documentation links to Cloudflare Developer Docs
- **Gamification** with progress tracking and 9 achievements
- **Connection line spreading** so multiple connections from one element are visually distinct

## Project Structure

```
.
├── src/
│   └── index.ts                    # Cloudflare Worker (serves assets + security headers)
├── public/
│   ├── index.html                  # Single-page application shell
│   ├── css/
│   │   └── app.css                 # Styles (dark theme, blueprint grid, animations)
│   └── js/
│       ├── app.js                  # Entry point — thin orchestrator, renderAll, init
│       ├── data/
│       │   ├── components.js       # Component definitions (infra + user elements)
│       │   ├── connectors.js       # Connector definitions (13 connectivity options)
│       │   ├── templates.js        # Use case templates (VPN replacement, etc.)
│       │   └── achievements.js     # Achievement definitions (9 milestones)
│       ├── engine/
│       │   ├── state.js            # State object + mutations (add/remove/reset)
│       │   ├── connections.js      # SVG connection line rendering (Bezier curves)
│       │   └── progress.js         # Progress bar + achievement checking
│       ├── ui/
│       │   ├── toast.js            # Toast notification system
│       │   ├── drag-drop.js        # Drag-and-drop from sidebar to canvas
│       │   ├── sidebar.js          # Sidebar clicks, connector buttons, templates
│       │   ├── detail-panel.js     # Right panel (info, docs, connections)
│       │   ├── canvas.js           # Placed elements rendering + in-canvas drag
│       │   └── onboarding.js       # Onboarding overlay
│       └── presets/
│           └── full-sase.js        # Full SASE architecture preset
├── wrangler.jsonc                  # Wrangler config (assets binding, observability)
├── tsconfig.json                   # TypeScript configuration
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
| **UI** | `ui/*.js` | DOM event handlers, rendering functions. Each file owns one UI concern (drag-drop, sidebar, detail panel, canvas, toasts, onboarding). |
| **Presets** | `presets/*.js` | Predefined architecture layouts (Full SASE). Add new preset files here. |
| **App** | `app.js` | Thin orchestrator — defines `renderAll()`, wires up reset/deselect, calls all `setup*()` functions on `DOMContentLoaded`. |

### Worker (`src/index.ts`)

Minimal TypeScript Worker that serves static assets via the `ASSETS` binding and adds security headers (`CSP`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). Uses `satisfies ExportedHandler<Env>` with the generated `Env` type.

### Connection Line Rendering

Lines are drawn as SVG `<path>` elements using quadratic Bezier curves (`Q` command). Each line runs from the component position to the nearest point on the Cloudflare network circle edge (computed via unit vector * radius). When multiple connections originate from the same element, a perpendicular spread offset fans them apart so all lines remain visible.

## Development

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/DavidJKTofan/cf-cloudflare-one-architecture-builder-demo)

```bash
npm install
npm run dev        # Start local dev server (wrangler dev)
npm run check      # TypeScript type-check
npm run types      # Regenerate Env types from wrangler.jsonc
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

Based on [Cloudflare One Connectivity Options](https://developers.cloudflare.com/cloudflare-wan/zero-trust/connectivity-options/) and [SASE Reference Architecture](https://developers.cloudflare.com/reference-architecture/architectures/sase/).

| Connector | Protocol | Direction | Typical Use |
|---|---|---|---|
| Cloudflare Tunnel | HTTP/2, QUIC | Off-ramp | Private web apps, SSH, RDP without public IPs |
| WARP Client | MASQUE, WireGuard | Bidirectional | Secure remote workforce devices |
| WARP Connector | MASQUE, WireGuard | Bidirectional | IoT, VoIP, server-initiated traffic (beta) |
| IPsec Tunnel | IPsec (IKEv2) | Bidirectional | Encrypted site-to-site over Internet |
| GRE Tunnel | GRE | Bidirectional | Lightweight site connectivity |
| Network Interconnect | Direct/Partner/Cloud | Bidirectional | Private dedicated connections |
| Multi-Cloud Networking | IPsec (automated) | Bidirectional | AWS, Azure, GCP VPC automation |
| DNS Location | DoH, DoT, IPv4/6 | On-ramp | Agentless DNS filtering |
| Proxy Endpoint | HTTP/HTTPS (PAC) | On-ramp | Agentless HTTP filtering |
| Clientless RBI | HTTP/HTTPS | On-ramp | Secure browser for unmanaged devices |
| Appliance | IPsec | Bidirectional | Zero-touch branch deployment |
| Access SSO | SAML, OIDC | App-level | SaaS identity-aware authentication |
| CASB API | REST API | App-level | SaaS misconfiguration scanning |

* * * *

## Disclaimer

This project is for **educational and demonstration purposes only**. It is not an official Cloudflare product. For up-to-date and accurate information about Cloudflare One, SASE, and Zero Trust architecture, refer to the [Cloudflare Developer Documentation](https://developers.cloudflare.com/cloudflare-one/).

Connectivity options, product names, and features may change. Always consult the official documentation before making architectural decisions.
