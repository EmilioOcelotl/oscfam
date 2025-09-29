(
n = NetAddr("127.0.0.1", 57121); // puerto del servidor Node
Routine({
    loop {
        n.sendMsg("/miControl", rrand(-1.0, 1.0)); // manda un valor aleatorio
        1.wait;
    }
}).play;
)