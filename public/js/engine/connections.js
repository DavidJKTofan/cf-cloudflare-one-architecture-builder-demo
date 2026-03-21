/**
 * SVG connection line rendering.
 *
 * Draws quadratic Bezier curves from each element to the Cloudflare network
 * circle edge. Supports curve spreading when multiple connections share an
 * element, directional arrows for bidirectional connectors, and animated
 * dashes for on-ramp / off-ramp connectors.
 */

"use strict";

window.App = window.App || {};

window.App.renderConnections = function renderConnections() {
    const { state, CONNECTORS } = window.App;
    const svg = document.getElementById("connectionsLayer");
    const cfNode = document.getElementById("cfNetwork");
    const canvas = document.getElementById("canvasContainer");
    const canvasRect = canvas.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${canvasRect.width} ${canvasRect.height}`);
    svg.setAttribute("width", canvasRect.width);
    svg.setAttribute("height", canvasRect.height);

    // CF center and radius
    const cfRect = cfNode.getBoundingClientRect();
    const cfCx = cfRect.left - canvasRect.left + cfRect.width / 2;
    const cfCy = cfRect.top - canvasRect.top + cfRect.height / 2;
    const cfRadius = cfRect.width / 2 + 4;

    // Pre-compute per-element connection indices for curve spreading
    const connsByElement = new Map();
    state.connections.forEach(conn => {
        if (!connsByElement.has(conn.elementId)) connsByElement.set(conn.elementId, []);
        connsByElement.get(conn.elementId).push(conn.id);
    });

    let html = "<defs>";
    Object.entries(CONNECTORS).forEach(([key, c]) => {
        html += `<marker id="arrow-${key}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${c.color}"/></marker>`;
    });
    html += "</defs>";

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

        // Spread multiple connections from the same element
        const siblings = connsByElement.get(conn.elementId) || [];
        const sibIdx = siblings.indexOf(conn.id);
        const sibCount = siblings.length;
        const spreadUnit = sibCount <= 1 ? 0 : (sibIdx - (sibCount - 1) / 2);
        const spreadPx = spreadUnit * 40;

        // Point on CF circle edge facing the element
        const dxToEl = ex - cfCx;
        const dyToEl = ey - cfCy;
        const distToEl = Math.sqrt(dxToEl * dxToEl + dyToEl * dyToEl);
        const edgeX = cfCx + (dxToEl / distToEl) * cfRadius;
        const edgeY = cfCy + (dyToEl / distToEl) * cfRadius;

        // Control point for quadratic Bezier
        const midX = (ex + edgeX) / 2;
        const midY = (ey + edgeY) / 2;
        const dx = edgeX - ex;
        const dy = edgeY - ey;
        const segDist = Math.sqrt(dx * dx + dy * dy);
        const baseCurve = segDist * 0.18;
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
};
