/**
 * Use case templates — predefined architectures that auto-populate the canvas.
 *
 * Each template defines elements (type + side) and connections (elementIdx + connector).
 * To add a new template: add an entry here and a matching button in index.html.
 */

"use strict";

window.App = window.App || {};

window.App.TEMPLATES = {
    "vpn-replacement": {
        name: "Replace Your VPN",
        desc: "Remote workers connect via Cloudflare One Client; private apps are exposed through Cloudflare Tunnel. No public IPs required.",
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
        desc: "All user Internet traffic is filtered through Cloudflare Gateway (SWG). DNS filtering for offices, Cloudflare One Client for managed devices.",
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
        desc: "Cloud VPCs connected via automated Multi-Cloud Networking IPsec tunnels. Employees access resources through the Cloudflare One Client.",
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
            { elementIdx: 1, connector: "cloudflare-mesh" },
            { elementIdx: 2, connector: "appliance" },
            { elementIdx: 3, connector: "ipsec-tunnel" },
            { elementIdx: 4, connector: "cni" },
        ]
    },
    "agentic-ai": {
        name: "Agentic AI Access",
        desc: "AI agents connect to MCP servers via portals. Employees use the Cloudflare One Client alongside their agents. Private resources secured via Mesh and Tunnel.",
        docsUrl: "https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/",
        elements: [
            { type: "ai-agent", side: "left", slot: 0 },
            { type: "remote-user", side: "left", slot: 1 },
            { type: "mcp-server", side: "right", slot: 0 },
            { type: "mcp-server", side: "right", slot: 1 },
            { type: "datacenter", side: "right", slot: 2 },
        ],
        connections: [
            { elementIdx: 0, connector: "mcp-portal" },
            { elementIdx: 0, connector: "cloudflare-mesh" },
            { elementIdx: 1, connector: "warp-client" },
            { elementIdx: 2, connector: "mcp-portal" },
            { elementIdx: 3, connector: "access-saas" },
            { elementIdx: 4, connector: "cloudflare-tunnel" },
        ]
    },
    "ai-security": {
        name: "Holistic AI Security",
        desc: "Discover shadow AI with Gateway, enforce DLP on AI prompts, govern MCP servers with Access portals, and monitor SaaS AI posture with CASB.",
        docsUrl: "https://developers.cloudflare.com/learning-paths/holistic-ai-security/concepts/",
        elements: [
            { type: "remote-user", side: "left", slot: 0 },
            { type: "ai-agent", side: "left", slot: 1 },
            { type: "contractor", side: "left", slot: 2 },
            { type: "saas", side: "right", slot: 0 },
            { type: "mcp-server", side: "right", slot: 1 },
            { type: "mcp-server", side: "right", slot: 2 },
        ],
        connections: [
            { elementIdx: 0, connector: "warp-client" },
            { elementIdx: 1, connector: "mcp-portal" },
            { elementIdx: 2, connector: "clientless-rbi" },
            { elementIdx: 3, connector: "access-saas" },
            { elementIdx: 3, connector: "casb-api" },
            { elementIdx: 4, connector: "mcp-portal" },
            { elementIdx: 5, connector: "cloudflare-tunnel" },
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
