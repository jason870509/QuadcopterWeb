function handleKeys () {
    keyboard.update();
    const RATIO = 1.0003;

    // =================================== HOVER ===================================
    if (keyboard.pressed('up')) {
        $('#thrustUp').css ("background-color",  'red');
        omegaGain *= RATIO;
    }       
    if (keyboard.up('up')) {
        yref = body.position.y;
        console.log ('up set yref: ' + yref);
        omegaGain = 1;
        $('#thrustUp').css ("background-color",  'white');
    }
    if (keyboard.pressed('down')) {
        $('#thrustDo').css ("background-color",  'yellow');
        omegaGain /= RATIO;
    }
    if (keyboard.up('down')) {
        yref = body.position.y;
        console.log ('down set yref: ' + yref);
        $('#thrustDo').css ("background-color",  'white');
        omegaGain = 1;
    }
    // =================================== ROLL ===================================
    if (keyboard.pressed('D')) {
        $('#rollRight').css ("background-color",  'yellow');
        //rRoll = omegaHover*0.01;
        rolling = true;
        rollRef = 0.1;
    }
    if (keyboard.up('D')) {
        $('#rollRight').css ("background-color",  'white');
        //rRoll = 0;//-omegaHover*0.005;
        rollRef = 0;
        rolling = false;  
    }
    if (keyboard.pressed('A')) {
        $('#rollLeft').css ("background-color",  'yellow');
        //rRoll = - omegaHover*0.01;
        rolling = true;
        rollRef = -0.1;
    }
    if (keyboard.up('A')) {
        $('#rollLeft').css ("background-color",  'white');
        rollRef = 0;
        rolling = false;    
    }

    // =================================== PITCH ===================================
    if (keyboard.pressed('W')) {
        $('#pitchFore').css ("background-color",  'yellow');
        pitchRef = 0.1;
        pitching=true;
    }
    if (keyboard.up('W')) {
        $('#pitchFore').css ("background-color",  'white');
        pitchRef = 0;
        pitching = false; 
    }
    if (keyboard.pressed('S')) {
        $('#pitchAft').css ("background-color",  'yellow');
        pitchRef = -0.1;
        pitching=true;
    }
    if (keyboard.up('S')) {
        $('#pitchAft').css ("background-color",  'white');
        pitchRef = 0;
        pitching = false;   
    }

    // =================================== YAW ===================================

    if (keyboard.pressed('left')) {
        $('#cwTurn').css ("background-color",  'yellow');
        rYaw = omegaHover*0.1;
        turning = true;
    }
    if (keyboard.up('left')) {
        $('#cwTurn').css ("background-color",  'white');
        rYaw = 0;
        turning = false;
    
        // set up stopping reference
        yawRef = getBodyYaw(body);
        if((yawRef/Math.PI*180).toFixed(2) == 360) yawRef=0;
        console.log ('set thetaRef: ' + (yawRef/Math.PI*180).toFixed(2));
        //pidR2.setRef (Math.cos(yawRef), Math.sin(yawRef));            
    }
    if (keyboard.pressed('right')) {
        $('#ccwTurn').css ("background-color",  'yellow');
        rYaw = -omegaHover*0.1;
        turning = true;
    }
    if (keyboard.up('right')) {
        $('#ccwTurn').css ("background-color",  'white');
        rYaw = 0;
        turning = false;
        // set up stopping reference
        yawRef = getBodyYaw(body);
        if((yawRef/Math.PI*180).toFixed(2) == 360) yawRef=0;
        console.log ('set thetaRef: ' + (yawRef/Math.PI*180).toFixed(2));
        console.log(turning+omegaHover);
    }
    if (keyboard.pressed('space')) {
        yawRef = getBodyYaw(body);
        rYaw=0;
        turning=false;
        pitchRef = 0;
        pitching = false; 
        rollRef = 0;
        rolling = false;  
        $('#stop').css ("background-color",  'yellow');
    }
    if (keyboard.up('space')) {
        $('#stop').css ("background-color",  'white');
    }
    $('#gain').val (omegaGain);
    $('#yreftext').val (yref.toFixed(2));
}