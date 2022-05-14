function handleKeys () {
    keyboard.update();
    const RATIO = 1.0003;

    // =================================== HOVER ===================================
    if (keyboard.pressed('up')) {
        $('#thrustUp').css ("background-color",  'yellow');
        omegaGain *= RATIO;
    }       
    if (keyboard.up('up')) {
        quadcopter.yref = body.position.y;
        console.log ('up set yref: ' + quadcopter.yref);
        omegaGain = 1;
        $('#thrustUp').css ("background-color",  'white');
    }
    if (keyboard.pressed('down')) {
        $('#thrustDo').css ("background-color",  'yellow');
        omegaGain /= RATIO;
    }
    if (keyboard.up('down')) {
        quadcopter.yref = body.position.y;
        console.log ('down set yref: ' + quadcopter.yref);
        $('#thrustDo').css ("background-color",  'white');
        omegaGain = 1;
    }
    // =================================== ROLL ===================================
    if (keyboard.pressed('D')) {
        $('#rollRight').css ("background-color",  'yellow');
        quadcopter.rollRef = 0.1;
        quadcopter.rolling = true;
    }
    if (keyboard.up('D')) {
        $('#rollRight').css ("background-color",  'white');

        quadcopter.rollRef = 0;
        quadcopter.rolling = false;  
    }
    if (keyboard.pressed('A')) {
        $('#rollLeft').css ("background-color",  'yellow');
        quadcopter.rollRef = -0.1;
        quadcopter.rolling = true;
    }
    if (keyboard.up('A')) {
        $('#rollLeft').css ("background-color",  'white');
        quadcopter.rollRef = 0;
        quadcopter.rolling = false;    
    }

    // =================================== PITCH ===================================
    if (keyboard.pressed('W')) {
        $('#pitchFore').css ("background-color",  'yellow');
        quadcopter.pitchRef = 0.1;
        quadcopter.pitching=true;
    }
    if (keyboard.up('W')) {
        $('#pitchFore').css ("background-color",  'white');
        quadcopter.pitchRef = 0;
        quadcopter.pitching = false; 
    }
    if (keyboard.pressed('S')) {
        $('#pitchAft').css ("background-color",  'yellow');
        quadcopter.pitchRef = -0.1;
        quadcopter.pitching=true;
    }
    if (keyboard.up('S')) {
        $('#pitchAft').css ("background-color",  'white');
        quadcopter.pitchRef = 0;
        quadcopter.pitching = false;   
    }

    // =================================== YAW ===================================

    if (keyboard.pressed('left')) {
        $('#cwTurn').css ("background-color",  'yellow');
        quadcopter.rYaw = omegaHover*0.1;
        // quadcopter.yawRef = 0.1
        quadcopter.turning = true;
    }
    if (keyboard.up('left')) {
        $('#cwTurn').css ("background-color",  'white');
        quadcopter.rYaw = 0;
        quadcopter.turning = false;
    
        // set up stopping reference
        quadcopter.yawRef = getBodyYaw(body);
        if((quadcopter.yawRef/Math.PI*180).toFixed(2) == 360) quadcopter.yawRef=0;
        console.log ('set thetaRef: ' + (quadcopter.yawRef/Math.PI*180).toFixed(2));
        //pidR2.setRef (Math.cos(quadcopter.yawRef), Math.sin(quadcopter.yawRef));            
    }
    if (keyboard.pressed('right')) {
        $('#ccwTurn').css ("background-color",  'yellow');
        quadcopter.rYaw = -omegaHover*0.1;
        // quadcopter.yawRef = -0.1;
        quadcopter.turning = true;
    }
    if (keyboard.up('right')) {
        $('#ccwTurn').css ("background-color",  'white');
        quadcopter.rYaw = 0;
        quadcopter.turning = false;

        // set up stopping reference
        quadcopter.yawRef = getBodyYaw(body);
        if((quadcopter.yawRef/Math.PI*180).toFixed(2) == 360) quadcopter.yawRef=0;
        console.log ('set thetaRef: ' + (quadcopter.yawRef/Math.PI*180).toFixed(2));
        console.log(quadcopter.turning+omegaHover);
    }
    if (keyboard.pressed('space')) {
        // quadcopter.yawRef = getBodyYaw(body);
        quadcopter.rYaw = 0;
        quadcopter.turning = false;
        quadcopter.pitchRef = 0;
        quadcopter.pitching = false; 
        quadcopter.yawAngle = 0;
        quadcopter.rolling = false;  
        $('#stop').css ("background-color",  'yellow');
    }
    if (keyboard.up('space')) {
        $('#stop').css ("background-color",  'white');
    }
    $('#gain').val (omegaGain);
    $('#yreftext').val (quadcopter.yref.toFixed(2));
}