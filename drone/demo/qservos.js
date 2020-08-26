

function speedServo (y1,v1,speedRef) {
  const KP = 150;
  const KD = 20;
  let u = KP*(speedRef - y1) - KD*v1;
  return u;
}



function numberServo (y,v,numberRef) {
  const KP = 150;
  const KD = 20;
  let u = KP*(numberRef - y) - KD*v;
  return u;
}



function hoverServos (body, dt,yreff) {  // pass dt for integral control
	let yy = body.position.y;
	let vv = body.velocity.y;

	let error = yreff - yy;
	if (hoverServos.integral === undefined)
		hoverServos.integral = 0;
	hoverServos.integral += error*dt;

	const KP = 15;
	const KI = 4;
	const KD = 16;
	let omega = KP*error + KI*hoverServos.integral + KD*(-vv);
	return omega;
}


function yawServos (body, dt,yawReff,yawAnglee) {  // pass dt for integral control
	let error = yawReff - yawAnglee;	
	
	if (yawServos.integral === undefined)
		yawServos.integral = 0;
	yawServos.integral += error*dt;
	
	var diff = 0;
	if (yawServos.lastError !== undefined) {
	   diff = (error - yawServos.lastError)/dt;
//	   yawServo.lastError = error;
	}  
	yawServos.lastError = error;
	
	const KP = .3;
	const KI = 0//2;  // PD works, but not PID ...
	const KD = 15;
	let r = KP*error + KI*yawServos.integral + KD*diff;
	return r;
}
function yawServoss (body, dt,yawReff,yawAnglee) {  // pass dt for integral control
	let error = yawReff - yawAnglee;	
	
	if (yawServos.integral === undefined)
		yawServos.integral = 0;
	yawServos.integral += error*dt;
	
	var diff = 0;
	if (yawServos.lastError !== undefined) {
	   diff = (error - yawServos.lastError)/dt;
//	   yawServo.lastError = error;
	}  
	yawServos.lastError = error;
	
	const KP = .3;
	const KI = 0//2;  // PD works, but not PID ...
	const KD = 15;
	let r = KP*error + KI*yawServos.integral + KD*diff;
	return r;
}

function rollServos (body, dt,rollReff,rollAnglee) {  // pass dt for integral control

	let error = rollReff - rollAnglee;	
	
	if (rollServos.integral === undefined)
		rollServos.integral = 0;
	rollServos.integral += error*dt;
	
	var diff = 0;
	if (rollServos.lastError !== undefined) {
	   diff = (error - rollServos.lastError)/dt;
	   rollServos.lastError = error;
	}
	
	const KP = 2.5
	const KI = 0//2;  // PD works, but not PID ...
	const KD = 2;
	let r = KP*error + KI*rollServos.integral + KD*diff;
	//console.log ('r:'+r)
	return r;
}

function pitchServos (body,dt,pitchReff,pitchAnglee) {
	let error = pitchReff - pitchAnglee;	
	
	if (pitchServos.integral === undefined)
		pitchServos.integral = 0;
	pitchServos.integral += error*dt;
	
	var diff = 0;
	if (pitchServos.lastError !== undefined) {
	   diff = (error - pitchServos.lastError)/dt;
	   pitchServos.lastError = error;
	}
	
	const KP =2.5;
	const KI =0//2;  // PD works, but not PID ...
	const KD = 2;
	let r = KP*error + KI*pitchServos.integral + KD*diff;
	//console.log ('r:'+r)
	return r;
}



function hoverServo (body, dt) {  // pass dt for integral control
	let yy = body.position.y;
	let vv = body.velocity.y;

	let error = yref - yy;
	if (hoverServo.integral === undefined)
		hoverServo.integral = 0;
	hoverServo.integral += error*dt;

	const KP = 15;
	const KI = 4;
	const KD = 16;
	let omega = KP*error + KI*hoverServo.integral + KD*(-vv);
	return omega;
}


function yawServo (body, dt) {  // pass dt for integral control
	let error = yawRef - yawAngle;	
	
	if (yawServo.integral === undefined)
		yawServo.integral = 0;
	yawServo.integral += error*dt;
	
	var diff = 0;
	if (yawServo.lastError !== undefined) {
	   diff = (error - yawServo.lastError)/dt;
//	   yawServo.lastError = error;
	}  
	yawServo.lastError = error;
	
	const KP = .3;
	const KI = 0//2;  // PD works, but not PID ...
	const KD = 15;
	let r = KP*error + KI*yawServo.integral + KD*diff;
	return r;
}


function rollServo (body, dt) {  // pass dt for integral control

	let error = rollRef - rollAngle;	
	
	if (rollServo.integral === undefined)
		rollServo.integral = 0;
	rollServo.integral += error*dt;
	
	var diff = 0;
	if (rollServo.lastError !== undefined) {
	   diff = (error - rollServo.lastError)/dt;
	   rollServo.lastError = error;
	}
	
	const KP = 2.5
	const KI = 0//2;  // PD works, but not PID ...
	const KD = 2;
	let r = KP*error + KI*rollServo.integral + KD*diff;
	//console.log ('r:'+r)
	return r;
}

function pitchServo (body, dt) {
	let error = pitchRef - pitchAngle;	
	
	if (pitchServo.integral === undefined)
		pitchServo.integral = 0;
	pitchServo.integral += error*dt;
	
	var diff = 0;
	if (pitchServo.lastError !== undefined) {
	   diff = (error - pitchServo.lastError)/dt;
	   pitchServo.lastError = error;
	}
	
	const KP =2.5;
	const KI =0//2;  // PD works, but not PID ...
	const KD = 2;
	let r = KP*error + KI*pitchServo.integral + KD*diff;
	//console.log ('r:'+r)
	return r;
}
