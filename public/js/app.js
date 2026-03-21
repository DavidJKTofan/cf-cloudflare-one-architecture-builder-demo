/* =================================================================
   Cloudflare One Architecture Builder — Interactive Walkthrough
   =================================================================
   Pure vanilla JS — no frameworks, no build step for the frontend.
   All state lives in the `state` object; the canvas is rendered
   declaratively via DOM manipulation.
   ================================================================= */

"use strict";

/* ---------- COMPONENT & CONNECTOR METADATA ---------- */

const COMPONENTS = {
    /* Infrastructure */
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
        compatibleConnectors: ["ipsec-tunnel", "gre-tunnel", "appliance", "dns-location", "cloudflare-tunnel", "warp-connector"],
        color: "#10B981",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><rect x="9" y="9" width="2" height="2"/><rect x="13" y="9" width="2" height="2"/><rect x="9" y="13" width="2" height="2"/><rect x="13" y="13" width="2" height="2"/></svg>',
        docsUrl: "https://developers.cloudflare.com/cloudflare-wan/"
    },

    /* Users */
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

const CONNECTORS = {
    "cloudflare-tunnel": {
        name: "Cloudflare Tunnel",
        protocol: "HTTP/2, QUIC",
        direction: "Off-ramp only",
        color: "#7C3AED",
        desc: "Outbound-only connections via cloudflared. Exposes web apps, SSH, and RDP without public IPs or firewall changes. Client IP available via CF-Connecting-IP header.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/"
    },
    "warp-client": {
        name: "WARP Client (Cloudflare One Client)",
        protocol: "MASQUE (PQ), WireGuard",
        direction: "Bidirectional",
        color: "#3B82F6",
        desc: "Device agent encrypting all traffic from the endpoint. Supports DNS, HTTP, and L4 network filtering with device posture checks. Post-quantum ready via MASQUE.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/"
    },
    "warp-connector": {
        name: "WARP Connector",
        protocol: "MASQUE, WireGuard",
        direction: "Bidirectional",
        color: "#E844A0",
        desc: "Linux-based L3 router for a subnet. Enables bidirectional traffic for IoT, VoIP/SIP, SCCM, and Active Directory. Preserves source IPs end-to-end. Beta.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/warp-connector/"
    },
    "ipsec-tunnel": {
        name: "IPsec Tunnel",
        protocol: "IPsec (IKEv2)",
        direction: "Bidirectional",
        color: "#F97316",
        desc: "Encrypted anycast tunnels from routers/firewalls to Cloudflare WAN. Automatic failover across data centers. Requires static public IP. Supports ECMP.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-wan/reference/gre-ipsec-tunnels/"
    },
    "gre-tunnel": {
        name: "GRE Tunnel",
        protocol: "GRE",
        direction: "Bidirectional",
        color: "#FACC15",
        desc: "Lightweight stateless tunnels. No encryption (pair with IPsec if needed). Useful for redundancy or when IPsec throughput is limited. MTU: 1476 bytes.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-wan/reference/gre-ipsec-tunnels/"
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
        protocol: "HTTP/HTTPS",
        direction: "On-ramp only",
        color: "#2DD4BF",
        desc: "Agentless HTTP filtering via browser PAC file. Supports authorization endpoints (identity-based) and source IP endpoints (Enterprise). No UDP or HTTP/3.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/networks/resolvers-and-proxies/proxy-endpoints/"
    },
    "clientless-rbi": {
        name: "Clientless Web Isolation",
        protocol: "HTTP/HTTPS",
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
    }
};

/* Achievements — unlocked as user builds */
const ACHIEVEMENTS = [
    { id: "first-place", title: "First Step", desc: "Placed your first component", check: s => s.elements.length >= 1 },
    { id: "infra-ready", title: "Infrastructure Ready", desc: "Placed at least 2 infrastructure components", check: s => s.elements.filter(e => COMPONENTS[e.type]?.category === "infrastructure").length >= 2 },
    { id: "users-connected", title: "Users Connected", desc: "Placed at least 2 user components", check: s => s.elements.filter(e => COMPONENTS[e.type]?.category === "users").length >= 2 },
    { id: "first-connection", title: "First Connection", desc: "Attached your first connectivity option", check: s => s.connections.length >= 1 },
    { id: "multi-connector", title: "Multi-Connector", desc: "Used 3 different connector types", check: s => new Set(s.connections.map(c => c.connector)).size >= 3 },
    { id: "full-stack", title: "Full Stack SASE", desc: "Connected both users and infrastructure", check: s => {
        const hasUserConn = s.connections.some(c => COMPONENTS[s.elements.find(e => e.id === c.elementId)?.type]?.category === "users");
        const hasInfraConn = s.connections.some(c => COMPONENTS[s.elements.find(e => e.id === c.elementId)?.type]?.category === "infrastructure");
        return hasUserConn && hasInfraConn;
    }},
    { id: "architect", title: "SASE Architect", desc: "Built an architecture with 5+ connections", check: s => s.connections.length >= 5 },
    { id: "cloud-native", title: "Cloud Native", desc: "Connected a cloud VPC with Multi-Cloud Networking", check: s => s.connections.some(c => c.connector === "multi-cloud") },
    { id: "zero-trust-hero", title: "Zero Trust Hero", desc: "Used WARP Client + Cloudflare Tunnel together", check: s => s.connections.some(c => c.connector === "warp-client") && s.connections.some(c => c.connector === "cloudflare-tunnel") },
];

/* ---------- USE CASE TEMPLATES ---------- */
const TEMPLATES = {
    "vpn-replacement": {
        name: "Replace Your VPN",
        desc: "Remote workers connect via WARP Client; private apps are exposed through Cloudflare Tunnel. No public IPs required.",
        docsUrl: "https://developers.cloudflare.com/learning-paths/replace-vpn/concepts/",
        elements: [
            { type: "remote-user", side: "left", slot: 0 },
            { type: "office-user", side: "left", slot: 1 },
            { type: "datacenter", side: "right", slot: 0 },
            { type: "aws", side: "right", slot: 1 },
        ],
        connections: [
            { elementIdx: 0, connector: "warp-client" },
            { elementIdx: 1, connector: "warp-client" },
            { elementIdx: 2, connector: "cloudflare-tunnel" },
            { elementIdx: 3, connector: "cloudflare-tunnel" },
        ]
    },
    "secure-internet": {
        name: "Secure Internet Traffic",
        desc: "All user Internet traffic is filtered through Cloudflare Gateway (SWG). DNS filtering for offices, WARP for managed devices.",
        docsUrl: "https://developers.cloudflare.com/learning-paths/secure-internet-traffic/concepts/",
        elements: [
            { type: "remote-user", side: "left", slot: 0 },
            { type: "office-user", side: "left", slot: 1 },
            { type: "contractor", side: "left", slot: 2 },
            { type: "saas", side: "right", slot: 0 },
            { type: "branch", side: "right", slot: 1 },
        ],
        connections: [
            { elementIdx: 0, connector: "warp-client" },
            { elementIdx: 1, connector: "warp-client" },
            { elementIdx: 2, connector: "proxy-endpoint" },
            { elementIdx: 3, connector: "access-saas" },
            { elementIdx: 3, connector: "casb-api" },
            { elementIdx: 4, connector: "dns-location" },
        ]
    },
    "cloud-first": {
        name: "Multi-Cloud Connectivity",
        desc: "Cloud VPCs connected via automated Multi-Cloud Networking IPsec tunnels. Employees access resources through WARP.",
        docsUrl: "https://developers.cloudflare.com/multi-cloud-networking/",
        elements: [
            { type: "remote-user", side: "left", slot: 0 },
            { type: "office-user", side: "left", slot: 1 },
            { type: "aws", side: "right", slot: 0 },
            { type: "azure", side: "right", slot: 1 },
            { type: "saas", side: "right", slot: 2 },
        ],
        connections: [
            { elementIdx: 0, connector: "warp-client" },
            { elementIdx: 1, connector: "warp-client" },
            { elementIdx: 2, connector: "multi-cloud" },
            { elementIdx: 3, connector: "multi-cloud" },
            { elementIdx: 4, connector: "access-saas" },
        ]
    },
    "branch-sd-wan": {
        name: "Branch Office SD-WAN",
        desc: "Branch offices connect via Cloudflare One Appliance or IPsec. Data center uses CNI for private, high-throughput connectivity.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-wan/",
        elements: [
            { type: "office-user", side: "left", slot: 0 },
            { type: "iot", side: "left", slot: 1 },
            { type: "branch", side: "right", slot: 0 },
            { type: "branch", side: "right", slot: 1 },
            { type: "datacenter", side: "right", slot: 2 },
        ],
        connections: [
            { elementIdx: 0, connector: "warp-client" },
            { elementIdx: 1, connector: "warp-connector" },
            { elementIdx: 2, connector: "appliance" },
            { elementIdx: 3, connector: "ipsec-tunnel" },
            { elementIdx: 4, connector: "cni" },
        ]
    },
    "contractor-access": {
        name: "Clientless Contractor Access",
        desc: "Contractors and BYOD users access private apps via Clientless RBI or Proxy Endpoints without installing software.",
        docsUrl: "https://developers.cloudflare.com/learning-paths/clientless-access/concepts/",
        elements: [
            { type: "contractor", side: "left", slot: 0 },
            { type: "contractor", side: "left", slot: 1 },
            { type: "remote-user", side: "left", slot: 2 },
            { type: "datacenter", side: "right", slot: 0 },
            { type: "saas", side: "right", slot: 1 },
        ],
        connections: [
            { elementIdx: 0, connector: "clientless-rbi" },
            { elementIdx: 1, connector: "proxy-endpoint" },
            { elementIdx: 2, connector: "warp-client" },
            { elementIdx: 3, connector: "cloudflare-tunnel" },
            { elementIdx: 4, connector: "access-saas" },
        ]
    }
};

/* ---------- STATE ---------- */
const state = {
    elements: [],          // { id, type, x, y }
    connections: [],       // { id, elementId, connector }
    selectedElementId: null,
    unlockedAchievements: new Set(),
    idCounter: 0,
};

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
    setupDragAndDrop();
    setupSidebarClicks();
    setupConnectorButtons();
    setupResetButton();
    setupFullSase();
    setupOnboarding();
    setupTemplates();
    renderAll();
});

/* ---------- ONBOARDING ---------- */
function setupOnboarding() {
    const overlay = document.getElementById("onboarding");
    const btn = document.getElementById("btnStart");
    btn.addEventListener("click", () => {
        overlay.classList.add("hidden");
    });
}

/* ---------- TEMPLATES ---------- */
function setupTemplates() {
    document.querySelectorAll(".template-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.template;
            if (!key || !TEMPLATES[key]) return;
            applyTemplate(key);
        });
    });
}

function applyTemplate(key) {
    const tpl = TEMPLATES[key];
    if (!tpl) return;

    // Full reset — state, DOM, and achievements
    state.elements = [];
    state.connections = [];
    state.selectedElementId = null;
    state.unlockedAchievements.clear();
    state.idCounter = 0;
    document.getElementById("placedElements").innerHTML = "";
    document.getElementById("connectionsLayer").innerHTML = "";

    // Hide onboarding if visible
    const overlay = document.getElementById("onboarding");
    overlay.classList.add("hidden");

    // Compute layout positions
    const canvas = document.getElementById("canvasContainer");
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const slotPositions = (side, total) => {
        const positions = [];
        const baseX = side === "left" ? cx * 0.34 : cx * 1.60;
        const startY = cy - ((total - 1) * 100) / 2;
        for (let i = 0; i < total; i++) {
            positions.push({ x: baseX + (Math.random() - 0.5) * 40, y: startY + i * 100 });
        }
        return positions;
    };

    // Count per side
    const leftItems = tpl.elements.filter(e => e.side === "left");
    const rightItems = tpl.elements.filter(e => e.side === "right");
    const leftSlots = slotPositions("left", leftItems.length);
    const rightSlots = slotPositions("right", rightItems.length);

    let leftIdx = 0, rightIdx = 0;
    tpl.elements.forEach(item => {
        const id = "el-" + (++state.idCounter);
        const pos = item.side === "left" ? leftSlots[leftIdx++] : rightSlots[rightIdx++];
        state.elements.push({ id, type: item.type, x: pos.x, y: pos.y });
    });

    // Add connections
    tpl.connections.forEach(conn => {
        const elId = state.elements[conn.elementIdx]?.id;
        if (!elId) return;
        const connId = "conn-" + (++state.idCounter);
        state.connections.push({ id: connId, elementId: elId, connector: conn.connector });
    });

    renderAll();
    checkAchievements();
    showToast("Loaded: " + tpl.name, "template");
}

/* ---------- DRAG & DROP ---------- */
function setupDragAndDrop() {
    const cards = document.querySelectorAll(".component-card[draggable]");
    cards.forEach(card => {
        card.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", card.dataset.type);
            card.classList.add("dragging");
        });
        card.addEventListener("dragend", () => card.classList.remove("dragging"));
    });

    const canvasArea = document.getElementById("canvasContainer");
    const dzLeft = document.getElementById("dropZoneLeft");
    const dzRight = document.getElementById("dropZoneRight");

    [dzLeft, dzRight, canvasArea].forEach(zone => {
        zone.addEventListener("dragover", e => {
            e.preventDefault();
            if (zone.classList.contains("drop-zone")) zone.classList.add("drag-over");
        });
        zone.addEventListener("dragleave", () => {
            if (zone.classList.contains("drop-zone")) zone.classList.remove("drag-over");
        });
        zone.addEventListener("drop", e => {
            e.preventDefault();
            e.stopPropagation(); // Prevent parent canvasContainer from also firing
            zone.classList.remove("drag-over");
            const type = e.dataTransfer.getData("text/plain");
            if (!type || !COMPONENTS[type]) return;

            const rect = canvasArea.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            // Clamp to canvas
            x = Math.max(40, Math.min(rect.width - 40, x));
            y = Math.max(40, Math.min(rect.height - 40, y));

            addElement(type, x, y);
        });
    });
}

/* ---------- SIDEBAR CLICK-TO-PLACE ---------- */
function setupSidebarClicks() {
    document.querySelectorAll(".component-card").forEach(card => {
        card.addEventListener("click", () => {
            const type = card.dataset.type;
            if (!type || !COMPONENTS[type]) return;
            const comp = COMPONENTS[type];
            const canvas = document.getElementById("canvasContainer");
            const rect = canvas.getBoundingClientRect();
            // Place on appropriate side with some randomness
            const isUser = comp.category === "users";
            const baseX = isUser ? rect.width * 0.2 : rect.width * 0.78;
            const x = baseX + (Math.random() - 0.5) * rect.width * 0.12;
            const y = rect.height * 0.2 + Math.random() * rect.height * 0.55;
            addElement(type, x, y);
        });
    });
}

/* ---------- ADD / REMOVE ELEMENTS ---------- */
function addElement(type, x, y) {
    const id = "el-" + (++state.idCounter);
    state.elements.push({ id, type, x, y });
    state.selectedElementId = id;
    renderAll();
    checkAchievements();
    showToast("Placed " + COMPONENTS[type].label, "component");
}

function removeElement(id) {
    const el = state.elements.find(e => e.id === id);
    const label = el ? COMPONENTS[el.type]?.label : "";
    state.elements = state.elements.filter(e => e.id !== id);
    state.connections = state.connections.filter(c => c.elementId !== id);
    if (state.selectedElementId === id) state.selectedElementId = null;
    renderAll();
    if (label) showToast("Removed " + label, "info");
}

/* ---------- CONNECTIONS ---------- */
function setupConnectorButtons() {
    document.querySelectorAll(".connector-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.disabled) return;
            const connector = btn.dataset.connector;
            const elId = state.selectedElementId;
            if (!elId || !connector) return;

            // Check if already connected
            if (state.connections.some(c => c.elementId === elId && c.connector === connector)) {
                showToast("Already connected", "info");
                return;
            }

            const connId = "conn-" + (++state.idCounter);
            state.connections.push({ id: connId, elementId: elId, connector });
            renderAll();
            checkAchievements();
            showToast("Connected via " + CONNECTORS[connector].name, "connection");
        });
    });
}

function removeConnection(connId) {
    state.connections = state.connections.filter(c => c.id !== connId);
    renderAll();
}

/* ---------- RESET ---------- */
function setupResetButton() {
    document.getElementById("btnReset").addEventListener("click", () => {
        state.elements = [];
        state.connections = [];
        state.selectedElementId = null;
        state.unlockedAchievements.clear();
        state.idCounter = 0;
        renderAll();
    });
}

/* ---------- FULL SASE ---------- */
function setupFullSase() {
    document.getElementById("btnFullSase").addEventListener("click", () => {
        applyFullSase();
    });
}

function applyFullSase() {
    // Full reset
    state.elements = [];
    state.connections = [];
    state.selectedElementId = null;
    state.unlockedAchievements.clear();
    state.idCounter = 0;
    document.getElementById("placedElements").innerHTML = "";
    document.getElementById("connectionsLayer").innerHTML = "";
    document.getElementById("onboarding").classList.add("hidden");

    const canvas = document.getElementById("canvasContainer");
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // Layout: 4 user types on the left, 5 infra on the right, well-spaced
    const leftTypes  = ["remote-user", "office-user", "contractor", "iot"];
    const rightTypes = ["datacenter", "aws", "azure", "saas", "branch"];
    const leftSpacing = (rect.height * 0.7) / (leftTypes.length - 1 || 1);
    const rightSpacing = (rect.height * 0.7) / (rightTypes.length - 1 || 1);
    const leftStartY = cy - (leftTypes.length - 1) * leftSpacing / 2;
    const rightStartY = cy - (rightTypes.length - 1) * rightSpacing / 2;
    const leftX = cx * 0.32;
    const rightX = cx * 1.64;

    leftTypes.forEach((type, i) => {
        const id = "el-" + (++state.idCounter);
        state.elements.push({ id, type, x: leftX, y: leftStartY + i * leftSpacing });
    });
    rightTypes.forEach((type, i) => {
        const id = "el-" + (++state.idCounter);
        state.elements.push({ id, type, x: rightX, y: rightStartY + i * rightSpacing });
    });

    // Connections: best-practice connector per element
    const connMap = [
        // Users
        [0, "warp-client"],       // Remote Worker -> WARP Client
        [1, "warp-client"],       // Office Worker -> WARP Client
        [2, "clientless-rbi"],    // Contractor -> Clientless RBI
        [2, "proxy-endpoint"],    // Contractor -> Proxy Endpoint
        [3, "warp-connector"],    // IoT -> WARP Connector
        [3, "dns-location"],      // IoT -> DNS Location
        // Infrastructure
        [4, "cloudflare-tunnel"], // Data Center -> Tunnel
        [4, "ipsec-tunnel"],      // Data Center -> IPsec
        [5, "multi-cloud"],       // AWS -> Multi-Cloud Networking
        [6, "multi-cloud"],       // Azure -> Multi-Cloud Networking
        [7, "access-saas"],       // SaaS -> Access SSO
        [7, "casb-api"],          // SaaS -> CASB API
        [8, "appliance"],         // Branch -> Appliance
    ];
    connMap.forEach(([idx, connector]) => {
        const elId = state.elements[idx]?.id;
        if (!elId) return;
        state.connections.push({ id: "conn-" + (++state.idCounter), elementId: elId, connector });
    });

    renderAll();
    checkAchievements();
    showToast("Full SASE Architecture loaded", "template");
}

/* ---------- RENDERING ---------- */
function renderAll() {
    renderPlacedElements();
    renderConnections();
    renderDetailPanel();
    renderConnectorStates();
    renderDropZones();
    updateProgress();
}

function renderPlacedElements() {
    const container = document.getElementById("placedElements");
    // Keep existing elements that are still in state; add new ones; remove stale
    const existingEls = container.querySelectorAll(".placed-element");
    const existingMap = new Map();
    existingEls.forEach(el => existingMap.set(el.dataset.id, el));

    const stateIds = new Set(state.elements.map(e => e.id));
    // Remove stale
    existingMap.forEach((el, id) => { if (!stateIds.has(id)) el.remove(); });

    state.elements.forEach(elem => {
        const comp = COMPONENTS[elem.type];
        if (!comp) return;
        let el = existingMap.get(elem.id);
        if (!el) {
            el = document.createElement("div");
            el.className = "placed-element";
            el.dataset.id = elem.id;
            el.innerHTML = `
                <button class="element-remove-btn" title="Remove">
                    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
                </button>
                <div class="element-body" style="border-color: ${comp.color}20; background: linear-gradient(135deg, ${comp.color}08, var(--bg-card))">
                    ${comp.icon}
                    <div class="element-connectors"></div>
                </div>
                <span class="element-label">${comp.label}</span>
            `;
            // Remove button on the element itself
            el.querySelector(".element-remove-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                removeElement(elem.id);
            });
            el.addEventListener("click", (e) => {
                e.stopPropagation();
                if (e.target.closest(".element-remove-btn")) return;
                state.selectedElementId = elem.id;
                renderAll();
            });
            // Make draggable inside canvas
            makeDraggableInCanvas(el, elem);
            container.appendChild(el);
            // Entrance animation
            el.style.opacity = "0";
            el.style.transform = "scale(0.5)";
            requestAnimationFrame(() => {
                el.style.transition = "opacity 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)";
                el.style.opacity = "1";
                el.style.transform = "scale(1)";
            });
        }
        // Position
        el.style.left = (elem.x - 32) + "px";
        el.style.top = (elem.y - 42) + "px";
        // Selection
        el.classList.toggle("selected", state.selectedElementId === elem.id);
        // Connector dots
        const dotsContainer = el.querySelector(".element-connectors");
        const elConns = state.connections.filter(c => c.elementId === elem.id);
        dotsContainer.innerHTML = elConns.map(c =>
            `<div class="element-connector-dot" style="background:${CONNECTORS[c.connector]?.color ?? '#666'}" title="${CONNECTORS[c.connector]?.name ?? ''}"></div>`
        ).join("");
    });
}

function makeDraggableInCanvas(domEl, stateEl) {
    let dragging = false, startX, startY, origX, origY;
    const body = domEl.querySelector(".element-body");
    body.addEventListener("mousedown", e => {
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = stateEl.x;
        origY = stateEl.y;
        body.style.cursor = "grabbing";
        e.preventDefault();
    });
    document.addEventListener("mousemove", e => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        stateEl.x = origX + dx;
        stateEl.y = origY + dy;
        domEl.style.left = (stateEl.x - 32) + "px";
        domEl.style.top = (stateEl.y - 42) + "px";
        renderConnections(); // Update lines live
    });
    document.addEventListener("mouseup", () => {
        if (dragging) {
            dragging = false;
            body.style.cursor = "";
        }
    });
}

function renderConnections() {
    const svg = document.getElementById("connectionsLayer");
    const cfNode = document.getElementById("cfNetwork");
    const canvas = document.getElementById("canvasContainer");
    const canvasRect = canvas.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${canvasRect.width} ${canvasRect.height}`);
    svg.setAttribute("width", canvasRect.width);
    svg.setAttribute("height", canvasRect.height);

    // CF center and radius (the .cf-network-inner is 160×160, border-radius: 50%)
    const cfRect = cfNode.getBoundingClientRect();
    const cfCx = cfRect.left - canvasRect.left + cfRect.width / 2;
    const cfCy = cfRect.top - canvasRect.top + cfRect.height / 2;
    const cfRadius = cfRect.width / 2 + 4; // +4 to land just outside the border

    // Pre-compute per-element connection indices for curve spreading
    const connsByElement = new Map();
    state.connections.forEach(conn => {
        if (!connsByElement.has(conn.elementId)) connsByElement.set(conn.elementId, []);
        connsByElement.get(conn.elementId).push(conn.id);
    });

    let html = "";
    // Defs for arrow markers
    html += `<defs>`;
    Object.entries(CONNECTORS).forEach(([key, c]) => {
        html += `<marker id="arrow-${key}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${c.color}"/></marker>`;
    });
    html += `</defs>`;

    state.connections.forEach(conn => {
        const el = state.elements.find(e => e.id === conn.elementId);
        if (!el) return;
        const connector = CONNECTORS[conn.connector];
        if (!connector) return;

        const ex = el.x;
        const ey = el.y;
        const isAppLevel = connector.direction === "Application-level";
        const isBidir = connector.direction === "Bidirectional";
        const lineClass = isAppLevel ? "connection-line" : (isBidir ? "connection-line-bidir" : "connection-line");

        // --- Spread multiple connections from the same element ---
        const siblings = connsByElement.get(conn.elementId) || [];
        const sibIdx = siblings.indexOf(conn.id);
        const sibCount = siblings.length;
        // Spread factor: 0 for single, alternating +/- for multiple
        // e.g. 2 connections: -0.5, +0.5; 3 connections: -1, 0, +1
        const spreadUnit = sibCount <= 1 ? 0 : (sibIdx - (sibCount - 1) / 2);
        const spreadPx = spreadUnit * 40; // 40px between curves

        // --- Compute the point on the CF circle edge facing the element ---
        const dxToEl = ex - cfCx;
        const dyToEl = ey - cfCy;
        const distToEl = Math.sqrt(dxToEl * dxToEl + dyToEl * dyToEl);
        // Edge point: unit vector from center toward element, scaled by radius
        const edgeX = cfCx + (dxToEl / distToEl) * cfRadius;
        const edgeY = cfCy + (dyToEl / distToEl) * cfRadius;

        // Calculate control point for curved line (element → edge)
        const midX = (ex + edgeX) / 2;
        const midY = (ey + edgeY) / 2;
        const dx = edgeX - ex;
        const dy = edgeY - ey;
        const segDist = Math.sqrt(dx * dx + dy * dy);
        const baseCurve = segDist * 0.18;
        // Perpendicular unit vector
        const pnx = -dy / segDist;
        const pny = dx / segDist;
        const cpX = midX + pnx * baseCurve + pnx * spreadPx;
        const cpY = midY + pny * baseCurve + pny * spreadPx;

        const pathD = `M ${ex} ${ey} Q ${cpX} ${cpY} ${edgeX} ${edgeY}`;

        // Glow background
        html += `<path d="${pathD}" class="connection-line-bg" stroke="${connector.color}" fill="none"/>`;

        // Main line
        if (isBidir) {
            html += `<path d="${pathD}" class="${lineClass}" stroke="${connector.color}" fill="none" marker-end="url(#arrow-${conn.connector})" marker-start="url(#arrow-${conn.connector})"/>`;
        } else {
            html += `<path d="${pathD}" class="${lineClass}" stroke="${connector.color}" fill="none"/>`;
        }

        // Label at midpoint of curve
        const lx = cpX;
        const ly = cpY;
        const labelText = connector.name.length > 22 ? connector.name.slice(0, 20) + ".." : connector.name;
        html += `<g class="connection-label-group">`;
        html += `<rect x="${lx - labelText.length * 2.5 - 4}" y="${ly - 7}" width="${labelText.length * 5 + 8}" height="14" rx="3" fill="var(--bg)" stroke="${connector.color}" stroke-width="0.5" opacity="0.9"/>`;
        html += `<text x="${lx}" y="${ly + 3}" text-anchor="middle" fill="${connector.color}" font-size="7" font-family="JetBrains Mono, monospace">${labelText}</text>`;
        html += `</g>`;
    });

    svg.innerHTML = html;
}

/** Derive a human-readable label from a Cloudflare docs URL path. */
function docLabelFromUrl(url) {
    const path = url.replace("https://developers.cloudflare.com/", "").replace(/\/+$/, "");
    const last = path.split("/").pop() || path;
    // "cloudflare-tunnel" -> "Cloudflare Tunnel", "scan-apps" -> "Scan Apps"
    return last.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function renderDetailPanel() {
    const empty = document.getElementById("detailEmpty");
    const content = document.getElementById("detailContent");

    if (!state.selectedElementId) {
        empty.style.display = "";
        content.style.display = "none";
        return;
    }

    const el = state.elements.find(e => e.id === state.selectedElementId);
    if (!el) { empty.style.display = ""; content.style.display = "none"; return; }

    const comp = COMPONENTS[el.type];
    if (!comp) return;

    empty.style.display = "none";
    content.style.display = "";

    document.getElementById("detailTitle").textContent = comp.label;
    document.getElementById("detailDesc").textContent = comp.desc;

    // Connections list
    const elConns = state.connections.filter(c => c.elementId === el.id);
    const connsHtml = elConns.map(c => {
        const conn = CONNECTORS[c.connector];
        return `<div class="detail-conn-item">
            <div class="conn-color" style="background:${conn.color}"></div>
            <span class="conn-name">${conn.name}</span>
            <button class="conn-remove" data-conn-id="${c.id}" title="Remove">&times;</button>
        </div>`;
    }).join("");
    const connsContainer = document.getElementById("detailConnections");
    connsContainer.innerHTML = elConns.length > 0
        ? `<h4 style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:6px">Active Connections</h4>` + connsHtml
        : `<p style="font-size:11px;color:var(--text-muted);font-style:italic">No connections yet. Use the connector buttons in the sidebar.</p>`;

    // Attach remove handlers
    connsContainer.querySelectorAll(".conn-remove").forEach(btn => {
        btn.addEventListener("click", () => removeConnection(btn.dataset.connId));
    });

    // Remove element button
    document.getElementById("btnRemoveElement").onclick = () => removeElement(el.id);

    // Info section
    let infoHtml = "";
    if (comp.compatibleConnectors.length > 0) {
        infoHtml += `<h4>Compatible Connectors</h4><ul>`;
        comp.compatibleConnectors.forEach(key => {
            const c = CONNECTORS[key];
            if (c) infoHtml += `<li><strong>${c.name}</strong> &mdash; ${c.protocol} (${c.direction})</li>`;
        });
        infoHtml += `</ul>`;
    }
    // Collect all relevant doc links: component + each compatible connector
    // Use connector/product name as label (not the component name)
    const docLinks = [];
    // For the component's own URL, find a matching connector name or derive from URL
    if (comp.docsUrl) {
        // Check if this URL matches any connector's docsUrl — use that name
        const matchingConn = Object.values(CONNECTORS).find(c => c.docsUrl === comp.docsUrl);
        const label = matchingConn ? matchingConn.name : docLabelFromUrl(comp.docsUrl);
        docLinks.push({ label, url: comp.docsUrl });
    }
    comp.compatibleConnectors.forEach(key => {
        const c = CONNECTORS[key];
        if (c && c.docsUrl && !docLinks.some(d => d.url === c.docsUrl)) {
            docLinks.push({ label: c.name, url: c.docsUrl });
        }
    });
    if (docLinks.length > 0) {
        infoHtml += `<h4>Documentation</h4><ul>`;
        docLinks.forEach(d => {
            infoHtml += `<li><a href="${d.url}" target="_blank" rel="noopener">${d.label}</a></li>`;
        });
        infoHtml += `</ul>`;
    }
    document.getElementById("detailInfo").innerHTML = infoHtml;
}

function renderConnectorStates() {
    const el = state.selectedElementId ? state.elements.find(e => e.id === state.selectedElementId) : null;
    const comp = el ? COMPONENTS[el.type] : null;
    document.querySelectorAll(".connector-btn").forEach(btn => {
        const key = btn.dataset.connector;
        btn.disabled = !comp || !comp.compatibleConnectors.includes(key);
    });
}

function renderDropZones() {
    const left = document.getElementById("dropZoneLeft");
    const right = document.getElementById("dropZoneRight");
    const hasUsers = state.elements.some(e => COMPONENTS[e.type]?.category === "users");
    const hasInfra = state.elements.some(e => COMPONENTS[e.type]?.category === "infrastructure");
    left.classList.toggle("has-items", hasUsers);
    right.classList.toggle("has-items", hasInfra);
}

/* ---------- PROGRESS ---------- */
function updateProgress() {
    // Progress = weighted mix of components + connections + achievements
    const maxComponents = 6;
    const maxConnections = 8;
    const maxAchievements = ACHIEVEMENTS.length;
    const compScore = Math.min(state.elements.length / maxComponents, 1) * 30;
    const connScore = Math.min(state.connections.length / maxConnections, 1) * 40;
    const achScore = (state.unlockedAchievements.size / maxAchievements) * 30;
    const pct = Math.round(compScore + connScore + achScore);
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressPct").textContent = pct + "%";
}

/* ---------- ACHIEVEMENTS ---------- */
function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (state.unlockedAchievements.has(ach.id)) return;
        if (ach.check(state)) {
            state.unlockedAchievements.add(ach.id);
            showToast(ach.title + " — " + ach.desc, "achievement");
        }
    });
    updateProgress();
}

/* ---------- TOASTS ---------- */
function showToast(message, type) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    const icons = { component: "\u{1F4E6}", connection: "\u{1F517}", achievement: "\u{1F3C6}", info: "\u{2139}\uFE0F", template: "\u{1F680}" };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || ""}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

/* ---------- CLICK OUTSIDE DESELECT ---------- */
document.addEventListener("click", (e) => {
    const canvas = document.getElementById("canvasContainer");
    if (!canvas.contains(e.target)) return;
    if (e.target.closest(".placed-element") || e.target.closest(".cf-network")) return;
    state.selectedElementId = null;
    renderAll();
});
