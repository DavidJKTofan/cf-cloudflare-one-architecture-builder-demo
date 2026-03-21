/**
 * Component definitions — infrastructure and user elements that can be
 * placed on the canvas.
 *
 * Each entry defines: label, category, description, compatible connectors,
 * color, SVG icon, and documentation URL.
 *
 * To add a new component: add an entry here and a matching sidebar button
 * in index.html.
 */

"use strict";

window.App = window.App || {};

window.App.COMPONENTS = {
    /* ---- Infrastructure ---- */
    datacenter: {
        label: "Data Center",
        category: "infrastructure",
        desc: "On-premises data center with servers, databases, and internal applications. Connect to Cloudflare to provide secure remote access without exposing public IPs.",
        compatibleConnectors: ["cloudflare-tunnel", "warp-connector", "ipsec-tunnel", "gre-tunnel", "cni", "appliance"],
        color: "#F97316",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="6" rx="1"/><rect x="2" y="10" width="20" height="6" rx="1"/><circle cx="6" cy="5" r="1" fill="currentColor"/><circle cx="6" cy="13" r="1" fill="currentColor"/><line x1="17" y1="5" x2="20" y2="5"/><line x1="17" y1="13" x2="20" y2="13"/><rect x="2" y="18" width="20" height="4" rx="1" opacity="0.4"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/"
    },
    aws: {
        label: "AWS VPC",
        category: "infrastructure",
        desc: "Amazon Web Services Virtual Private Cloud. Use Multi-Cloud Networking for automated IPsec tunnel setup, or Cloudflare Tunnel for application-level access.",
        compatibleConnectors: ["cloudflare-tunnel", "warp-connector", "ipsec-tunnel", "multi-cloud", "cni"],
        color: "#FF9900",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 19A4.5 4.5 0 0 1 6.5 10a6 6 0 0 1 11 0 4.5 4.5 0 0 1 0 9h-11z"/><text x="12" y="16" text-anchor="middle" font-size="6" fill="currentColor" stroke="none" font-weight="700">AWS</text></svg>',
        docsUrl: "https://developers.cloudflare.com/multi-cloud-networking/"
    },
    gcp: {
        label: "GCP VPC",
        category: "infrastructure",
        desc: "Google Cloud Platform Virtual Private Cloud. Connect via Multi-Cloud Networking for automated IPsec, or use Cloudflare Tunnel for specific services.",
        compatibleConnectors: ["cloudflare-tunnel", "warp-connector", "ipsec-tunnel", "multi-cloud", "cni"],
        color: "#4285F4",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 19A4.5 4.5 0 0 1 6.5 10a6 6 0 0 1 11 0 4.5 4.5 0 0 1 0 9h-11z"/><text x="12" y="16" text-anchor="middle" font-size="5.5" fill="currentColor" stroke="none" font-weight="700">GCP</text></svg>',
        docsUrl: "https://developers.cloudflare.com/multi-cloud-networking/"
    },
    azure: {
        label: "Azure VNet",
        category: "infrastructure",
        desc: "Microsoft Azure Virtual Network. Multi-Cloud Networking automates VPN gateway creation. Ensure your VNet has sufficient address space (/20+ recommended).",
        compatibleConnectors: ["cloudflare-tunnel", "warp-connector", "ipsec-tunnel", "multi-cloud", "cni"],
        color: "#0078D4",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 19A4.5 4.5 0 0 1 6.5 10a6 6 0 0 1 11 0 4.5 4.5 0 0 1 0 9h-11z"/><text x="12" y="16" text-anchor="middle" font-size="4.8" fill="currentColor" stroke="none" font-weight="700">Azure</text></svg>',
        docsUrl: "https://developers.cloudflare.com/multi-cloud-networking/"
    },
    saas: {
        label: "SaaS Apps",
        category: "infrastructure",
        desc: "Microsoft 365, Salesforce, Google Workspace, etc. Integrate via Access SSO (SAML/OIDC) for identity-aware login, or CASB API to scan for misconfigurations at rest.",
        compatibleConnectors: ["access-saas", "casb-api"],
        color: "#06B6D4",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="14" rx="2"/><line x1="3" y1="8" x2="21" y2="8"/><circle cx="6" cy="6" r="0.5" fill="currentColor"/><circle cx="8.5" cy="6" r="0.5" fill="currentColor"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="15" x2="13" y2="15"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/saas-apps/"
    },
    branch: {
        label: "Branch Office",
        category: "infrastructure",
        desc: "Physical branch office with network infrastructure. Deploy Cloudflare One Appliance for zero-touch connectivity, or use IPsec/GRE tunnels from existing routers.",
        compatibleConnectors: ["ipsec-tunnel", "gre-tunnel", "appliance", "dns-location", "cloudflare-tunnel", "warp-connector", "clientless-rbi"],
        color: "#10B981",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><rect x="9" y="9" width="2" height="2"/><rect x="13" y="9" width="2" height="2"/><rect x="9" y="13" width="2" height="2"/><rect x="13" y="13" width="2" height="2"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-wan/"
    },

    /* ---- Users ---- */
    "remote-user": {
        label: "Remote Worker",
        category: "users",
        desc: "Employee working from home or while traveling. Deploy the Cloudflare One Client for full device security, or use agentless options (RBI, PAC, DNS) for lighter deployments.",
        compatibleConnectors: ["warp-client", "clientless-rbi", "proxy-endpoint", "dns-location"],
        color: "#3B82F6",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M2 12h3m14 0h3" stroke-dasharray="2 2"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/"
    },
    "office-user": {
        label: "Office Worker",
        category: "users",
        desc: "On-site corporate employee with a managed device. Use the Cloudflare One Client for full protection, or agentless options (RBI, PAC, DNS) for the office network.",
        compatibleConnectors: ["warp-client", "clientless-rbi", "proxy-endpoint", "dns-location"],
        color: "#8B5CF6",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><rect x="8" y="18" width="8" height="3" rx="1" opacity="0.3"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/"
    },
    contractor: {
        label: "Contractor / BYOD",
        category: "users",
        desc: "Third-party contractor or employee with an unmanaged personal device. Clientless Web Isolation provides secure access without installing any software.",
        compatibleConnectors: ["clientless-rbi", "proxy-endpoint", "dns-location", "warp-client"],
        color: "#EC4899",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M15 3l2 2-2 2" opacity="0.6"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/setup/clientless-browser-isolation/"
    },
    iot: {
        label: "IoT / Devices",
        category: "users",
        desc: "IP phones, cameras, sensors, and devices that cannot run agents. Use WARP Connector or Cloudflare Tunnel on a gateway host; DNS/PAC for basic filtering.",
        compatibleConnectors: ["warp-connector", "cloudflare-tunnel", "dns-location", "proxy-endpoint"],
        color: "#EAB308",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="12" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/><circle cx="12" cy="10" r="2" stroke-dasharray="2 1"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/warp-connector/"
    }
};
