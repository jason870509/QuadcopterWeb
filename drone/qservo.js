function speedServo (y1, v1, speedRef) {
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


function hoverServo (body, dt) {  // pass dt for integral control
	let yy = body.position.y;
	let vv = body.velocity.y;

	let error = quadcopter.yref - yy;
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
	let error = quadcopter.yawRef - quadcopter.yawAngle;	
	
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

	let error = quadcopter.rollRef - quadcopter.rollAngle;	
	
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
	let error = quadcopter.pitchRef - quadcopter.pitchAngle;	
	
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

// class PIDControllerR2 {
// 	constructor(x = 0, y = 0, xref = 0, yref = 0) {
// 	  this.x = x;
// 	  this.y = y;
// 	  this.xref = xref;
// 	  this.yref = quadcopter.yref;
// 	  this.vx = 0;
// 	  this.vy = 0;
// 	  this.KP = 150; // 'spring constant'
// 	  this.KD = 20; // 'damping'
// 	  this.KI = 20;
// 	  this.integralX = 0;
// 	  this.integralY = 0;
// 	}
// 	update(dt) {
// 	  let errorX = this.xref - this.x;
// 	  let errorY = this.yref - this.y;
// 	  this.integralX += errorX*dt;
// 	  this.integralY += errorY*dt;
// 	  let fx = this.KP * errorX + this.KI*this.integralX - this.KD * this.vx;
// 	  let fy = this.KP * errorY + this.KI*this.integralY - this.KD * this.vy;
// 	  // plant: Euler's method (Newtonian dynamics)
// 	  this.vx += fx * dt;
// 	  this.x += this.vx * dt
// 	  this.vy += fy * dt;
// 	  this.y += this.vy * dt
// 	  return [this.x, this.y]
// 	}
// 	setRef(xref, yref) {
// 	  this.xref = xref;
// 	  this.yref = yref;
// 	}
//   }