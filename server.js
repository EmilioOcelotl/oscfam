// server.js
const osc = require("osc");
const WebSocket = require("ws");

// WebSocket server (escucha local en 8080)
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server listening on :8080");
});

// OSC UDP server (recibe desde SuperCollider)
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121
});

udpPort.on("ready", () => {
  console.log("OSC UDP port open on 57121");
});

udpPort.on("message", (oscMsg) => {
  console.log("OSC recibido:", oscMsg);
  // Reenvía a todos los clientes WebSocket
  const payload = JSON.stringify(oscMsg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
});

udpPort.open();
