// History //

(
q = ();
NetAddr.broadcastFlag = true;
q.addrs = (0..7).collect { |x|
		NetAddr("255.255.255.255", 57120 + x)
};
q.sendAll = { |q ... args|
		q.addrs.do { |addr|
				addr.sendMsg(*args)
		}; ""
}

);

// history simple

(

History.start;
//History.makeWin;

OSCdef(\hist, { |msg|
	msg.postln;
	History.enter(msg[2].asString, msg[1]);
}, \hist).fix;

History.localOff;

History.forwardFunc = { |code|
	//q.sendAll(\hist, \killall, code);
	q.sendAll(\hist, \lxow, code);
};

)

p = ProxySpace.push(s.boot);
m = NetAddr("127.0.0.1", 57121); // cambiar a la ruta de la otra compu

~gen2 = {
    Demand.kr(Impulse.kr(30), 0, Drand(Array.rand(20, -1.0, 1.0), inf))
};

// enviar ambos
~hydraSend2 = {
    SendReply.kr(Impulse.kr(30), "/com2gen", gen1.kr);
};

// reenviar al servidor Node.js
OSCdef(\noise2, { |msg| m.sendMsg("/com2gen", msg[3]) }, "/com2");