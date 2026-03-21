# Cloudflare One Architecture Builder

Interactive visual walkthrough for building Cloudflare One (SASE and Zero Trust) architectures. Users drag-and-drop infrastructure and user components onto a canvas, then connect them through Cloudflare's global network using real connectivity options.

Built as a Cloudflare Worker with static assets. No frameworks, no build step for the frontend.

## Features

- **Drag-and-drop canvas** with infrastructure (Data Center, AWS, GCP, Azure, SaaS, Branch Office) and user components (Remote Worker, Office Worker, Contractor/BYOD, IoT/Devices)
- **13 connectivity options** matching [Cloudflare's connectivity documentation](https://developers.cloudflare.com/cloudflare-wan/zero-trust/connectivity-options/): Cloudflare Tunnel, WARP Client, WARP Connector, IPsec, GRE, CNI, Multi-Cloud Networking, DNS Location, Proxy Endpoint, Clientless RBI, Appliance, Access SSO, CASB API
- **Quick Start Templates** for common use cases: VPN Replacement, Secure Internet Traffic, Multi-Cloud, Branch SD-WAN, Clientless Contractor Access
- **Full SASE button** that populates all 9 element types with relevant connections
- **Per-element remove** via X button on hover
- **Detail panel** showing compatible connectors, active connections, and documentation links to Cloudflare Developer Docs
- **Gamification** with progress tracking and 9 achievements
- **Connection line spreading** so multiple connections from one element are visually distinct

## Project Structure

```
.
├── src/
│   └── index.ts              # Cloudflare Worker entry point (serves static assets with security headers)
├── public/
│   ├── index.html            # Single-page application shell
│   ├── css/
│   │   └── app.css           # All styles (dark theme, blueprint grid, animations)
│   └── js/
│       └── app.js            # Application logic (state, rendering, drag-drop, templates)
├── wrangler.jsonc            # Wrangler configuration (assets binding, observability)
├── tsconfig.json             # TypeScript configuration
├── worker-configuration.d.ts # Auto-generated types from `wrangler types`
└── package.json
```

## Architecture

### Worker (`src/index.ts`)

Minimal TypeScript Worker that serves static assets via the `ASSETS` binding and adds security headers (`CSP`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). Uses `satisfies ExportedHandler<Env>` with the generated `Env` type.

### Frontend (`public/`)

Vanilla JavaScript with no build step. All state lives in a single `state` object. The canvas uses absolute-positioned DOM elements for components and an SVG overlay for connection lines (quadratic Bezier curves with perpendicular spread for multi-connection elements).

Key data structures:
- **`COMPONENTS`** — metadata for each placeable element (label, category, compatible connectors, icon SVG, docs URL)
- **`CONNECTORS`** — metadata for each connectivity option (name, protocol, direction, color, docs URL)
- **`TEMPLATES`** — predefined architectures with element positions and connection mappings

### Connection Line Rendering

Lines are drawn as SVG `<path>` elements using quadratic Bezier curves (`Q` command). Each line runs from the component position to the nearest point on the Cloudflare network circle edge (computed via unit vector * radius). When multiple connections originate from the same element, a perpendicular spread offset fans them apart.

## Development

```bash
npm install
npm run dev        # Start local dev server (wrangler dev)
npm run check      # TypeScript type-check
npm run types      # Regenerate Env types from wrangler.jsonc
npm run deploy     # Deploy to Cloudflare Workers
```

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

## Disclaimer

This project is for **educational and demonstration purposes only**. It is not an official Cloudflare product. For up-to-date and accurate information about Cloudflare One, SASE, and Zero Trust architecture, refer to the [Cloudflare Developer Documentation](https://developers.cloudflare.com/cloudflare-one/).

Connectivity options, product names, and features may change. Always consult the official documentation before making architectural decisions.
