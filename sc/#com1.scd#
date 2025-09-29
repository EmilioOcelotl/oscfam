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
	q.sendAll(\hist, \emi, code);
};

)

p = ProxySpace.push(s.boot)

m = NetAddr("127.0.0.1", 57121); // IP de la máquina con Node.js

~gen1 = { Demand.kr(Impulse.kr(~tempo*1), 0, Drand(Array.rand(20, -1.0, 1.0), inf)) };

~hydraSend1 = {
    SendReply.kr(Impulse.kr(30), "/com1", ~gen1.kr);
};

OSCdef(\com1, { |msg| m.sendMsg("/com1", msg[3]) }, "/com1");
