let valorHydra = 0;

const socket = new WebSocket("wss://mesodont-anson-saddenedly.ngrok-free.dev");

socket.onopen = () => console.log("WS conectado!");

socket.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (msg.address === "/hydra") {
      valorHydra = parseFloat(msg.args[0]) || 0; // ya normalizado [-1,1]
    }
  } catch(e){ console.error(e); }
};

socket.onclose = () => console.log("WS cerrado");
socket.onerror = (e) => console.error("WS error", e);

// Hydra visual
osc(10, () => valorHydra, 1)
  .modulate(noise(() => valorHydra * 5)) // puedes escalar aquí
  .out();
