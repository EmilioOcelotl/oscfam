# OSC → Hydra en Tiempo Real

Este proyecto permite enviar valores OSC desde **SuperCollider** hacia **Hydra** en el navegador, usando un **puente Node.js** con WebSockets y un túnel público vía **ngrok**. Esto permite controlar visualizaciones en Hydra en tiempo real, incluyendo valores negativos y positivos.

---

## ⚙️ Paso 1: Instalar Node.js y dependencias

```bash
npm install osc ws
```

---

## ⚙️ Paso 2: Configurar ngrok

1. Crear una cuenta gratuita en [ngrok.com](https://ngrok.com) y copiar tu **authtoken**.
2. Configurar en tu máquina:

```bash
ngrok config add-authtoken <TU_TOKEN>
```

3. Ejecutar el túnel al puerto 8080 (donde corre el servidor Node):

```bash
ngrok http 8080
```

> Ngrok generará una URL pública tipo `https://hola-hola-hola.ngrok-free.dev`.
> Para WebSockets, usar `wss://hola-hola-hola.ngrok-free.dev`.

---

## ⚙️ Paso 3: Configurar el servidor Node.js

Archivo `server.js`:

```js
const osc = require("osc");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const udpPort = new osc.UDPPort({ localAddress: "0.0.0.0", localPort: 57121 });

udpPort.on("message", (oscMsg) => {
  const payload = JSON.stringify(oscMsg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
});

udpPort.open();
console.log("Servidor Node.js listo: OSC 57121 → WS 8080");
```

Ejecutar:

```bash
node server.js
```

---

## ⚙️ Paso 4: Enviar OSC desde SuperCollider

```supercollider
(
n = NetAddr("127.0.0.1", 57121);

Routine({
    loop {
        // Enviar valor aleatorio entre -1 y 1
        n.sendMsg("/miControl", rrand(-1.0, 1.0));
        0.25.wait;
    }
}).play;
)
```

---

## ⚙️ Paso 5: Conectar Hydra al WebSocket

Código para pegar en [Hydra en línea](https://hydra.ojack.xyz/):

```js
let valorOSC = 0;

const socket = new WebSocket("wss://hola-hola-hola.ngrok-free.dev");

socket.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (msg.address === "/miControl") {
      let val = parseFloat(msg.args[0]) || 0;
      valorOSC = Math.max(-1, Math.min(1, val)); // limitar a [-1,1]
    }
  } catch(e) { console.error(e); }
};

// Hydra visual usando valorOSC
osc(10, () => valorOSC, 1)
  .modulate(noise(() => valorOSC * 5))
  .out();
```

---

## 🔹 Notas importantes

* Usar **wss://** si Hydra está en HTTPS, `ws://` no funcionará.
* Los valores OSC negativos son válidos, Hydra los interpreta correctamente gracias al `Math.max(-1, Math.min(1, val))`.
* Cada vez que reinicies ngrok, la URL pública cambia en la versión gratuita; reemplázala en Hydra.
* Puedes ajustar la frecuencia, amplitud y modulación en Hydra según tu proyecto.

---