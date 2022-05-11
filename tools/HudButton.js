
function HUDControler() {
    const RATIO = 1.0003;
    // console.log(mousepick)
    if(ControlPick !== undefined && controlOne == 2 && mousepick == true){
        let p = ControlPick.position.clone().sub(HUD_object["controlRange"][1].children[0].position)
        // for rolling
        if(Math.abs(p.x) > Math.abs(p.y)){
            if(p.x > 0){				
                $('#rollLeft').css ("background-color",  'yellow');
                rollRef = 0.1;
            }
            if(p.x < 0){
                $('#rollRight').css ("background-color",  'yellow');
                rollRef = -0.1;
            }
            handUp = 1;
            nowRoll = true;
        }
        // for pitching
        else if(Math.abs(p.x) < Math.abs(p.y)){
            if(p.y > 0){				
                $('#pitchFore').css ("background-color",  'yellow');
                pitchRef = 0.1;
            }
            if(p.y < 0){
                $('#pitchAft').css ("background-color",  'yellow');
                pitchRef = -0.1;
            }
            nowPitch = true;
            handUp = 2;
        }
    }

    else if (ControlPick !== undefined && controlOne == 1 && mousepick == true){
        let p = ControlPick.position.clone().sub(HUD_object["controlRange"][0].children[0].position)
        // for yawing
        if(Math.abs(p.x) > Math.abs(p.y)){
            if(p.x > 0){				
                $('#ccwTurn').css ("background-color",  'yellow');
                rYaw = -omegaHover*0.1;
            }
            if(p.x < 0){
                $('#cwTurn').css ("background-color",  'yellow');
                rYaw = omegaHover*0.1;
            }
            nowYaw = true;
            handUp = 3;
            turning = true;
        }
        // for hovering
        else if(Math.abs(p.x) < Math.abs(p.y)){
            if(p.y > 0){				
                $('#thrustUp').css ("background-color",  'red');
                omegaGain *= RATIO;
            }
            if(p.y < 0){
                $('#thrustDo').css ("background-color",  'yellow');
                omegaGain /= RATIO;
            }
            nowHover = true;
            handUp = 4;
        }
    }
/*if(nowRoll == true && handUp != 1){
    $('#rollLeft').css ("background-color",  'white');
    $('#rollRight').css ("background-color",  'white');
    rollRef = 0;
    rolling = false;	
}
if(nowPitch == true && handUp != 2){
    $('#pitchAft').css ("background-color",  'white');
    $('#pitchFore').css ("background-color",  'white');
    pitchRef = 0;
    pitching = false;		
}
if(nowYaw == true && handUp != 3){
    $('#ccwTurn').css ("background-color",  'white');
    $('#cwTurn').css ("background-color",  'white');
    rYaw = 0;
    turning = false;
    yawRef = getBodyYaw2(body);
}
if(nowHover == true && handUp != 4){
    $('#thrustUp').css ("background-color",  'white');
    $('#thrustDo').css ("background-color",  'white');
    yref = body.position.y;
    omegaGain = 1;
}
*/
    if(handUp == 1 && mousepick == false){
        $('#rollLeft').css ("background-color",  'white');
        $('#rollRight').css ("background-color",  'white');
        rollRef = 0;
        rolling = false;
        handUp = 0;
    }
    else if(handUp == 2 && mousepick ==false){
        $('#pitchAft').css ("background-color",  'white');
        $('#pitchFore').css ("background-color",  'white');
        pitchRef = 0;
        pitching = false;	
        handUp = 0;
    }
    else if(handUp == 3 && mousepick ==false){
        $('#ccwTurn').css ("background-color",  'white');
        $('#cwTurn').css ("background-color",  'white');
        $('#cwTurn').css ("background-color",  'white');
        rYaw = 0;
        turning = false;
        yawRef = getBodyYaw(body);
        if((yawRef / Math.PI*180).toFixed(2) == 360) yawRef=0;
        handUp = 0;
    }
    else if(handUp == 4 && mousepick ==false){
        $('#thrustUp').css ("background-color",  'white');
        $('#thrustDo').css ("background-color",  'white');
        yref = body.position.y;
        omegaGain = 1;
        handUp = 0;
    }

}



function hudButtonPick(event) {
    mousepick = true;
    let ndcX = (event.clientX / window.innerWidth) * 2 - 1;
    let ndcY = -(event.clientY / window.innerHeight) * 2 + 1;

    let halfW = cameraHUD.right;
    let halfH = cameraHUD.top;
    let xx = ndcX * halfW;
    let yy = ndcY * halfH;

    let buttonCenter = new THREE.Vector2 (HUD_object["controlRange"][0].children[0].position.x, HUD_object["controlRange"][0].children[0].position.y);
    let buttonCenter2 = new THREE.Vector2 (HUD_object["controlRange"][1].children[0].position.x, HUD_object["controlRange"][1].children[0].position.y);
    let mouse = new THREE.Vector2 (xx, yy);

    if (mouse.distanceTo (buttonCenter) < 2.9){
        ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        ControlPick.position.set(mouse.x,mouse.y,0);
        sceneHUD.add(ControlPick);
        controlOne = 1;
    }

    if(mouse.distanceTo (buttonCenter2) < 2.9){
        ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        ControlPick.position.set(mouse.x,mouse.y,0);
        sceneHUD.add(ControlPick);
        controlOne = 2;
    }

}


function hudButtonUp(event) {
    if(ControlPick !== undefined){
        sceneHUD.remove(ControlPick);
        ControlPick = undefined;
        mousepick = false;
    }
}


function hudButtonMove(event) {
    if(ControlPick !== undefined) {
        let ndcX = (event.clientX / window.innerWidth) * 2 - 1;
        let ndcY = -(event.clientY / window.innerHeight) * 2 + 1;

        let halfW = cameraHUD.right;
        let halfH = cameraHUD.top;
        let xx = ndcX * halfW;
        let yy = ndcY * halfH;

        let buttonCenter = new THREE.Vector2 (HUD_object["controlRange"][0].children[0].position.x, HUD_object["controlRange"][0].children[0].position.y);
        let buttonCenter2 = new THREE.Vector2 (HUD_object["controlRange"][1].children[0].position.x, HUD_object["controlRange"][1].children[0].position.y);
        let mouse = new THREE.Vector2 (xx, yy);

        if (mouse.distanceTo (buttonCenter) < 2.9){
            ControlPick.position.set(mouse.x,mouse.y,0);
            controlOne = 1
        }	
        else if(mouse.distanceTo (buttonCenter2) < 2.9){
            ControlPick.position.set(mouse.x,mouse.y,0);
            controlOne = 2
        }
        else {
            if(controlOne == 1){
                let fix = mouse.clone().sub(buttonCenter).setLength(2.9).add(buttonCenter);
                ControlPick.position.set(fix.x,fix.y,0);			
            }
            if(controlOne == 2){
                let fix = mouse.clone().sub(buttonCenter2).setLength(2.9).add(buttonCenter2);
                ControlPick.position.set(fix.x,fix.y,0);			
            }
        }
    }
}


function hudButtonPickMobile(event) {
    mousepick = true;
    let ndcX = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    let ndcY = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    let halfW = cameraHUD.right;
    let halfH = cameraHUD.top;
    let xx = ndcX * halfW;
    let yy = ndcY * halfH;

    let buttonCenter = new THREE.Vector2 (HUD_object["controlRange"][0].children[0].position.x, HUD_object["controlRange"][0].children[0].position.y);
    let buttonCenter2 = new THREE.Vector2 (HUD_object["controlRange"][1].children[0].position.x, HUD_object["controlRange"][1].children[0].position.y);
    let mouse = new THREE.Vector2 (xx, yy);

    if (mouse.distanceTo (buttonCenter) < 2.9){
        ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        ControlPick.position.set(mouse.x,mouse.y,0);
        sceneHUD.add(ControlPick);
        controlOne = 1;
    }
    if (mouse.distanceTo (buttonCenter2) < 2.9){
        ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        ControlPick.position.set(mouse.x,mouse.y,0);
        sceneHUD.add(ControlPick);
        controlOne = 2;
    }
    
}

function hudButtonUpMobile(event) {
    if(ControlPick !== undefined){
        sceneHUD.remove(ControlPick);
        ControlPick = undefined;
        mousepick = false;
    }
}


function hudButtonMoveMobile(event) {
    if(ControlPick !== undefined){
        let ndcX = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        let ndcY = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

        let halfW = cameraHUD.right;
        let halfH = cameraHUD.top;
        let xx = ndcX * halfW;
        let yy = ndcY * halfH;

        let buttonCenter = new THREE.Vector2 (HUD_object["controlRange"][0].children[0].position.x, HUD_object["controlRange"][0].children[0].position.y);
        let buttonCenter2 = new THREE.Vector2 (HUD_object["controlRange"][1].children[0].position.x, HUD_object["controlRange"][1].children[0].position.y);
        let mouse = new THREE.Vector2 (xx, yy);
        if (mouse.distanceTo (buttonCenter) < 2.9){
            ControlPick.position.set(mouse.x,mouse.y,0);
            controlOne = 1
        }	
        else if(mouse.distanceTo (buttonCenter2) < 2.9){
            ControlPick.position.set(mouse.x,mouse.y,0);
            controlOne = 2
        }
        else {
            if(controlOne == 1){
                let fix = mouse.clone().sub(buttonCenter).setLength(2.9).add(buttonCenter);
                ControlPick.position.set(fix.x,fix.y,0);			
            }
            if(controlOne == 2){
                let fix = mouse.clone().sub(buttonCenter2).setLength(2.9).add(buttonCenter2);
                ControlPick.position.set(fix.x,fix.y,0);			
            }
        }
    }
}