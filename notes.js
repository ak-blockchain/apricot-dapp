var now = new Date().getTime();
	var then = new Date("March 17 2022 02:30");
	var cycles = (now - then)/(1000 * 60 * 15);
	console.log("cycles "+cycles)
	console.log("total amount distributed = "+0.7*price.usdPrice*((325000*1.000235**cycles)-325000));
