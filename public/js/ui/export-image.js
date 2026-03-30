/**
 * Export Image — renders the current canvas diagram as PNG or SVG.
 *
 * PNG: Uses the native Canvas API with pre-loaded SVG icons at 2x DPR.
 * SVG: Builds a standalone SVG document with embedded elements.
 *
 * The export button is a dropdown offering both format choices.
 */

"use strict";

window.App = window.App || {};

/* ================================================================
   Setup — dropdown toggle + format buttons
   ================================================================ */
window.App.setupExportImage = function setupExportImage() {
	var dropdown = document.getElementById("exportDropdown");
	var toggle = document.getElementById("btnExportToggle");
	var menu = document.getElementById("exportMenu");
	if (!dropdown || !toggle || !menu) return;

	/* Toggle open/close */
	toggle.addEventListener("click", function (e) {
		e.stopPropagation();
		dropdown.classList.toggle("open");
	});

	/* Close when clicking outside */
	document.addEventListener("click", function () {
		dropdown.classList.remove("open");
	});

	/* Prevent clicks inside menu from closing immediately */
	menu.addEventListener("click", function (e) {
		e.stopPropagation();
	});

	/* Format buttons */
	menu.querySelectorAll(".export-option").forEach(function (btn) {
		btn.addEventListener("click", function () {
			var format = btn.dataset.format;
			dropdown.classList.remove("open");
			if (format === "svg") {
				window.App.exportCanvasAsSvg();
			} else {
				window.App.exportCanvasAsPng();
			}
		});
	});
};

/* ================================================================
   Shared helpers
   ================================================================ */

function getThemeColors() {
	var isDark = !document.documentElement.hasAttribute("data-theme") ||
		document.documentElement.getAttribute("data-theme") === "dark";
	if (!document.documentElement.hasAttribute("data-theme") &&
		window.matchMedia("(prefers-color-scheme: light)").matches) {
		isDark = false;
	}
	return {
		isDark: isDark,
		bg: isDark ? "#0C0F14" : "#F4F5F7",
		textPrimary: isDark ? "#E8ECF4" : "#1A1D26",
		textSecondary: isDark ? "#8B92A5" : "#555D73",
		textMuted: isDark ? "#555D73" : "#8B92A5",
		border: isDark ? "#252A36" : "#D8DCE5",
		card: isDark ? "#1E222D" : "#FFFFFF",
		cfOrange: "#F38020",
		cfGlow: isDark ? "rgba(243,128,32,0.12)" : "rgba(243,128,32,0.08)",
		cfNetBg: isDark ? "rgba(243,128,32,0.08)" : "rgba(243,128,32,0.06)",
		tagBg: isDark ? "rgba(243,128,32,0.1)" : "rgba(243,128,32,0.08)",
		tagBorder: isDark ? "rgba(243,128,32,0.25)" : "rgba(243,128,32,0.2)"
	};
}

function computeBounds(state, canvasContainer) {
	var containerRect = canvasContainer.getBoundingClientRect();
	var cx = containerRect.width / 2;
	var cy = containerRect.height / 2;
	var padding = 80;
	var minX = cx - 90, maxX = cx + 90, minY = cy - 90, maxY = cy + 90;

	state.elements.forEach(function (elem) {
		if (elem.x - 50 < minX) minX = elem.x - 50;
		if (elem.x + 50 > maxX) maxX = elem.x + 50;
		if (elem.y - 50 < minY) minY = elem.y - 50;
		if (elem.y + 70 > maxY) maxY = elem.y + 70;
	});

	return {
		cx: cx, cy: cy,
		minX: minX - padding, minY: minY - padding,
		maxX: maxX + padding, maxY: maxY + padding,
		width: (maxX + padding) - (minX - padding),
		height: (maxY + padding) - (minY - padding)
	};
}

function escXml(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Compute Bezier curve spread — matches engine/connections.js logic */
function getConnectionGeometry(conn, state, CONNECTORS, bounds) {
	var elem = state.elements.find(function (e) { return e.id === conn.elementId; });
	if (!elem) return null;
	var connDef = CONNECTORS[conn.connector];
	if (!connDef) return null;

	var cfCx = bounds.cx - bounds.minX;
	var cfCy = bounds.cy - bounds.minY;
	var cfRadius = 94;
	var ex = elem.x - bounds.minX;
	var ey = elem.y - bounds.minY;

	/* Spread multiple connections from same element */
	var siblings = state.connections.filter(function (c) { return c.elementId === conn.elementId; });
	var sibIdx = siblings.indexOf(conn);
	if (sibIdx === -1) sibIdx = 0;
	var sibCount = siblings.length;
	var spreadUnit = sibCount <= 1 ? 0 : (sibIdx - (sibCount - 1) / 2);
	var spreadPx = spreadUnit * 40;

	/* Edge point on CF circle */
	var dxToEl = ex - cfCx;
	var dyToEl = ey - cfCy;
	var distToEl = Math.sqrt(dxToEl * dxToEl + dyToEl * dyToEl);
	var edgeX = cfCx + (dxToEl / distToEl) * cfRadius;
	var edgeY = cfCy + (dyToEl / distToEl) * cfRadius;

	/* Control point */
	var midX = (ex + edgeX) / 2;
	var midY = (ey + edgeY) / 2;
	var dx = edgeX - ex;
	var dy = edgeY - ey;
	var segDist = Math.sqrt(dx * dx + dy * dy);
	var baseCurve = segDist * 0.18;
	var pnx = -dy / segDist;
	var pny = dx / segDist;
	var cpX = midX + pnx * baseCurve + pnx * spreadPx;
	var cpY = midY + pny * baseCurve + pny * spreadPx;

	return {
		ex: ex, ey: ey,
		edgeX: edgeX, edgeY: edgeY,
		cpX: cpX, cpY: cpY,
		cfCx: cfCx, cfCy: cfCy,
		color: connDef.color,
		direction: connDef.direction || "",
		name: connDef.name || conn.connector,
		connector: conn.connector
	};
}

/* ================================================================
   PNG Export
   ================================================================ */

function loadSvgAsImage(svgString, color) {
	return new Promise(function (resolve) {
		var colored = svgString
			.replace(/currentColor/g, color)
			.replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ');
		var blob = new Blob([colored], { type: "image/svg+xml;charset=utf-8" });
		var url = URL.createObjectURL(blob);
		var img = new Image();
		img.onload = function () {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = function () {
			URL.revokeObjectURL(url);
			resolve(null);
		};
		img.src = url;
	});
}

window.App.exportCanvasAsPng = function exportCanvasAsPng() {
	var canvasContainer = document.getElementById("canvasContainer");
	if (!canvasContainer) return;
	var state = window.App.state;
	var COMPONENTS = window.App.COMPONENTS;
	var CONNECTORS = window.App.CONNECTORS;

	if (state.elements.length === 0) {
		window.App.showToast("Nothing to export — place some elements first", "info");
		return;
	}

	var iconPromises = state.elements.map(function (elem) {
		var comp = COMPONENTS[elem.type];
		if (!comp) return Promise.resolve(null);
		return loadSvgAsImage(comp.icon, comp.color);
	});

	Promise.all(iconPromises).then(function (iconImages) {
		renderPng(canvasContainer, state, COMPONENTS, CONNECTORS, iconImages);
	});
};

function renderPng(canvasContainer, state, COMPONENTS, CONNECTORS, iconImages) {
	var bounds = computeBounds(state, canvasContainer);
	var t = getThemeColors();
	var w = bounds.width, h = bounds.height;

	var scale = 2;
	var offscreen = document.createElement("canvas");
	offscreen.width = w * scale;
	offscreen.height = h * scale;
	var ctx = offscreen.getContext("2d");
	ctx.scale(scale, scale);

	/* Background */
	ctx.fillStyle = t.bg;
	ctx.fillRect(0, 0, w, h);

	/* Grid dots */
	ctx.fillStyle = t.border;
	for (var gx = 0; gx < w; gx += 24) {
		for (var gy = 0; gy < h; gy += 24) {
			ctx.beginPath();
			ctx.arc(gx, gy, 0.5, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	var cfCx = bounds.cx - bounds.minX;
	var cfCy = bounds.cy - bounds.minY;

	/* Connection lines */
	state.connections.forEach(function (conn) {
		var geo = getConnectionGeometry(conn, state, CONNECTORS, bounds);
		if (!geo) return;

		/* Background glow */
		ctx.save();
		ctx.strokeStyle = geo.color;
		ctx.globalAlpha = 0.08;
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(geo.ex, geo.ey);
		ctx.quadraticCurveTo(geo.cpX, geo.cpY, geo.edgeX, geo.edgeY);
		ctx.stroke();
		ctx.restore();

		/* Main line */
		ctx.save();
		ctx.strokeStyle = geo.color;
		ctx.lineWidth = geo.direction.indexOf("Bidirectional") !== -1 ? 2.5 : 2;
		if (geo.direction.indexOf("Bidirectional") === -1) ctx.setLineDash([6, 4]);
		ctx.beginPath();
		ctx.moveTo(geo.ex, geo.ey);
		ctx.quadraticCurveTo(geo.cpX, geo.cpY, geo.edgeX, geo.edgeY);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.restore();

		/* Label */
		ctx.save();
		ctx.font = "500 8px 'JetBrains Mono', monospace";
		var label = geo.name;
		var lw = ctx.measureText(label).width;
		ctx.fillStyle = t.bg;
		ctx.fillRect(geo.cpX - lw / 2 - 4, geo.cpY - 7, lw + 8, 14);
		ctx.fillStyle = t.textMuted;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(label, geo.cpX, geo.cpY);
		ctx.restore();
	});

	/* CF Network node */
	drawCfNetworkPng(ctx, cfCx, cfCy, t);

	/* Elements */
	state.elements.forEach(function (elem, idx) {
		var comp = COMPONENTS[elem.type];
		if (!comp) return;
		var ex = elem.x - bounds.minX;
		var ey = elem.y - bounds.minY;

		ctx.save();
		ctx.fillStyle = t.card;
		ctx.strokeStyle = comp.color + "30";
		ctx.lineWidth = 2;
		roundRectPath(ctx, ex - 32, ey - 32, 64, 64, 14);
		ctx.fill();
		ctx.stroke();
		ctx.restore();

		var iconImg = iconImages[idx];
		if (iconImg) ctx.drawImage(iconImg, ex - 14, ey - 14, 28, 28);

		var elConns = state.connections.filter(function (c) { return c.elementId === elem.id; });
		elConns.forEach(function (c, i) {
			var connDef = CONNECTORS[c.connector];
			if (!connDef) return;
			ctx.fillStyle = connDef.color;
			ctx.beginPath();
			ctx.arc(ex + 26 - i * 12, ey - 34, 5, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = t.card;
			ctx.beginPath();
			ctx.arc(ex + 26 - i * 12, ey - 34, 3, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.save();
		ctx.font = "600 10px 'DM Sans', sans-serif";
		ctx.fillStyle = t.textSecondary;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText(comp.label, ex, ey + 36);
		ctx.restore();
	});

	/* Watermark */
	ctx.save();
	ctx.font = "500 10px 'DM Sans', sans-serif";
	ctx.fillStyle = t.textMuted;
	ctx.textAlign = "right";
	ctx.textBaseline = "bottom";
	ctx.fillText("Cloudflare One Architecture Builder", w - 16, h - 12);
	ctx.restore();

	/* Download */
	offscreen.toBlob(function (blob) {
		if (!blob) return;
		downloadBlob(blob, "cloudflare-one-architecture.png");
		window.App.showToast("Architecture exported as PNG", "export");
	}, "image/png");
}

function drawCfNetworkPng(ctx, cx, cy, t) {
	var r = 90;

	ctx.save();
	var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r + 30);
	glow.addColorStop(0, t.cfGlow);
	glow.addColorStop(1, "transparent");
	ctx.fillStyle = glow;
	ctx.beginPath(); ctx.arc(cx, cy, r + 30, 0, Math.PI * 2); ctx.fill();
	ctx.restore();

	ctx.save();
	ctx.strokeStyle = t.cfOrange; ctx.lineWidth = 2;
	ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
	ctx.restore();

	ctx.save();
	var bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
	bg.addColorStop(0, t.cfNetBg); bg.addColorStop(1, t.bg);
	ctx.fillStyle = bg;
	ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
	ctx.restore();

	/* Shield */
	ctx.save();
	ctx.fillStyle = t.cfOrange; ctx.globalAlpha = 0.3;
	ctx.beginPath();
	ctx.moveTo(cx, cy - 30); ctx.lineTo(cx - 18, cy - 20);
	ctx.lineTo(cx - 18, cy - 8);
	ctx.quadraticCurveTo(cx, cy + 8, cx, cy + 8);
	ctx.quadraticCurveTo(cx, cy + 8, cx + 18, cy - 8);
	ctx.lineTo(cx + 18, cy - 20); ctx.closePath(); ctx.fill();
	ctx.globalAlpha = 1;
	ctx.font = "700 8px 'DM Sans', sans-serif"; ctx.fillStyle = "#fff";
	ctx.textAlign = "center"; ctx.textBaseline = "middle";
	ctx.fillText("CF", cx, cy - 12);
	ctx.restore();

	ctx.save();
	ctx.font = "600 10px 'DM Sans', sans-serif"; ctx.fillStyle = t.textPrimary;
	ctx.textAlign = "center"; ctx.textBaseline = "top";
	ctx.fillText("Cloudflare", cx, cy + 12);
	ctx.fillText("Global Network", cx, cy + 24);
	ctx.restore();

	var tags = ["SWG", "ZTNA", "CASB", "DLP", "RBI", "FW", "CES", "DEX", "WAN", "DNS"];
	ctx.save();
	ctx.font = "500 7px 'JetBrains Mono', monospace";
	ctx.textAlign = "center"; ctx.textBaseline = "middle";
	drawTagRowPng(ctx, tags.slice(0, 5), cx, cy + 42, 24, 2, t);
	drawTagRowPng(ctx, tags.slice(5), cx, cy + 56, 24, 2, t);
	ctx.restore();
}

function drawTagRowPng(ctx, tags, cx, y, tw, gap, t) {
	var total = tags.length * tw + (tags.length - 1) * gap;
	var sx = cx - total / 2;
	tags.forEach(function (tag, i) {
		var x = sx + i * (tw + gap);
		ctx.fillStyle = t.tagBg;
		roundRectPath(ctx, x, y - 6, tw, 12, 3); ctx.fill();
		ctx.strokeStyle = t.tagBorder; ctx.lineWidth = 1;
		roundRectPath(ctx, x, y - 6, tw, 12, 3); ctx.stroke();
		ctx.fillStyle = t.cfOrange;
		ctx.fillText(tag, x + tw / 2, y);
	});
}

function roundRectPath(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}

/* ================================================================
   SVG Export
   ================================================================ */

window.App.exportCanvasAsSvg = function exportCanvasAsSvg() {
	var canvasContainer = document.getElementById("canvasContainer");
	if (!canvasContainer) return;
	var state = window.App.state;
	var COMPONENTS = window.App.COMPONENTS;
	var CONNECTORS = window.App.CONNECTORS;

	if (state.elements.length === 0) {
		window.App.showToast("Nothing to export — place some elements first", "info");
		return;
	}

	var bounds = computeBounds(state, canvasContainer);
	var t = getThemeColors();
	var w = bounds.width, h = bounds.height;
	var cfCx = bounds.cx - bounds.minX;
	var cfCy = bounds.cy - bounds.minY;

	var parts = [];
	parts.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" font-family="\'DM Sans\', system-ui, sans-serif">');

	/* Defs — arrow markers */
	parts.push("<defs>");
	/* Grid pattern */
	parts.push('<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">');
	parts.push('<circle cx="0" cy="0" r="0.5" fill="' + t.border + '"/>');
	parts.push("</pattern>");
	Object.keys(CONNECTORS).forEach(function (key) {
		var c = CONNECTORS[key];
		parts.push('<marker id="arrow-' + key + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">');
		parts.push('<path d="M 0 0 L 10 5 L 0 10 z" fill="' + c.color + '"/>');
		parts.push("</marker>");
	});
	parts.push("</defs>");

	/* Background */
	parts.push('<rect width="' + w + '" height="' + h + '" fill="' + t.bg + '"/>');
	parts.push('<rect width="' + w + '" height="' + h + '" fill="url(#grid)"/>');

	/* Connection lines */
	state.connections.forEach(function (conn) {
		var geo = getConnectionGeometry(conn, state, CONNECTORS, bounds);
		if (!geo) return;
		var pathD = "M " + geo.ex + " " + geo.ey + " Q " + geo.cpX + " " + geo.cpY + " " + geo.edgeX + " " + geo.edgeY;

		/* Glow */
		parts.push('<path d="' + pathD + '" fill="none" stroke="' + geo.color + '" stroke-width="6" opacity="0.08"/>');

		/* Main */
		var isBidir = geo.direction.indexOf("Bidirectional") !== -1;
		if (isBidir) {
			parts.push('<path d="' + pathD + '" fill="none" stroke="' + geo.color + '" stroke-width="2.5" marker-start="url(#arrow-' + geo.connector + ')" marker-end="url(#arrow-' + geo.connector + ')"/>');
		} else {
			parts.push('<path d="' + pathD + '" fill="none" stroke="' + geo.color + '" stroke-width="2" stroke-dasharray="6 4"/>');
		}

		/* Label */
		var label = escXml(geo.name);
		var labelW = label.length * 5 + 8;
		parts.push('<g>');
		parts.push('<rect x="' + (geo.cpX - labelW / 2) + '" y="' + (geo.cpY - 7) + '" width="' + labelW + '" height="14" rx="3" fill="' + t.bg + '" stroke="' + geo.color + '" stroke-width="0.5" opacity="0.9"/>');
		parts.push('<text x="' + geo.cpX + '" y="' + (geo.cpY + 3) + '" text-anchor="middle" fill="' + geo.color + '" font-size="7" font-family="\'JetBrains Mono\', monospace">' + label + '</text>');
		parts.push("</g>");
	});

	/* CF Network node */
	parts.push(buildCfNetworkSvg(cfCx, cfCy, t));

	/* Elements */
	state.elements.forEach(function (elem) {
		var comp = COMPONENTS[elem.type];
		if (!comp) return;
		var ex = elem.x - bounds.minX;
		var ey = elem.y - bounds.minY;

		/* Body */
		parts.push('<rect x="' + (ex - 32) + '" y="' + (ey - 32) + '" width="64" height="64" rx="14" fill="' + t.card + '" stroke="' + comp.color + '30" stroke-width="2"/>');

		/* Icon */
		var iconSvg = comp.icon
			.replace(/currentColor/g, comp.color)
			.replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ');
		parts.push('<g transform="translate(' + (ex - 14) + ',' + (ey - 14) + ') scale(' + (28 / 24) + ')">');
		/* Strip outer SVG tags and embed the inner content */
		var innerIcon = iconSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");
		parts.push('<g stroke="' + comp.color + '" fill="none" stroke-width="1.5">' + innerIcon + '</g>');
		parts.push("</g>");

		/* Connector dots */
		var elConns = state.connections.filter(function (c) { return c.elementId === elem.id; });
		elConns.forEach(function (c, i) {
			var connDef = CONNECTORS[c.connector];
			if (!connDef) return;
			var dotX = ex + 26 - i * 12;
			var dotY = ey - 34;
			parts.push('<circle cx="' + dotX + '" cy="' + dotY + '" r="5" fill="' + connDef.color + '"/>');
			parts.push('<circle cx="' + dotX + '" cy="' + dotY + '" r="3" fill="' + t.card + '"/>');
		});

		/* Label */
		parts.push('<text x="' + ex + '" y="' + (ey + 46) + '" text-anchor="middle" fill="' + t.textSecondary + '" font-size="10" font-weight="600">' + escXml(comp.label) + '</text>');
	});

	/* Watermark */
	parts.push('<text x="' + (w - 16) + '" y="' + (h - 12) + '" text-anchor="end" fill="' + t.textMuted + '" font-size="10" font-weight="500">Cloudflare One Architecture Builder</text>');

	parts.push("</svg>");

	var svgContent = parts.join("\n");
	var blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
	downloadBlob(blob, "cloudflare-one-architecture.svg");
	window.App.showToast("Architecture exported as SVG", "export");
};

function buildCfNetworkSvg(cx, cy, t) {
	var r = 90;
	var s = [];

	/* Glow */
	s.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 30) + '" fill="' + t.cfGlow + '"/>');

	/* Border + fill */
	s.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + t.cfNetBg + '" stroke="' + t.cfOrange + '" stroke-width="2"/>');

	/* Shield */
	s.push('<path d="M ' + cx + ' ' + (cy - 30) + ' L ' + (cx - 18) + ' ' + (cy - 20) + ' L ' + (cx - 18) + ' ' + (cy - 8) + ' Q ' + cx + ' ' + (cy + 8) + ' ' + cx + ' ' + (cy + 8) + ' Q ' + cx + ' ' + (cy + 8) + ' ' + (cx + 18) + ' ' + (cy - 8) + ' L ' + (cx + 18) + ' ' + (cy - 20) + ' Z" fill="' + t.cfOrange + '" opacity="0.3"/>');
	s.push('<text x="' + cx + '" y="' + (cy - 10) + '" text-anchor="middle" fill="#fff" font-size="8" font-weight="700" font-family="\'DM Sans\', sans-serif">CF</text>');

	/* Labels */
	s.push('<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" fill="' + t.textPrimary + '" font-size="10" font-weight="600">Cloudflare</text>');
	s.push('<text x="' + cx + '" y="' + (cy + 30) + '" text-anchor="middle" fill="' + t.textPrimary + '" font-size="10" font-weight="600">Global Network</text>');

	/* Tags */
	var tags = ["SWG", "ZTNA", "CASB", "DLP", "RBI", "FW", "CES", "DEX", "WAN", "DNS"];
	s.push(buildTagRowSvg(tags.slice(0, 5), cx, cy + 44, 24, 2, t));
	s.push(buildTagRowSvg(tags.slice(5), cx, cy + 58, 24, 2, t));

	return s.join("\n");
}

function buildTagRowSvg(tags, cx, y, tw, gap, t) {
	var total = tags.length * tw + (tags.length - 1) * gap;
	var sx = cx - total / 2;
	var s = [];
	tags.forEach(function (tag, i) {
		var x = sx + i * (tw + gap);
		s.push('<rect x="' + x + '" y="' + (y - 6) + '" width="' + tw + '" height="12" rx="3" fill="' + t.tagBg + '" stroke="' + t.tagBorder + '" stroke-width="1"/>');
		s.push('<text x="' + (x + tw / 2) + '" y="' + (y + 1) + '" text-anchor="middle" fill="' + t.cfOrange + '" font-size="7" font-weight="500" font-family="\'JetBrains Mono\', monospace">' + tag + '</text>');
	});
	return s.join("\n");
}

/* ================================================================
   Download helper
   ================================================================ */

function downloadBlob(blob, filename) {
	var url = URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
