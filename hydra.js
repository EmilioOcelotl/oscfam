// --- Configuración del WebSocket ---
let valorOSC = 0;

// Reemplaza con tu URL ngrok wss
const socket = new WebSocket("wss://mesodont-anson-saddenedly.ngrok-free.dev");

socket.onopen = () => console.log("WS conectado!");

socket.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);

    // Escucha solo el mensaje con la dirección /miControl
    if (msg.address === "/miControl") {
      // Convertimos a número y limitamos a -1..1
      let val = parseFloat(msg.args[0]) || 0;
      valorOSC = Math.max(-1, Math.min(1, val));
      // console.log("Valor OSC recibido:", valorOSC);
    }
  } catch (e) {
    console.error("JSON parse error:", e);
  }
};

socket.onclose = () => console.log("WS cerrado");
socket.onerror = (e) => console.error("WS error", e);

// --- Hydra visual ---
osc(10, () => valorOSC, 1)
  .modulate(noise(() => valorOSC * 5))
  .out();
