
p = ProxySpace.push(s.boot);
m = NetAddr("127.0.0.1", 57121); 
// m = NetAddr("192.168.0.25", 57121); // para para enviar por red local 

(
// OSCdef genérico para Hydra
OSCdef(\hydraGen, { |msg|
    var data = msg[3];
    m.sendMsg("/hydra", data); // enviar valor ya normalizado
}, '/hydraDef');

// Generador de datos normalizados [-1,1]
~hydraSend = { SendReply.kr(Impulse.kr(30), '/hydraDef', ~hydraGen.kr) };

~hydraGen = {
    Demand.kr(
        Impulse.kr(30),
        0,
        Drand(Array.rand(20, -1.0, 1.0), inf) // valores ya normalizados
    )
};

// Para reiniciar si necesitas redefinir
OSCdef(\hydraGen).free;
)
