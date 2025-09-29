let com1 = 0;
let com2 = 0;

// Conectar al Node.js en LAN
const socket = new WebSocket("ws://192.168.0.25:8080"); // IP de la máquina Node.js

socket.onopen = () => console.log("WS conectado!");
socket.onclose = () => console.log("WS cerrado");
socket.onerror = (e) => console.error("WS error", e);

socket.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (msg.address === "/com1") com1 = parseFloat(msg.args[0]) || 0;
    if (msg.address === "/com2") com2 = parseFloat(msg.args[0]) || 0;
  } catch(e) { console.error(e); }
};

// Visual Hydra usando ambas variables
osc(10, () => com1, 1)
  .modulate(noise(() => com2 * 5))
  .out();
