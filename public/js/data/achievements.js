/**
 * Achievement definitions — unlocked as the user builds their architecture.
 *
 * Each achievement has an id, title, description, and a check function that
 * receives the current state and returns true when the condition is met.
 */

"use strict";

window.App = window.App || {};

window.App.ACHIEVEMENTS = [
    {
        id: "first-place",
        title: "First Step",
        desc: "Placed your first component",
        check: s => s.elements.length >= 1
    },
    {
        id: "infra-ready",
        title: "Infrastructure Ready",
        desc: "Placed at least 2 infrastructure components",
        check: s => s.elements.filter(e => window.App.COMPONENTS[e.type]?.category === "infrastructure").length >= 2
    },
    {
        id: "users-connected",
        title: "Users Connected",
        desc: "Placed at least 2 user components",
        check: s => s.elements.filter(e => window.App.COMPONENTS[e.type]?.category === "users").length >= 2
    },
    {
        id: "first-connection",
        title: "First Connection",
        desc: "Attached your first connectivity option",
        check: s => s.connections.length >= 1
    },
    {
        id: "multi-connector",
        title: "Multi-Connector",
        desc: "Used 3 different connector types",
        check: s => new Set(s.connections.map(c => c.connector)).size >= 3
    },
    {
        id: "full-stack",
        title: "Full Stack SASE",
        desc: "Connected both users and infrastructure",
        check: s => {
            const hasUserConn = s.connections.some(c => window.App.COMPONENTS[s.elements.find(e => e.id === c.elementId)?.type]?.category === "users");
            const hasInfraConn = s.connections.some(c => window.App.COMPONENTS[s.elements.find(e => e.id === c.elementId)?.type]?.category === "infrastructure");
            return hasUserConn && hasInfraConn;
        }
    },
    {
        id: "architect",
        title: "SASE Architect",
        desc: "Built an architecture with 5+ connections",
        check: s => s.connections.length >= 5
    },
    {
        id: "cloud-native",
        title: "Cloud Native",
        desc: "Connected a cloud VPC with Multi-Cloud Networking",
        check: s => s.connections.some(c => c.connector === "multi-cloud")
    },
    {
        id: "zero-trust-hero",
        title: "Zero Trust Hero",
        desc: "Used WARP Client + Cloudflare Tunnel together",
        check: s => s.connections.some(c => c.connector === "warp-client") && s.connections.some(c => c.connector === "cloudflare-tunnel")
    },
];
