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
        desc: "On-premises data center with servers, databases, and internal applications. Use Tunnel, Mesh, Cloudflare WAN, CNI, or Appliance connectivity for private access. Workers VPC with `cf1:network` can reach routes behind WAN on-ramps when return paths route Cloudflare source IPs back through the on-ramp. Private Origin Routing can also place Cloudflare CDN, WAF, Cache, and Workers in front of HTTP/HTTPS services without exposing the origin.",
        compatibleConnectors: ["cloudflare-tunnel", "cloudflare-mesh", "ipsec-tunnel", "gre-tunnel", "cni", "appliance", "workers-vpc", "private-origin-routing"],
        color: "#F97316",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="6" rx="1"/><rect x="2" y="10" width="20" height="6" rx="1"/><circle cx="6" cy="5" r="1" fill="currentColor"/><circle cx="6" cy="13" r="1" fill="currentColor"/><line x1="17" y1="5" x2="20" y2="5"/><line x1="17" y1="13" x2="20" y2="13"/><rect x="2" y="18" width="20" height="4" rx="1" opacity="0.4"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/"
    },
    aws: {
        label: "AWS VPC",
        category: "infrastructure",
        desc: "Amazon Web Services Virtual Private Cloud. Use Multi-Cloud Networking, Mesh, Tunnel, or CNI for private connectivity. Workers VPC lets deployed Workers reach private ECS, Lambda, or RDS resources through Tunnel or `cf1:network` routes, and Private Origin Routing can protect private HTTP/HTTPS apps behind public hostnames.",
        compatibleConnectors: ["cloudflare-tunnel", "cloudflare-mesh", "ipsec-tunnel", "multi-cloud", "cni", "workers-vpc", "private-origin-routing"],
        color: "#FF9900",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 19A4.5 4.5 0 0 1 6.5 10a6 6 0 0 1 11 0 4.5 4.5 0 0 1 0 9h-11z"/><text x="12" y="16" text-anchor="middle" font-size="6" fill="currentColor" stroke="none" font-weight="700">AWS</text></svg>',
        docsUrl: "https://developers.cloudflare.com/multi-cloud-networking/"
    },
    gcp: {
        label: "GCP VPC",
        category: "infrastructure",
        desc: "Google Cloud Platform Virtual Private Cloud. Connect via Multi-Cloud Networking, Mesh, Tunnel, or CNI. Workers VPC enables Workers to call private GCP services through Tunnel or `cf1:network` routes, and Private Origin Routing can protect private HTTP/HTTPS apps behind public hostnames.",
        compatibleConnectors: ["cloudflare-tunnel", "cloudflare-mesh", "ipsec-tunnel", "multi-cloud", "cni", "workers-vpc", "private-origin-routing"],
        color: "#4285F4",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 19A4.5 4.5 0 0 1 6.5 10a6 6 0 0 1 11 0 4.5 4.5 0 0 1 0 9h-11z"/><text x="12" y="16" text-anchor="middle" font-size="5.5" fill="currentColor" stroke="none" font-weight="700">GCP</text></svg>',
        docsUrl: "https://developers.cloudflare.com/multi-cloud-networking/"
    },
    azure: {
        label: "Azure VNet",
        category: "infrastructure",
        desc: "Microsoft Azure Virtual Network. Multi-Cloud Networking automates VPN gateway creation; ensure your VNet has sufficient address space. Workers VPC enables Workers to call private Azure services through Tunnel or `cf1:network` routes, and Private Origin Routing can protect private HTTP/HTTPS apps behind public hostnames.",
        compatibleConnectors: ["cloudflare-tunnel", "cloudflare-mesh", "ipsec-tunnel", "multi-cloud", "cni", "workers-vpc", "private-origin-routing"],
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
    "email-security": {
        label: "Email Provider",
        category: "infrastructure",
        desc: "Microsoft 365, Google Workspace, or on-premises email server. Integrate with Cloudflare Email Security via API, BCC/Journaling (post-delivery), or MX/Inline (pre-delivery) to protect against phishing, BEC, malware, and spam.",
        compatibleConnectors: ["email-security-api", "email-security-mx"],
        color: "#E040FB",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/><path d="M2 20l7-7" opacity="0.4"/><path d="M22 20l-7-7" opacity="0.4"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/email-security/"
    },
    "mcp-server": {
        label: "MCP Server",
        category: "infrastructure",
        desc: "Remote Model Context Protocol server providing tools and resources to AI agents. Can be hosted on Workers or self-hosted. Secure with Access policies and MCP Server Portals. Use Workers VPC for private databases and APIs, or Private Origin Routing when HTTP/HTTPS MCP services need Cloudflare application services in front.",
        compatibleConnectors: ["mcp-portal", "cloudflare-tunnel", "access-saas", "workers-vpc", "private-origin-routing"],
        color: "#0EA5E9",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><path d="M7 13h10M7 16.5h6" opacity="0.6"/></svg>',
        docsUrl: "https://developers.cloudflare.com/agents/model-context-protocol/authorization/"
    },
    "cloudflare-workers": {
        label: "Cloudflare Workers",
        category: "infrastructure",
        desc: "Serverless code deployed globally. Workers VPC bindings securely connect Workers to internal apps, private APIs, and databases. With `network_id: 'cf1:network'`, a Worker can reach private routes announced by Tunnel or Mesh plus Cloudflare WAN on-ramps such as GRE, IPsec, and CNI. Public Internet egress from Workers can also inherit Cloudflare Gateway DNS, HTTP, Network, and egress policies and logs.",
        compatibleConnectors: ["workers-vpc"],
        color: "#F38020",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 12h2l1.5-3L13 15l1.5-3H17" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        docsUrl: "https://developers.cloudflare.com/workers-vpc/"
    },
    branch: {
        label: "Branch Office",
        category: "infrastructure",
        desc: "Physical branch office with network infrastructure. Deploy Cloudflare One Appliance for zero-touch connectivity, use IPsec or GRE tunnels from existing routers, or publish private HTTP/HTTPS services through Private Origin Routing.",
        compatibleConnectors: ["ipsec-tunnel", "gre-tunnel", "appliance", "dns-location", "cloudflare-tunnel", "cloudflare-mesh", "clientless-rbi", "private-origin-routing"],
        color: "#10B981",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><rect x="9" y="9" width="2" height="2"/><rect x="13" y="9" width="2" height="2"/><rect x="9" y="13" width="2" height="2"/><rect x="13" y="13" width="2" height="2"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-wan/"
    },

    /* ---- Users ---- */
    "remote-user": {
        label: "Remote Worker",
        category: "users",
        desc: "Employee working from home or while traveling. Deploy the Cloudflare One Client for full device security, or use agentless options (RBI, PAC, DNS) for lighter deployments. When using Mesh or private network routes, make sure needed private CIDRs are not still excluded by split-tunnel settings.",
        compatibleConnectors: ["warp-client", "clientless-rbi", "proxy-endpoint", "dns-location", "mtls"],
        color: "#3B82F6",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M2 12h3m14 0h3" stroke-dasharray="2 2"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/"
    },
    "office-user": {
        label: "Office Worker",
        category: "users",
        desc: "On-site corporate employee with a managed device. Use the Cloudflare One Client for full protection, or agentless options (RBI, PAC, DNS) for the office network. If private ranges overlap default split-tunnel excludes, include the required CIDRs so traffic reaches Cloudflare routes.",
        compatibleConnectors: ["warp-client", "clientless-rbi", "proxy-endpoint", "dns-location", "mtls"],
        color: "#8B5CF6",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><rect x="8" y="18" width="8" height="3" rx="1" opacity="0.3"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/"
    },
    contractor: {
        label: "Contractor / BYOD",
        category: "users",
        desc: "Third-party contractor or employee with an unmanaged personal device. Clientless Web Isolation provides secure access without installing any software.",
        compatibleConnectors: ["clientless-rbi", "proxy-endpoint", "dns-location", "warp-client", "mtls"],
        color: "#EC4899",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M15 3l2 2-2 2" opacity="0.6"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/setup/clientless-browser-isolation/"
    },
    iot: {
        label: "IoT / Devices",
        category: "users",
        desc: "IP phones, cameras, sensors, and devices that cannot run agents. Use a Cloudflare Mesh node or Cloudflare Tunnel on a gateway host; DNS/PAC for basic filtering.",
        compatibleConnectors: ["cloudflare-mesh", "cloudflare-tunnel", "dns-location", "proxy-endpoint", "mtls"],
        color: "#EAB308",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="12" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/><circle cx="12" cy="10" r="2" stroke-dasharray="2 1"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-mesh/"
    },
    "ai-agent": {
        label: "AI Agent",
        category: "users",
        desc: "Autonomous AI agent such as a coding assistant, MCP client, or Worker-based agent. Connects to MCP servers through portals, reaches private resources through Mesh or Workers VPC, and can have public Worker egress governed by Gateway policies.",
        compatibleConnectors: ["mcp-portal", "warp-client", "cloudflare-mesh", "workers-vpc"],
        color: "#14B8A6",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M9 20h6"/><path d="M12 16v4"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><path d="M9 12.5c0 0 1.5 1.5 3 1.5s3-1.5 3-1.5" opacity="0.6"/></svg>',
        docsUrl: "https://developers.cloudflare.com/agents/"
    },
    visitor: {
        label: "Visitors / Guests",
        category: "users",
        desc: "Guest WiFi users, customers, students, or public Internet visitors on unmanaged devices. Use Public Internet (HTTPS) for proxied public hostnames, DNS Location for baseline filtering, or clientless options for controlled web access.",
        compatibleConnectors: ["public-https", "dns-location", "clientless-rbi", "proxy-endpoint"],
        color: "#94A3B8",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="10" r="2" opacity="0.4"/><path d="M19 21v-1a3 3 0 0 0-2-2.8" opacity="0.4"/></svg>',
        docsUrl: "https://developers.cloudflare.com/reference-architecture/design-guides/securing-guest-wireless-networks/"
    }
};
