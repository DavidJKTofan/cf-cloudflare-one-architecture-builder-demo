/**
 * Full SASE preset — populates the canvas with all element types
 * and best-practice connections to showcase a complete architecture.
 */

"use strict";

window.App = window.App || {};

window.App.setupFullSase = function setupFullSase() {
    document.getElementById("btnFullSase").addEventListener("click", () => {
        window.App.applyFullSase();
    });
};

window.App.applyFullSase = function applyFullSase() {
    const { state, renderAll, checkAchievements, showToast } = window.App;

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

    // Layout: 5 user types on the left, 5 infra on the right
    const leftTypes  = ["remote-user", "office-user", "contractor", "iot", "ai-agent", "visitor"];
    const rightTypes = ["datacenter", "aws", "azure", "saas", "mcp-server", "email-security", "branch"];
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

    // Best-practice connections
    const connMap = [
        [0, "warp-client"],           // Remote Worker -> Cloudflare One Client
        [1, "warp-client"],           // Office Worker -> Cloudflare One Client
        [2, "clientless-rbi"],        // Contractor -> Clientless RBI
        [2, "proxy-endpoint"],        // Contractor -> Proxy Endpoint
        [3, "cloudflare-mesh"],       // IoT -> Cloudflare Mesh
        [3, "dns-location"],          // IoT -> DNS Location
        [4, "mcp-portal"],            // AI Agent -> MCP Server Portal
        [5, "dns-location"],          // Visitors -> DNS Location
        [6, "cloudflare-tunnel"],     // Data Center -> Tunnel
        [6, "ipsec-tunnel"],          // Data Center -> IPsec
        [7, "multi-cloud"],           // AWS -> Multi-Cloud Networking
        [8, "multi-cloud"],           // Azure -> Multi-Cloud Networking
        [9, "access-saas"],           // SaaS -> Access SSO
        [9, "casb-api"],              // SaaS -> CASB API
        [10, "mcp-portal"],           // MCP Server -> MCP Server Portal
        [11, "email-security-api"],   // Email Provider -> Email Security (API)
        [12, "appliance"],            // Branch -> Appliance
    ];
    connMap.forEach(([idx, connector]) => {
        const elId = state.elements[idx]?.id;
        if (!elId) return;
        state.connections.push({ id: "conn-" + (++state.idCounter), elementId: elId, connector });
    });

    renderAll();
    checkAchievements();
    showToast("Full SASE Architecture loaded", "template");
};
