const osc = require("osc");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server listening on :8080");
});

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",  // escucha en todas las interfaces
  localPort: 57121
});

udpPort.on("ready", () => console.log("OSC UDP port open on 57121"));

udpPort.on("message", (oscMsg) => {
  const payload = JSON.stringify(oscMsg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
});

udpPort.open();
