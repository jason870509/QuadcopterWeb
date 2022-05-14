var circles = [];
const RADIUS = 2, PI = 2.5;

var params1 = { // Circle
    P0x: 0-RADIUS, P0y: 0 , P0z:0,
    P1x: -0.5*RADIUS*Math.sqrt(2), P1y: 0 , P1z:RADIUS*0.5*Math.sqrt(2),
    P2x: 0, P2y: 0, P2z:RADIUS,
    P3x: 0.5*RADIUS*Math.sqrt(2), P3y: 0, P3z:RADIUS*0.5*Math.sqrt(2),
    P4x: 2*RADIUS-RADIUS, P4y: 0, P4z:0,
    P5x: 0.5*RADIUS*Math.sqrt(2), P5y: 0 ,P5z:-RADIUS*0.5*Math.sqrt(2),
    P6x: 0, P6y: 0,P6z:-RADIUS,
    P7x: -0.5*RADIUS*Math.sqrt(2), P7y: 0,P7z:-RADIUS*0.5*Math.sqrt(2),      
    steps: 50,
    close: true
};

var params2 = { // S Curve
  P0x: -2*PI, P0y:0 ,P0z:0,
  P1x: -1.5*PI, P1y: 0,P1z: -2.5*Math.sin((-1.5*PI)*Math.PI/5),
  P2x: -PI, P2y: 0,P2z: PI,
  P3x: -0.5*PI, P3y: 0,P3z:-2.5*Math.sin(0.2*Math.PI*(-0.5*PI)),
  P4x: 0, P4y: 0,P4z:0,
  P5x: .5*PI, P5y: 0,P5z: -2.5*Math.sin((.5*PI)*Math.PI/5),
  P6x: PI, P6y: 0,P6z: -PI,
  P7x: 1.5*PI, P7y: 0,P7z:-2.5*Math.sin(0.2*Math.PI*(1.5*PI)),
  P8x: 2*PI, P8y: 0,P8z:0, 
  steps: 50, 
  close: false
};

var params3 = {
  P0x: -2*RADIUS, P0y:0 ,P0z:0,
  P1x:-0.5*RADIUS*Math.sqrt(2)-RADIUS, P1y: 0,P1z: 0.5*RADIUS*Math.sqrt(2),
  P2x:  -RADIUS, P2y: 0,P2z: RADIUS,
  P3x:  0.5*RADIUS*Math.sqrt(2)-RADIUS, P3y: 0,P3z:0.5*RADIUS*Math.sqrt(2),
  P4x: 0, P4y: 0 ,P4z:0,
  P5x: -0.5*RADIUS*Math.sqrt(2)+RADIUS, P5y: 0,P5z:-0.5*RADIUS*Math.sqrt(2),
  P6x: RADIUS, P6y: 0,P6z: -RADIUS,   
  P7x: 0.5*RADIUS*Math.sqrt(2)+RADIUS, P7y: 0,P7z: -0.5*RADIUS*Math.sqrt(2),      
  P8x: 2*RADIUS , P8y:0 ,P8z:0,
  P9x: 0.5*RADIUS*Math.sqrt(2)+RADIUS, P9y: 0,P9z: 0.5*RADIUS*Math.sqrt(2),
  P10x: RADIUS, P10y: 0,P10z:RADIUS,
  P11x: -0.5*RADIUS*Math.sqrt(2)+RADIUS, P11y: 0,P11z:0.5*RADIUS*Math.sqrt(2),
  P12x: 0, P12y: 0 ,P12z:0,
  P13x: 0.5*RADIUS*Math.sqrt(2)-RADIUS, P13y: 0,P13z:-0.5*RADIUS*Math.sqrt(2),
  P14x: -RADIUS, P14y: 0,P14z:-RADIUS,  
  P15x: -0.5*RADIUS*Math.sqrt(2)-RADIUS, P15y: 0,P15z:-0.5*RADIUS*Math.sqrt(2),   
  steps: 50,
  close:true
};  


( function( ) {
      Math.clamp = function(val, min, max) {
          return Math.min(Math.max(val, min), max);
      } 
} )();


class HUD {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-20, 20, 10, -10, -10, 1000);
        this.light = new THREE.DirectionalLight( 0xffffff, 1 );

        this.whRatio = window.innerWidth / window.innerHeight;
        this.halfH = 10;
        this.halfW = this.whRatio * this.halfH;  

        // DashBoard
        this.pointer = [];
        this.sprite = [];

        // ControlButton
        this.controlRange = [];
        this.handUp = 0;
        this.controlOne = 0;
        this.mousepick = false;
        this.ControlPick;
    }

    buildScene() {
        this.light.position.set(10,10,50);
    }

    buildDashboard(sprite, pointer) {
        // =================================== 儀表盤設計 ===================================
        let loader = new THREE.TextureLoader();
        loader.crossOrigin = '';
        let omegaTurn = loader.load('https://i.imgur.com/TNNXgJr.png');  
        omegaTurn.wrapS = THREE.RepeatWrapping

        var circle = [], circle2 = [], circle3 = [];
        for (var i = 0; i < 4; i++) {
            // 儀表盤 
            circle[i] = new THREE.Mesh( new THREE.CircleGeometry(2, 80, -0.9, 4.9), 
                                        new THREE.MeshPhongMaterial({ color:0xD0e9ff,
                                                                      side: THREE.DoubleSide } ));
            // 儀表外圈
            circle2[i] = new THREE.Mesh( new THREE.RingGeometry( 1.5, 2, 32, 8, -0.9, 4.9), 
                                        new THREE.MeshPhongMaterial( { color: 0x1742ab, 
                                                                        side: THREE.DoubleSide,
                                                                        map:omegaTurn } ));
            // 外圈红色末標
            circle3[i] = new THREE.Mesh( new THREE.RingGeometry( 1.5, 2, 32, 8, -0.9, 0.7), 
                                        new THREE.MeshPhongMaterial( { color: 0xab1d17, 
                                                                        side: THREE.DoubleSide } )); 
            if(i == 0 || i == 2) circle2[i].material.color.setHex( 0xcfc754 );
        }

        var pointerer = [], dashBoard = [], center = [];
        for (var i = 0; i < 4; i++) {
            this.pointer[i] = new THREE.Group();
            dashBoard[i] = new THREE.Group();
            pointerer[i] = new THREE.Mesh( new THREE.PlaneGeometry(1.8, 0.1), 
                                          new THREE.MeshPhongMaterial({ color: 0xff0000 }));
                                          
            center[i] = new THREE.Mesh( new THREE.CircleGeometry( 0.2, 32 ), 
                                        new THREE.MeshPhongMaterial({ color: 0x000000 }));
            pointerer[i].add(center[i]);
            center[i].position.set(1,0,0);
            this.pointer[i].add(pointerer[i]);
            dashBoard[i].add(circle[i], circle2[i], circle3[i], this.pointer[i]);
        }

        this.scene.add(dashBoard[0], dashBoard[1], dashBoard[2], dashBoard[3], this.light)

        dashBoard[0].position.set(-this.halfW / 2.5, -(this.halfH - this.halfW / 10), 0)
        dashBoard[1].position.set(-this.halfW / 8, -(this.halfH - this.halfW / 10), 0)
        dashBoard[2].position.set(this.halfW / 8, -(this.halfH - this.halfW / 10), 0)
        dashBoard[3].position.set(this.halfW / 2.5, -(this.halfH - this.halfW / 10), 0)
      
        for (i = 0; i < 4; i++) {
            this.pointer[i].position.z = 0.3
            circle2[i].position.z = 0.1
            circle3[i].position.z = 0.2
            pointerer[i].position.x = -1
        }
        // =================================== 儀表盤文字 ===================================
        var SpriteText2D = THREE_Text.SpriteText2D;
        var textAlign = THREE_Text.textAlign;
        var rpm = [], motorNumber = [];
  
        for (i = 0; i < 4; i++) {
            motorNumber[i] = new SpriteText2D("Motor"+(i+1), {
              align: textAlign.center,
              font: '60px Monospace',
              fillStyle: '0x3d59ab',
              antialias: true
            });
            motorNumber[i].position.set(0, -0.8, 0);
            motorNumber[i].scale.set(0.005, 0.005, 0.005);

            this.sprite[i] = new SpriteText2D("0", {
              align: textAlign.center,
              font: '100px Monospace',
              fillStyle: '0x3d59ab',
              antialias: true
            });
            this.sprite[i].position.y = 1.2;
            this.sprite[i].scale.set(0.005, 0.005, 0.005);

            rpm[i] = new SpriteText2D("RPM", {
              align: textAlign.center,
              font: '80px Monospace',
              fillStyle: '0x3d59ab',
              antialias: true
            });
            rpm[i].position.y = 0.55;
            rpm[i].scale.set(0.005, 0.005, 0.005);

            dashBoard[i].add(this.sprite[i], rpm[i], motorNumber[i])
        }
    }

    buildControlButton() {
      // =================================== 控制器設計 ===================================
      let loader = new THREE.TextureLoader();
      loader.crossOrigin = '';
      let ControlTex = loader.load('https://i.imgur.com/QnO94NW.png');

      for (var i = 0; i < 2; i++) {
          this.controlRange[i] = new THREE.Group();
      }
      // 左側控制器
      var color = [0xe428fc, 0x0000ff, 0x0000ff];
      var position = [this.whRatio * 10 * -3 / 4, 8 * -50 / 100, 0];
      this.createControlRange(0, color, position, ControlTex);

      // 右側控制器
      color = [0x40ebf7, 0x28f4f7, 0x28f4f7];
      position[0] = -position[0];
      this.createControlRange(1, color, position, ControlTex);

      // =================================== 左陀螺儀圖示 (上升下降、旋轉) ===================================
      let arrowTex_UP  = loader.load('https://i.imgur.com/RvBtr5N.png');
      let arrowTex_RIGHT = loader.load('https://i.imgur.com/MwcQCwh.png');
      let arrowTex_LEFT = loader.load('https://i.imgur.com/a4dqORu.png');
      var upArrow, downArrow, turnRightArrow, turnLeftArrow;

      var shape = [2, 2];
      position = [this.whRatio * 10 * -3 / 4 , 8 * -50 / 100 + 2,0];
      upArrow = this.createControlButtonImage(shape, position, arrowTex_UP);
      upArrow.rotation.z = Math.PI / 2

      downArrow = upArrow.clone();	
      downArrow.position.set(this.whRatio * 10 * -3 / 4 , 8 * -50 / 100 - 2,0);
      downArrow.rotation.z = -Math.PI / 2
      
      shape = [1, 1];
      position = [this.whRatio * 10 * -3 / 4 + 2, 8 * -50 / 100, 0];
      turnRightArrow = this.createControlButtonImage(shape, position, arrowTex_RIGHT);

      position = [this.whRatio * 10 * -3 / 4 - 2, 8 * -50 / 100, 0];
      turnLeftArrow = this.createControlButtonImage(shape, position, arrowTex_LEFT);
      turnLeftArrow.rotation.z = Math.PI;

      this.controlRange[0].add(upArrow, downArrow, turnRightArrow, turnLeftArrow);

      // =================================== 右陀螺儀圖示 (前後左右移動) ===================================
      var arrowTex_MOVE = loader.load('https://i.imgur.com/gVXZl0q.png');
      var goLeft, goRight, goForward, goBack;

      goLeft = this.createControlButtonImage(shape, position, arrowTex_MOVE);
      goLeft.position.set(this.whRatio * 10 * 3 / 4 - 2, 8 * -50 / 100,0);
      goRight = goLeft.clone();

      goRight.position.set(this.whRatio * 10 * 3 / 4 + 2, 8 * -50 / 100,0);
      goRight.rotation.z = Math.PI;

      goForward = goLeft.clone();
      goForward.position.set(this.whRatio * 10 * 3 / 4, 8 * -50 / 100 + 2,0);
      goForward.rotation.z = -Math.PI / 2;

      goBack = goLeft.clone();
      goBack.position.set(this.whRatio * 10 * 3 / 4, 8 * -50 / 100 - 2,0);
      goBack.rotation.z = Math.PI / 2;
      this.controlRange[1].add(goLeft, goRight, goBack, goForward);

      this.scene.add(this.controlRange[0], this.controlRange[1]);
    }

    createControlRange(index, color, position, texture) {
        var outside = new THREE.Mesh( new THREE.CircleGeometry(4,30),
                                      new THREE.MeshBasicMaterial({ color: color[0], 
                                                                    map: texture, 
                                                                    transparent: true,}));
        outside.position.set(position[0], position[1], position[2]);
      
        var inside = new THREE.Mesh( new THREE.RingGeometry(3, 3.3,30),
                                     new THREE.MeshBasicMaterial({ color: color[1], 
                                                                   transparent: true,
                                                                   opacity :0.4 }));	
        inside.position.set(position[0], position[1], position[2]);
      
        var inside2 = new THREE.Mesh( new THREE.RingGeometry(2.7, 3.1,30),
                                      new THREE.MeshBasicMaterial({ color: color[2], 
                                                                    transparent: true,
                                                                    opacity :0.18 }));	
        inside2.position.set(position[0], position[1], position[2]);
        this.controlRange[index].add(outside, inside, inside2);
        
    }

    createControlButtonImage(shape, position, texture) {
        var image = new THREE.Mesh( new THREE.PlaneGeometry(shape[0], shape[1]),
                                    new THREE.MeshBasicMaterial({ color: 0x28f477, 
                                                                  map : texture,
                                                                  opacity : 0.8,
                                                                  transparent: true }));
        image.position.set(position[0], position[1], position[2]);
        return image
    }
}


class Quadcopter {
    constructor() {
        this.body = this.buildDrone();
        // Follow Line 參數
        this.dt = 0;
        this.curve_type = -1;
        this.target_position = new THREE.Vector3(5, 5,-5);
        this.current_curve;
        this.curveObject;
        this.target_point;

        this.fatline = [];
        this.show_plane = [];

        this.showTargetPoint = false;
        this.showPlane = false;
        this.curve_first = true;

        this.angleRef = 0;
        this.angle_V = 0;
        this.curve_angle = 0;

        // flight maneuver
        // hovering
        this.yref = 0; 
        this.fly_toggle = false;
        this.takeoff = false
        this.land = false;

        // Roll, Yaw, Pitch
        this.turning = true, this.rolling = true, this.pitching = true;
        this.rYaw = 0, this.rRoll = 0, this.rPitch = 0;
        this.yawAngle = 0, this.yawRef = 0;
        this.rollAngle = 0, this.rollRef = 0;
        this.pitchAngle = 0, this.pitchRef = 0;
    }

    buildDrone() {
        // =================================== 無人機本體設計 ===================================
        var quadcopter = new THREE.Object3D();
          
        let loader = new THREE.TextureLoader();
        loader.crossOrigin = '';
        let texture = loader.load('https://i.imgur.com/qr8kAad.png');
        let ttuTexture = loader.load('https://i.imgur.com/gHlWEnT.png');
        let cameraTexture = loader.load('https://i.imgur.com/opw7n3t.png');

        var centerBox = new THREE.Mesh( new THREE.BoxGeometry(0.3, 0.2, 0.6), 
                                        new THREE.MeshPhongMaterial({ color: 0x262b28, 
                                                                      map: texture }));
        centerBox.castShadow = true;
        centerBox.receiveShadow = true;
        centerBox.name = "centerBox";

        var logo = new THREE.Mesh( new THREE.CircleGeometry( 0.1, 32 ), 
                                  new THREE.MeshBasicMaterial({ color:0xffffff,
                                                                map: ttuTexture,
                                                                side: THREE.DoubleSide }));
        logo.position.y=.152;
        logo.position.z=0.1;
        logo.rotation.x=-Math.PI/2;

        var droneCamera= new THREE.Mesh( new THREE.PlaneGeometry(0.1, 0.1), 
                                        new THREE.MeshBasicMaterial({ color:0xffffff,
                                                                      map: cameraTexture,
                                                                      side: THREE.DoubleSide }));
        droneCamera.position.z = 0.405;

        var sphere = new THREE.Mesh( new THREE.SphereGeometry(0.05, 32, 32 ), 
                                new THREE.MeshPhongMaterial({ color: 0xFF3030 }));
        sphere.position.set(0,-0.1,0);

        centerBox.add(logo, droneCamera, sphere);
        quadcopter.add(centerBox);
        // =================================== 無人機螺旋槳設計 ===================================
        // 連接 centerBody 的軸
        let boxLinks = []
        for (var i = 0; i < 4; i++) {
          boxLinks[i] = new THREE.Mesh( new THREE.BoxGeometry(0.3, 0.1, 0.02), 
                                        new THREE.MeshPhongMaterial({ color: 0x333333,
                                                                      map: texture }));
          boxLinks[i].name = "boxLink_" + i;
          quadcopter.add(boxLinks[i]);
        }
        boxLinks[0].position.set(-.25, 0, .3);
        boxLinks[0].rotation.y = Math.PI / 4;
        boxLinks[1].position.set(-.25, 0, -.3);
        boxLinks[1].rotation.y = -Math.PI / 4;
        boxLinks[2].position.set(.25, 0, -.30);
        boxLinks[2].rotation.y = Math.PI / 4;
        boxLinks[3].position.set(.25, 0, .30);
        boxLinks[3].rotation.y = -Math.PI / 4;
        for (i=0;i<4;i++){
          boxLinks[i].castShadow = true;
          boxLinks[i].receiveShadow = true; 
        }

        // 螺旋槳外圈
        let motorSides = []
        var material = new THREE.MeshPhongMaterial({ color: 0x333333,
                                                    side: THREE.DoubleSide,
                                                    map: texture })
        motorSides[0] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50, 2, true, 4, 2.5), material)
        motorSides[0].name = "motorSides_0"
        motorSides[0].position.set(-.40, .10, .40)
        motorSides[1] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50, 2, true, 2.8, 2.5), material)
        motorSides[1].position.set(-.40, .10, -.40)
        motorSides[1].name = "motorSides_1"
        motorSides[2] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50,2, true, 1, 2.5), material)
        motorSides[2].position.set(.40, .10, -.40)
        motorSides[2].name = "motorSides_2"
        motorSides[3] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50,2, true, -0.5, 2.5), material)
        motorSides[3].position.set(.40, .10, .40)
        motorSides[3].name = "motorSides_3"

        for (i=0;i<4;i++){
            quadcopter.add(motorSides[i])
            motorSides[i].castShadow = true;
            motorSides[i].receiveShadow = true; 
        }

        // 螺旋槳中心
        let motorCenters = [], motorCenters2 = [];
        for (i = 0; i < 4; i++) {
          motorCenters[i] = new THREE.Mesh( new THREE.CylinderGeometry(.04, .04, .35, .50), 
                                            new THREE.MeshPhongMaterial({ color: 0xCCCCCC, 
                                                                          map: texture }));
          motorCenters[i].castShadow = true;
          motorCenters[i].receiveShadow = true;

          motorCenters2[i] = new THREE.Mesh( new THREE.CylinderGeometry(.05, .05, .30, 50, 2, true), 
                                            new THREE.MeshPhongMaterial({ color: 0x333333, 
                                                                          map: texture }));
          motorCenters2[i].castShadow = true;
          motorCenters2[i].receiveShadow = true;
          motorCenters[i].name = "motorCenters_" + i
          motorCenters2[i].name = "motorCenters2_" + i
          quadcopter.add(motorCenters[i], motorCenters2[i]);
        }
        motorCenters[0].position.set(-.40, 0, .40);
        motorCenters[1].position.set(-.40, 0, -.40);
        motorCenters[2].position.set(.40, 0, -.40);
        motorCenters[3].position.set(.40, 0, .40);
        motorCenters2[0].position.set(-.40, -.05, .40);
        motorCenters2[1].position.set(-.40, -.05, -.40);
        motorCenters2[2].position.set(.40, -.05, -.40);
        motorCenters2[3].position.set(.40, -.05, .40);

        // 螺旋槳名稱
        let  motorName = [];
        var SpriteText2D = THREE_Text.SpriteText2D;
        var textAlign = THREE_Text.textAlign;
        for (i=0;i<4;i++){
            motorName[i] = new SpriteText2D("Motor"+(i+1), {
                                            align: textAlign.center,
                                            font: '40px Monospace',
                                            fillStyle: '0x3d59ab',
                                            antialias: true });
            motorName[i].scale.set(0.005, 0.005, 0.005);
            motorName[i].position.y += 0.5;
            motorName[i].visible = isVisible;
            motorCenters2[i].add(motorName[i]);
        }
        motorName[0].position.z+=0.3;
        motorName[1].position.z-=0.3;
        motorName[2].position.z-=0.3;
        motorName[3].position.z+=0.3;
        motorName[0].position.x-=0.3;
        motorName[1].position.x-=0.3;
        motorName[2].position.x+=0.3;
        motorName[3].position.x+=0.3;

        // 螺旋槳中心連結外圈的兩條軸
        let motorLinks = [], point = [];
        for (i = 0; i < 8; i++) {
          motorLinks[i] = new THREE.Mesh( new THREE.BoxGeometry(.45, .04, .02), 
                                          new THREE.MeshPhongMaterial({ color: 0x333333,
                                                                        map: texture }));
          motorLinks[i].castShadow = true;
          motorLinks[i].receiveShadow = true;
          motorLinks[i].name = "motorLinks_" + i 
          quadcopter.add(motorLinks[i]);
        }
        motorLinks[0].position.set(-.60, 0, .40);
        motorLinks[1].position.set(-.60, 0, -.40);
        motorLinks[2].position.set(.60, 0, -.40);
        motorLinks[3].position.set(.60, 0, .40);
        motorLinks[0].rotation.z = -Math.PI / 6;
        motorLinks[1].rotation.z = -Math.PI / 6;
        motorLinks[2].rotation.z = Math.PI / 6;
        motorLinks[3].rotation.z = Math.PI / 6;
        motorLinks[4].position.set(-.40, 0, .60);
        motorLinks[4].rotation.y = -Math.PI / 2;
        motorLinks[4].rotation.x = -Math.PI / 6;
        motorLinks[5].position.set(-.40, 0, -.60);
        motorLinks[5].rotation.y = -Math.PI / 2;
        motorLinks[5].rotation.x = Math.PI / 6;
        motorLinks[6].position.set(.40, 0, -.60);
        motorLinks[6].rotation.y = -Math.PI / 2;
        motorLinks[6].rotation.x = Math.PI / 6;
        motorLinks[7].position.set(.40, 0, .60);
        motorLinks[7].rotation.y = -Math.PI / 2;
        motorLinks[7].rotation.x = -Math.PI / 6;

        // 螺旋槳
        let motorTexture = loader.load('https://i.imgur.com/yCho2gY.png');
        let motors=[];
        for(i = 0; i < 4; i ++){
            motors[i] = new THREE.Mesh( new THREE.PlaneGeometry(.75, .10), 
                                        new THREE.MeshPhongMaterial({ map:motorTexture,
                                                                      transparent: true, 
                                                                      side:THREE.DoubleSide }));
            motors[i].rotation.x = -Math.PI / 2;
            motors[i].castShadow = true;
            motors[i].receiveShadow = true;
            motors[i].name = "motors_" + i  
            quadcopter.add(motors[i]);
        }
        motors[0].position.set(-.40, .10, .40)
        motors[1].position.set(-.40, .10, -.40)
        motors[2].position.set(.40, .10, -.40)
        motors[3].position.set(.40, .10, .40)
        motors[1].rotation.y = Math.PI
        motors[3].rotation.y = Math.PI
        
        var SpeedCylinder = [];
        for(i=0;i<4;i++){
            point[i] =new THREE.Mesh( new THREE.CylinderGeometry(0, 0.04, 0.05, 30), 
                                      new THREE.MeshPhongMaterial({ color:0xff0000 }));
            SpeedCylinder[i] = new THREE.Mesh( new THREE.CylinderGeometry(0.02, 0.02, 0.5, 30), 
                                              new THREE.MeshPhongMaterial({ color:0xff0000 }));
            SpeedCylinder[i].add(point[i]);
            SpeedCylinder[i].rotation.x = Math.PI/2;
            point[i].position.y = 0.025 + 0.5/2;
            motors[i].add(SpeedCylinder[i]);
            
        }

        // =================================== 中心機體設計 ===================================
        var bodyBox = new THREE.Object3D();
        var head =  new THREE.Geometry();

        head.vertices.push(new THREE.Vector3(30, 0, 0));
        head.vertices.push(new THREE.Vector3(30, -20, 0));
        head.vertices.push(new THREE.Vector3(0, -20, 0));
        head.vertices.push(new THREE.Vector3(0, 0, 0));
        head.vertices.push(new THREE.Vector3(25, -5, 10));
        head.vertices.push(new THREE.Vector3(25, -15, 10));
        head.vertices.push(new THREE.Vector3(5, -5, 10));
        head.vertices.push(new THREE.Vector3(5, -15, 10));

        var face;
        face = new THREE.Face3(0, 3, 1);
        head.faces.push(face);
        face = new THREE.Face3(2, 1, 3);
        head.faces.push(face);
        face = new THREE.Face3(1,0,4);
        head.faces.push(face);
        face = new THREE.Face3(1, 4, 5);
        head.faces.push(face);
        
        face = new THREE.Face3(6,5,4);
        head.faces.push(face);
        face = new THREE.Face3(7, 5, 6);
        head.faces.push(face);

        face = new THREE.Face3(6, 3, 2);
        head.faces.push(face);
        face = new THREE.Face3(7, 6, 2);
        head.faces.push(face);
        face = new THREE.Face3(0, 3, 6);
        head.faces.push(face);
        face = new THREE.Face3(4, 0, 6);
        head.faces.push(face);
        face = new THREE.Face3(1, 5, 7);
        head.faces.push(face);
        face = new THREE.Face3(2, 1, 7);
        head.faces.push(face);
        head.computeBoundingSphere();
        head.computeFaceNormals();
        head.computeVertexNormals();

        var Head = new THREE.Mesh(head, new THREE.MeshPhongMaterial({ color: 0x262b28, 
                                                                      map : texture }));
        var Head2 = Head.clone()
        bodyBox.add(Head, Head2)
        bodyBox.name = "bodyBox_" + i  
        quadcopter.add(bodyBox)
        
        Head.position.set(-15, 10, 30)
        Head2.position.set(15, 10, -30)
        Head2.rotation.y = Math.PI 

        var top =  new THREE.Geometry();
        top.vertices.push(new THREE.Vector3(15, 10, -30));
        top.vertices.push(new THREE.Vector3(15, 10, 30));
        top.vertices.push(new THREE.Vector3(-15, 10, 30));
        top.vertices.push(new THREE.Vector3(-16, 10, -30));
        top.vertices.push(new THREE.Vector3(10, 15, 25));
        top.vertices.push(new THREE.Vector3(10, 15, -25));
        top.vertices.push(new THREE.Vector3(-10, 15, 25));
        top.vertices.push(new THREE.Vector3(-10, 15, -25));

        var face2;
        face2 = new THREE.Face3(0, 3, 1);
        top.faces.push(face2);
        face2 = new THREE.Face3(2, 1, 3);
        top.faces.push(face2);
        face2 = new THREE.Face3(1,0,4);
        top.faces.push(face2);
        face2 = new THREE.Face3(5, 4, 0);
        top.faces.push(face2);
        face2 = new THREE.Face3(4,5,6);
        top.faces.push(face2);
        face2 = new THREE.Face3(5, 7, 6);
        top.faces.push(face2);
        face2 = new THREE.Face3(6,7,3);
        top.faces.push(face2);
        face2 = new THREE.Face3(6, 3, 2);
        top.faces.push(face2);
        face2 = new THREE.Face3(1,4,6);
        top.faces.push(face2);
        face2 = new THREE.Face3(6, 2, 1);
        top.faces.push(face2);
        face2 = new THREE.Face3(3,7,0);
        top.faces.push(face2);
        face2 = new THREE.Face3(0, 7, 5);
        top.faces.push(face2);

        var Top = new THREE.Mesh(top, new THREE.MeshPhongMaterial({ color: 0xffffff }));
        bodyBox.add(Top)
        bodyBox.scale.set(0.01,0.01,0.01);

        quadcopter.add(new THREE.AxesHelper (2));
        scene.add(quadcopter);

        return quadcopter;
    }

    flyWithYaw() { // Yaw: Y 軸旋轉( 左右轉 )
        // 方向向量
        var curve_orientation = this.target_position.clone().sub(body.position).normalize();
        
        // CANNON.JS
        var localY , localZ;
        localY= body.vectorToWorldFrame ( new CANNON.Vec3(0, 1, 0) );
        localZ = body.vectorToWorldFrame ( new CANNON.Vec3(0, 0, 1) );

        // THREE.JS
        var yL = new THREE.Vector3 (localY.x, localY.y, localY.z);
        var zL = new THREE.Vector3 (localZ.x, localZ.y, localZ.z);
        this.yawAngle = rotateAlongAxisTo (curve_orientation, yL, zL);

        if (this.yawAngle > Math.PI*2)
            this.yawAngle %= Math.PI*2;
        if(this.yawAngle == Math.PI*2) 
            this.yawAngle = 0;

        if(this.yawAngle > 0) {
          this.rYaw = -omegaHover*0.1;
          this.turning = true;
        }
        if(this.yawAngle < 0){
          this.rYaw = omegaHover*0.1;
          this.turning = true;
        }

    }

  flyWithPitch() { // Pitch: X 軸旋轉( 前後 )
      var z_world = new THREE.Vector3 (0,0,1);
      var target_position_x = new THREE.Vector3(0, this.target_position.y, this.target_position.z);

      var orientation_x = target_position_x.clone().sub(body.position).normalize();
      var z = z_world.projectOnPlane(orientation_x);

      if(z.z > 0){
        this.pitchRef = 0.03;
        this.pitching = true;
      }
      if(z.z < 0){
        this.pitchRef = -0.03;
        this.pitching = true;
      }

  }

  follow_line() {
      
      if(body.position.y != 0 && this.curve_type != -1) {
          this.target_point.visible = this.showTargetPoint;

          if (this.curve_first) {
              // clear scene
              this.showPlane = false;
              scene.remove(this.fatline[0].line);
              scene.remove(this.fatline[1].line);
              scene.remove(quadcopter.curveObject);
              
              // init quadcopter
              quadcopter.dt = 0
              this.turning=false;
              this.pitchRef = 0;
              this.pitching = false; 
              this.rollRef = 0;
              this.rolling = false;
              
              if (this.curve_type != 2){
                  this.fatline[this.curve_type].line.visible = true;
                  scene.add(this.fatline[this.curve_type].line);
              }
              
              if (this.curve_type == 0) body.position.set(-RADIUS, 5, 0);
              if (this.curve_type == 1) body.position.set(-2*PI, 5, 0);
              if (this.curve_type == 2) body.position.set(-2*RADIUS, 5, 0);
              this.curve_first = false;
          }
          
          var angle = this.computeCurveAngle(this.curve_type);
          switch(this.curve_type){
              case 0:         
                  this.current_curve = CreateCurve(angle, this.curve_type, false);
                  this.fatline[this.curve_type].line.rotation.z = angle;
                  break;
              case 1:
                  this.current_curve = CreateCurve(angle, this.curve_type, false);
                  this.fatline[this.curve_type].line.rotation.z = angle;
                  break;
              case 2: 
                  this.current_curve = CreateCurve(angle, this.curve_type, true);
                  break;
              default:
                  break;
          }
          
          if (this.showPlane) {
              this.show_plane[this.curve_type].visible = true;
              if (this.curve_type == 1)
                this.show_plane[this.curve_type].rotation.z = angle;
              else if (this.curve_type == 2)
                this.show_plane[this.curve_type].rotation.z = angle;
              else
                this.show_plane[this.curve_type].rotation.z = angle;
          }
          else {
              for(let i in this.show_plane){
                  this.show_plane[i].visible = false;
              }
          }

          this.target_point.position.copy(this.current_curve.getPointAt(quadcopter.dt % 1));   
          quadcopter.target_position = this.current_curve.getPointAt(quadcopter.dt % 1);
          this.yref = quadcopter.target_position.y;

          quadcopter.flyWithYaw();
          quadcopter.flyWithPitch();

          var distance = Math.sqrt( Math.pow( quadcopter.target_position.x - body.position.x, 2) + 
                                    Math.pow(quadcopter.target_position.z - body.position.z, 2 ))

          if (distance <= 0.5) {
              quadcopter.dt += 0.003;
          } 
      }
  }   

  computeCurveAngle(){
      var dtt = 0.005;
      var f = speedServo(this.curve_angle, this.angle_V, this.angleRef); 

      this.angle_V += f * dtt;
      this.curve_angle += this.angle_V * dtt;
      
      return this.curve_angle
  }
}


function buildScene() {
  // =================================== 場景設計 ===================================
  //scene.add (new THREE.GridHelper (100,100, 'white', 'white'));
  //scene.add (new THREE.AxesHelper (5));  
  // let loader = new THREE.TextureLoader();
  // loader.crossOrigin = '';
  // var  texture = loader.load('https://img.freepik.com/free-vector/wood-planks-texture-background-parquet-flooring_1048-2145.jpg?size=338&ext=jpg');
  // texture.repeat.set(20, 20);
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;

  let plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshPhongMaterial({}));
  scene.add (plane);
  plane.receiveShadow = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  plane.rotation.x=-Math.PI/2;
  plane.position.y=-0.1

  let loader = new THREE.TextureLoader();
	loader.crossOrigin = '';
	texture = loader.load('https://i.imgur.com/81lKBzW.png');
	var parking= new THREE.Mesh( new THREE.CircleGeometry( 1, 32 ), new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide
	}));
	scene.add(parking);
	parking.rotation.x=-Math.PI/2;

  // =================================== 循線時的輔助面 ===================================
  let width = [8, 10, 12];
  let height = [8, 6, 6];
  for(var i = 0; i < 3; i ++) {
      buildShowPlane(i, width[i], height[i]);
      scene.add(quadcopter.show_plane[i]);
  }
  
  function buildShowPlane(index, width, height) {
      quadcopter.show_plane[index] = new THREE.Object3D();
      var plane = new THREE.Mesh( new THREE.PlaneGeometry(width, height), 
                                  new THREE.MeshBasicMaterial({ color:0xff0000,
                                                                side:THREE.DoubleSide,  
                                                                transparent: true,
                                                                opacity: 0.2,
                                                                visible: true }));
      plane.rotation.x = Math.PI/2;
      quadcopter.show_plane[index].position.y = 5;
      quadcopter.show_plane[index].add (plane);
      quadcopter.show_plane[index].visible = false
  }  

}


function buildObstacle(){
   var geometry = new THREE.TorusGeometry( 1.5, 0.04, 16, 100 );
   var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
   var circle = new THREE.Mesh( geometry, material );
   circles[0]=circle.clone();
   circles[1]=circle.clone();
   circles[2]=circle.clone();
  //  scene.add( circles[0],circles[1],circles[2]);
   circles[0].position.set(5,5,-5);
   circles[1].position.set(8,5,-10);
   circles[2].position.set(-10,5,5);
   //circles[2].rotation.y=Math.PI/2;

}


function CreateCurve(angle, curve_type, draw_curve) {
  var params;
  var curve_points;

  if (curve_type == 0){
      params = params1;
      curve_points = [[params1.P0x, params1.P0y, params1.P0z],
                      [params1.P1x, params1.P1y, params1.P1z],
                      [params1.P2x, params1.P2y, params1.P2z],
                      [params1.P3x, params1.P3y, params1.P3z],
                      [params1.P4x, params1.P4y, params1.P4z],
                      [params1.P5x, params1.P5y, params1.P5z],
                      [params1.P6x, params1.P6y, params1.P6z],
                      [params1.P7x, params1.P7y, params1.P7z]];
  }
  else if (curve_type == 1) {
      params = params2;
      curve_points = [[params2.P0x, params2.P0y, params2.P0z],
                      [params2.P1x, params2.P1y, params2.P1z],
                      [params2.P2x, params2.P2y, params2.P2z],
                      [params2.P3x, params2.P3y, params2.P3z],
                      [params2.P4x, params2.P4y, params2.P4z],
                      [params2.P5x, params2.P5y, params2.P5z],
                      [params2.P6x, params2.P6y, params2.P6z],
                      [params2.P7x, params2.P7y, params2.P7z],
                      [params2.P8x, params2.P8y, params2.P8z]];
  }
  else {
    params = params3;
    curve_points = [[params3.P0x, params3.P0y, params3.P0z],
                    [params3.P1x, params3.P1y, params3.P1z],
                    [params3.P2x, params3.P2y, params3.P2z],
                    [params3.P3x, params3.P3y, params3.P3z],
                    [params3.P4x, params3.P4y, params3.P4z],
                    [params3.P5x, params3.P5y, params3.P5z],
                    [params3.P6x, params3.P6y, params3.P6z],
                    [params3.P7x, params3.P7y, params3.P7z],
                    [params3.P8x, params3.P8y, params3.P8z],
                    [params3.P9x, params3.P9y, params3.P9z],
                    [params3.P10x, params3.P10y, params3.P10z],
                    [params3.P11x, params3.P11y, params3.P11z],
                    [params3.P12x, params3.P12y, params3.P12z],
                    [params3.P13x, params3.P13y, params3.P13z],
                    [params3.P14x, params3.P14y, params3.P14z],
                    [params3.P15x, params3.P15y, params3.P15z]];
  }
  

  var curve = createCatmullRomCurve3(curve_points, params.steps, params.close, angle); 
  var curveMat = new THREE.LineBasicMaterial( { color: 0x00ff00, linewidth: 30 } );

  scene.remove(quadcopter.curveObject);
  quadcopter.curveObject = new THREE.Line( curve[0], curveMat );

  if (draw_curve) scene.add(quadcopter.curveObject);
  
  return curve[1]
}


function createCatmullRomCurve3(points, steps, closes, angle) {
    // Create a smooth 3d spline curve from a series of points using the Catmull-Rom algorithm.
    var N_step = Math.round(steps)+1 || 20;
    var geometry = new THREE.Geometry();
    var rotatePoint  =  new THREE.Vector3(0, 0, 1);
    var curve = new THREE.CatmullRomCurve3();

    var point;
    for (var i = 0; i < points.length; i++){
        point = points[i];
        curve.points[i] = new THREE.Vector3(point[0], point[1], point[2]);
        curve.points[i].applyAxisAngle(rotatePoint, angle);
        curve.points[i].y += 5;
    }
    
    curve.closed = closes;
    
    var stepSize = 1 / (N_step - 1);
    for (var i = 0; i < N_step; i ++) {
        geometry.vertices.push( curve.getPoint(i * stepSize) );
    }

    return [geometry, curve];
};


function CreateCylinder(SpeedChange,SpeedCylinder,bools){
 
if(bools){
  scene.remove(SpeedCylinder)
  var point =new THREE.Mesh(new THREE.CylinderGeometry(0, 0.02, 0.05, 30), new THREE.MeshPhongMaterial({color:0xff0000}));
  SpeedCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, SpeedChange, 30), new THREE.MeshPhongMaterial({color:0xff0000}));
  SpeedCylinder.add(point);
  point.position.y = 0.025+SpeedChange/2;
  scene.add(SpeedCylinder);
}
else scene.remove(SpeedCylinder)
  return SpeedCylinder;
};


function buildDroneCannon(){
  var boxShape = new CANNON.Box(new CANNON.Vec3(SIZE*0.3, SIZE*0.2, SIZE*0.7));
  var droneBody = new CANNON.Body({ mass: 5 });
  droneBody.addShape(boxShape);
  droneBody.position.set(0,1,0);

  var cylinderShape = new CANNON.Cylinder(SIZE*0.4, SIZE*0.4, SIZE*0.05,50);

  droneBody.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1,0.4*SIZE));
  droneBody.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1, -0.4*SIZE));
  droneBody.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1,-0.4*SIZE));
  droneBody.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1, 0.4*SIZE));

  return droneBody;
}


function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0,-10,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
  var groundMaterial = new CANNON.Material("groundMaterial");

  // create quadcopter body
  body = buildDroneCannon();
  world.addBody(body);
  
  let groundShape = new CANNON.Plane()
  let groundCM = new CANNON.Material()
  let groundBody = new CANNON.Body({ mass: 0,
                                     shape: groundShape,
                                     material: groundCM });
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  groundBody.position.y = -0.15;
  world.add(groundBody);
   
}


function initThree() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z =5;
  camera.position.y =6;

  var ambientLight = new THREE.AmbientLight(0xdddddd);
  ambientLight.intensity=0.5;
  scene.add(ambientLight);
  
  var spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(-10, 40, -10);
  spotLight.angle = Math.PI/12;
  spotLight.penumbra = 1
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = spotLight.angle / Math.PI * 180 * 2;
  scene.add(spotLight);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x888888);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.body.appendChild( renderer.domElement );
  
  // let controls = new THREE.OrbitControls(camera, renderer.domElement); 
  //controls.enableKeys = false;
  
  
  quadcopter = new Quadcopter();
  spotLight.target = quadcopter.body;
  
  buildScene();
  // buildObstacle();
}
