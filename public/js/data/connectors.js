/**
 * Connector definitions — Cloudflare One connectivity options.
 *
 * Each entry defines: display name, protocol, direction (Off-ramp / Bidirectional /
 * On-ramp / Application-level), line color, description, and documentation URL.
 *
 * To add a new connector: add an entry here, a matching button in index.html,
 * and a CSS variable in app.css.
 */

"use strict";

window.App = window.App || {};

window.App.CONNECTORS = {
    "cloudflare-tunnel": {
        name: "Cloudflare Tunnel",
        protocol: "QUIC, HTTP/2",
        direction: "Off-ramp only",
        color: "#7C3AED",
        desc: "Outbound-only connections via cloudflared. Exposes web apps, SSH, and RDP without public IPs or firewall changes. Client IP available via CF-Connecting-IP header.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/"
    },
    "warp-client": {
        name: "Cloudflare One Client",
        protocol: "MASQUE (PQC), WireGuard",
        direction: "Bidirectional",
        color: "#3B82F6",
        desc: "Device agent (formerly WARP) encrypting all traffic from the endpoint. Supports DNS, HTTP, and L4 network filtering with device posture checks. Post-quantum ready via MASQUE.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/"
    },
    "cloudflare-mesh": {
        name: "Cloudflare Mesh",
        protocol: "MASQUE (PQC)",
        direction: "Bidirectional",
        color: "#E844A0",
        desc: "Post-quantum encrypted mesh networking via Linux nodes. Every participant gets a private Mesh IP (100.96.0.0/12). Enables bidirectional traffic for IoT, VoIP/SIP, and site-to-site. Preserves source IPs end-to-end. Supports HA with active-passive replicas.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-mesh/"
    },
    "ipsec-tunnel": {
        name: "IPsec Tunnel",
        protocol: "IPsec (IKEv2)",
        direction: "Bidirectional",
        color: "#F97316",
        desc: "Encrypted anycast tunnels from routers/firewalls to Cloudflare WAN. Automatic failover across data centers. Requires static public IP. Supports ECMP.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-wan/reference/gre-ipsec-tunnels/"
    },
    "gre-tunnel": {
        name: "GRE Tunnel",
        protocol: "GRE",
        direction: "Bidirectional",
        color: "#FACC15",
        desc: "Lightweight stateless tunnels. No encryption (pair with IPsec if needed). Useful for redundancy or when IPsec throughput is limited. MTU: 1476 bytes.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-wan/reference/gre-ipsec-tunnels/"
    },
    "cni": {
        name: "Cloudflare Network Interconnect",
        protocol: "Direct / Partner / Cloud",
        direction: "Bidirectional",
        color: "#818CF8",
        desc: "Private dedicated connections bypassing the public Internet. Direct (fiber), Partner (Megaport, Equinix), or Cloud (AWS, GCP, Azure) interconnect. Enterprise plan required.",
        docsUrl: "https://developers.cloudflare.com/network-interconnect/"
    },
    "multi-cloud": {
        name: "Multi-Cloud Networking",
        protocol: "IPsec (automated)",
        direction: "Bidirectional",
        color: "#22C55E",
        desc: "Auto-discovers cloud resources and creates VPN tunnels to Cloudflare WAN. Supports AWS (VPC + Transit Gateway hub), Azure VNet, and GCP VPC.",
        docsUrl: "https://developers.cloudflare.com/multi-cloud-networking/"
    },
    "dns-location": {
        name: "DNS Location",
        protocol: "DoH, DoT, IPv4/IPv6",
        direction: "On-ramp only",
        color: "#22D3EE",
        desc: "Agentless DNS filtering for an entire network. Point your resolver to Cloudflare Gateway. Supports DoH with per-user tokens for identity-based policies.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/resolvers-and-proxies/dns/locations/"
    },
    "proxy-endpoint": {
        name: "Proxy Endpoint (PAC)",
        protocol: "HTTPS",
        direction: "On-ramp only",
        color: "#2DD4BF",
        desc: "Agentless HTTP filtering via browser PAC file. Supports authorization endpoints (identity-based) and source IP endpoints (Enterprise). No UDP or HTTP/3.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/resolvers-and-proxies/proxy-endpoints/"
    },
    "clientless-rbi": {
        name: "Clientless Web Isolation",
        protocol: "HTTPS",
        direction: "On-ramp only",
        color: "#FB923C",
        desc: "Secure browser access for unmanaged devices via a prefixed URL. Cloudflare renders pages in an isolated browser and streams draw commands. Requires Access auth.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/setup/clientless-browser-isolation/"
    },
    appliance: {
        name: "Cloudflare One Appliance",
        protocol: "IPsec",
        direction: "Bidirectional",
        color: "#F43F5E",
        desc: "Plug-and-play SD-WAN appliance (Dell VEP1460 or VM). Auto-creates IPsec tunnels with zero-touch provisioning. Supports HA and centralized management. 1 Gbps+.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-wan/configuration/appliance/"
    },
    "access-saas": {
        name: "Access SSO (SAML/OIDC)",
        protocol: "SAML, OIDC",
        direction: "Application-level",
        color: "#A78BFA",
        desc: "Cloudflare acts as SSO identity provider for SaaS apps. Users authenticate via Access policies before being redirected to the SaaS app. Supports 50+ SaaS integrations.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/saas-apps/"
    },
    "casb-api": {
        name: "CASB API Integration",
        protocol: "REST API",
        direction: "Application-level",
        color: "#C084FC",
        desc: "API-driven scan of SaaS app configurations. Detects misconfigurations, overshared files, shadow IT, and third-party app OAuth grants at rest. No inline traffic required.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/applications/scan-apps/"
    },
    "mtls": {
        name: "Mutual TLS (mTLS)",
        protocol: "TLS client certificates",
        direction: "Application-level",
        color: "#64748B",
        desc: "Certificate-based authentication for devices and services that cannot use an IdP. Also a second factor for users alongside SSO. Requires uploading a root CA to Access.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/mutual-tls-authentication/"
    },
    "email-security-api": {
        name: "Email Security (API / BCC)",
        protocol: "Graph API, BCC/Journaling",
        direction: "Application-level",
        color: "#E040FB",
        desc: "Post-delivery deployment: Cloudflare scans emails after they reach the inbox. Uses Microsoft Graph API or BCC/Journaling rules. Supports auto-move to delete or quarantine threats.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/email-security/setup/post-delivery-deployment/"
    },
    "mcp-portal": {
        name: "MCP Server Portal",
        protocol: "OAuth 2.1, HTTP",
        direction: "Application-level",
        color: "#0EA5E9",
        desc: "Centralized gateway aggregating multiple MCP servers behind a single authenticated endpoint. Provides Access-based auth, tool curation, DLP scanning via Gateway, Code Mode for token optimization, and audit logging.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/"
    },
    "email-security-mx": {
        name: "Email Security (MX/Inline)",
        protocol: "MX record, SMTP",
        direction: "Application-level",
        color: "#CE93D8",
        desc: "Pre-delivery deployment: MX records point to Cloudflare, scanning emails before they reach the inbox. Highest protection level — blocks threats in transit and supports text add-ons and link rewrite.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/email-security/setup/pre-delivery-deployment/"
    }
};
