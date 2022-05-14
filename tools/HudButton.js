
function HUDControler() {
    const RATIO = 1.0003;
    // console.log(hud.mousepick)
    if(hud.ControlPick !== undefined && hud.controlOne == 2 && hud.mousepick == true){
        let p = hud.ControlPick.position.clone().sub(hud.controlRange[1].children[0].position)
        // for rolling
        if(Math.abs(p.x) > Math.abs(p.y)){
            if(p.x > 0){				
                $('#rollLeft').css ("background-color",  'yellow');
                quadcopter.rollRef = 0.1;
            }
            if(p.x < 0){
                $('#rollRight').css ("background-color",  'yellow');
                quadcopter.rollRef = -0.1;
            }
            hud.handUp = 1;
            nowRoll = true;
        }
        // for pitching
        else if(Math.abs(p.x) < Math.abs(p.y)){
            if(p.y > 0){				
                $('#pitchFore').css ("background-color",  'yellow');
                quadcopter.pitchRef = 0.1;
            }
            if(p.y < 0){
                $('#pitchAft').css ("background-color",  'yellow');
                quadcopter.pitchRef = -0.1;
            }
            nowPitch = true;
            hud.handUp = 2;
        }
    }

    else if (hud.ControlPick !== undefined && hud.controlOne == 1 && hud.mousepick == true){
        let p = hud.ControlPick.position.clone().sub(hud.controlRange[0].children[0].position)
        // for yawing
        if(Math.abs(p.x) > Math.abs(p.y)){
            if(p.x > 0){				
                $('#ccwTurn').css ("background-color",  'yellow');
                quadcopter.rYaw = -omegaHover*0.1;
            }
            if(p.x < 0){
                $('#cwTurn').css ("background-color",  'yellow');
                quadcopter.rYaw = omegaHover*0.1;
            }
            nowYaw = true;
            hud.handUp = 3;
            quadcopter.turning = true;
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
            hud.handUp = 4;
        }
    }
/*if(nowRoll == true && hud.handUp != 1){
    $('#rollLeft').css ("background-color",  'white');
    $('#rollRight').css ("background-color",  'white');
    quadcopter.rollRef = 0;
    quadcopter.rolling = false;	
}
if(nowPitch == true && hud.handUp != 2){
    $('#pitchAft').css ("background-color",  'white');
    $('#pitchFore').css ("background-color",  'white');
    quadcopter.pitchRef = 0;
    pitching = false;		
}
if(nowYaw == true && hud.handUp != 3){
    $('#ccwTurn').css ("background-color",  'white');
    $('#cwTurn').css ("background-color",  'white');
    quadcopter.rYaw = 0;
    quadcopter.turning = false;
    quadcopter.yawRef = getBodyYaw2(body);
}
if(nowHover == true && hud.handUp != 4){
    $('#thrustUp').css ("background-color",  'white');
    $('#thrustDo').css ("background-color",  'white');
    quadcopter.yref = body.position.y;
    omegaGain = 1;
}
*/
    if(hud.handUp == 1 && hud.mousepick == false){
        $('#rollLeft').css ("background-color",  'white');
        $('#rollRight').css ("background-color",  'white');
        quadcopter.rollRef = 0;
        quadcopter.rolling = false;
        hud.handUp = 0;
    }
    else if(hud.handUp == 2 && hud.mousepick ==false){
        $('#pitchAft').css ("background-color",  'white');
        $('#pitchFore').css ("background-color",  'white');
        quadcopter.pitchRef = 0;
        pitching = false;	
        hud.handUp = 0;
    }
    else if(hud.handUp == 3 && hud.mousepick ==false){
        $('#ccwTurn').css ("background-color",  'white');
        $('#cwTurn').css ("background-color",  'white');
        $('#cwTurn').css ("background-color",  'white');
        quadcopter.rYaw = 0;
        quadcopter.turning = false;
        quadcopter.yawRef = getBodyYaw(body);
        if((quadcopter.yawRef / Math.PI*180).toFixed(2) == 360) quadcopter.yawRef=0;
        hud.handUp = 0;
    }
    else if(hud.handUp == 4 && hud.mousepick ==false){
        $('#thrustUp').css ("background-color",  'white');
        $('#thrustDo').css ("background-color",  'white');
        quadcopter.yref = body.position.y;
        omegaGain = 1;
        hud.handUp = 0;
    }

}



function hudButtonPick(event) {
    hud.mousepick = true;
    let ndcX = (event.clientX / window.innerWidth) * 2 - 1;
    let ndcY = -(event.clientY / window.innerHeight) * 2 + 1;

    let halfW = hud.camera.right;
    let halfH = hud.camera.top;
    let xx = ndcX * halfW;
    let yy = ndcY * halfH;

    let buttonCenter = new THREE.Vector2 (hud.controlRange[0].children[0].position.x, hud.controlRange[0].children[0].position.y);
    let buttonCenter2 = new THREE.Vector2 (hud.controlRange[1].children[0].position.x, hud.controlRange[1].children[0].position.y);
    let mouse = new THREE.Vector2 (xx, yy);

    if (mouse.distanceTo (buttonCenter) < 2.9){
        hud.ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        hud.ControlPick.position.set(mouse.x,mouse.y,0);
        hud.scene.add(hud.ControlPick);
        hud.controlOne = 1;
    }

    if(mouse.distanceTo (buttonCenter2) < 2.9){
        hud.ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        hud.ControlPick.position.set(mouse.x,mouse.y,0);
        hud.scene.add(hud.ControlPick);
        hud.controlOne = 2;
    }

}


function hudButtonUp(event) {
    if(hud.ControlPick !== undefined){
        hud.scene.remove(hud.ControlPick);
        hud.ControlPick = undefined;
        hud.mousepick = false;
    }
}


function hudButtonMove(event) {
    if(hud.ControlPick !== undefined) {
        let ndcX = (event.clientX / window.innerWidth) * 2 - 1;
        let ndcY = -(event.clientY / window.innerHeight) * 2 + 1;

        let halfW = hud.camera.right;
        let halfH = hud.camera.top;
        let xx = ndcX * halfW;
        let yy = ndcY * halfH;

        let buttonCenter = new THREE.Vector2 (hud.controlRange[0].children[0].position.x, hud.controlRange[0].children[0].position.y);
        let buttonCenter2 = new THREE.Vector2 (hud.controlRange[1].children[0].position.x, hud.controlRange[1].children[0].position.y);
        let mouse = new THREE.Vector2 (xx, yy);

        if (mouse.distanceTo (buttonCenter) < 2.9){
            hud.ControlPick.position.set(mouse.x,mouse.y,0);
            hud.controlOne = 1
        }	
        else if(mouse.distanceTo (buttonCenter2) < 2.9){
            hud.ControlPick.position.set(mouse.x,mouse.y,0);
            hud.controlOne = 2
        }
        else {
            if(hud.controlOne == 1){
                let fix = mouse.clone().sub(buttonCenter).setLength(2.9).add(buttonCenter);
                hud.ControlPick.position.set(fix.x,fix.y,0);			
            }
            if(hud.controlOne == 2){
                let fix = mouse.clone().sub(buttonCenter2).setLength(2.9).add(buttonCenter2);
                hud.ControlPick.position.set(fix.x,fix.y,0);			
            }
        }
    }
}


function hudButtonPickMobile(event) {
    hud.mousepick = true;
    let ndcX = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    let ndcY = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    let halfW = hud.camera.right;
    let halfH = hud.camera.top;
    let xx = ndcX * halfW;
    let yy = ndcY * halfH;

    let buttonCenter = new THREE.Vector2 (hud.controlRange[0].children[0].position.x, hud.controlRange[0].children[0].position.y);
    let buttonCenter2 = new THREE.Vector2 (hud.controlRange[1].children[0].position.x, hud.controlRange[1].children[0].position.y);
    let mouse = new THREE.Vector2 (xx, yy);

    if (mouse.distanceTo (buttonCenter) < 2.9){
        hud.ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        hud.ControlPick.position.set(mouse.x,mouse.y,0);
        hud.scene.add(hud.ControlPick);
        hud.controlOne = 1;
    }
    if (mouse.distanceTo (buttonCenter2) < 2.9){
        hud.ControlPick = new THREE.Mesh(new THREE.RingGeometry(0.8,1,30),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        hud.ControlPick.position.set(mouse.x,mouse.y,0);
        hud.scene.add(hud.ControlPick);
        hud.controlOne = 2;
    }
    
}

function hudButtonUpMobile(event) {
    if(hud.ControlPick !== undefined){
        hud.scene.remove(hud.ControlPick);
        hud.ControlPick = undefined;
        hud.mousepick = false;
    }
}


function hudButtonMoveMobile(event) {
    if(hud.ControlPick !== undefined){
        let ndcX = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        let ndcY = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

        let halfW = hud.camera.right;
        let halfH = hud.camera.top;
        let xx = ndcX * halfW;
        let yy = ndcY * halfH;

        let buttonCenter = new THREE.Vector2 (hud.controlRange[0].children[0].position.x, hud.controlRange[0].children[0].position.y);
        let buttonCenter2 = new THREE.Vector2 (hud.controlRange[1].children[0].position.x, hud.controlRange[1].children[0].position.y);
        let mouse = new THREE.Vector2 (xx, yy);
        if (mouse.distanceTo (buttonCenter) < 2.9){
            hud.ControlPick.position.set(mouse.x,mouse.y,0);
            hud.controlOne = 1
        }	
        else if(mouse.distanceTo (buttonCenter2) < 2.9){
            hud.ControlPick.position.set(mouse.x,mouse.y,0);
            hud.controlOne = 2
        }
        else {
            if(hud.controlOne == 1){
                let fix = mouse.clone().sub(buttonCenter).setLength(2.9).add(buttonCenter);
                hud.ControlPick.position.set(fix.x,fix.y,0);			
            }
            if(hud.controlOne == 2){
                let fix = mouse.clone().sub(buttonCenter2).setLength(2.9).add(buttonCenter2);
                hud.ControlPick.position.set(fix.x,fix.y,0);			
            }
        }
    }
}