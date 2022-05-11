var pickables = [];
var showplane1, showplane2, showplane3;
var circles=[], curveCcw, Sloopcurve, SlineCurve;
var sphere, spherelight;
var RADIUS = 2, PI = 2.5;
var curve;

var params1 = {
  P0x: 0-RADIUS, P0y: 0 ,P0z:0,
  P1x: -0.5*RADIUS*Math.sqrt(2)+RADIUS-RADIUS, P1y: 0 ,P1z:RADIUS*0.5*Math.sqrt(2),
  P2x: RADIUS-RADIUS, P2y: 0,P2z:RADIUS,
  P3x: 0.5*RADIUS*Math.sqrt(2)+RADIUS-RADIUS, P3y: 0,P3z:RADIUS*0.5*Math.sqrt(2),
  P4x: 2*RADIUS-RADIUS, P4y: 0,P4z:0,
  P5x: 0.5*RADIUS*Math.sqrt(2)+RADIUS-RADIUS, P5y: 0 ,P5z:-RADIUS*0.5*Math.sqrt(2),
  P6x: RADIUS-RADIUS, P6y: 0,P6z:-RADIUS,
  P7x: -0.5*RADIUS*Math.sqrt(2)+RADIUS-RADIUS, P7y: 0,P7z:-RADIUS*0.5*Math.sqrt(2),      
  steps: 50,
  close:true
};

var params3 = {
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
  close:false
};

( function( ) {
      Math.clamp = function(val,min,max) {
          return Math.min(Math.max(val,min),max);
      } 
} )();


var createFatLine = function (opt) {
 
    opt = opt || {};
    opt.width = opt.width || 5;
 
    // LINE MATERIAL
    var matLine = new THREE.LineMaterial({
            linewidth: opt.width, // in pixels
            vertexColors: THREE.VertexColors
        });
    matLine.resolution.set(320, 240);
 
    var line = new THREE.Line2(opt.geo, matLine);
 
    return line;
 
};


function createDashboard(sprite, pointer, controlRange) { // 儀錶盤
  renderer.autoClear = false;
  sceneHUD = new THREE.Scene();

  whRatio = window.innerWidth / window.innerHeight;
  halfH = 10;
  halfW = whRatio * halfH;

  var lighthud = new THREE.DirectionalLight( 0xffffff, 1 ); // soft white light
	lighthud.position.set(10,10,50);

  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  let omegaTurn = loader.load('https://i.imgur.com/TNNXgJr.png');  
  omegaTurn.wrapS = THREE.RepeatWrapping

  // =================================== 儀表盤設計 ===================================
  var circle = [], circle2 = [], circle3 = [];

	for (i = 0; i < 4; i++) {
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

	for (i = 0; i < 4; i++) {
      pointer[i] = new THREE.Group();
      dashBoard[i] = new THREE.Group();
      pointerer[i] = new THREE.Mesh( new THREE.PlaneGeometry(1.8, 0.1), 
                                    new THREE.MeshPhongMaterial({ color: 0xff0000 }));
                                    
      center[i] = new THREE.Mesh( new THREE.CircleGeometry( 0.2, 32 ), 
                                  new THREE.MeshPhongMaterial({ color: 0x000000 }));
      pointerer[i].add(center[i]);
      center[i].position.set(1,0,0);
      pointer[i].add(pointerer[i]);
      dashBoard[i].add(circle[i], circle2[i], circle3[i], pointer[i]);
	}

	sceneHUD.add(dashBoard[0], dashBoard[1], dashBoard[2], dashBoard[3], lighthud)

	dashBoard[0].position.set(-halfW / 2.5, -(halfH - halfW / 10), 0)
	dashBoard[1].position.set(-halfW / 8, -(halfH - halfW / 10), 0)
	dashBoard[2].position.set(halfW / 8, -(halfH - halfW / 10), 0)
	dashBoard[3].position.set(halfW / 2.5, -(halfH - halfW / 10), 0)

	for (i = 0; i < 4; i++) {
      pointer[i].position.z = 0.3
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

      sprite[i] = new SpriteText2D("0", {
        align: textAlign.center,
        font: '100px Monospace',
        fillStyle: '0x3d59ab',
        antialias: true
      });
      sprite[i].position.y = 1.2;
      sprite[i].scale.set(0.005, 0.005, 0.005);

      rpm[i] = new SpriteText2D("RPM", {
        align: textAlign.center,
        font: '80px Monospace',
        fillStyle: '0x3d59ab',
        antialias: true
      });
      rpm[i].position.y = 0.55;
      rpm[i].scale.set(0.005, 0.005, 0.005);

      dashBoard[i].add(sprite[i], rpm[i], motorNumber[i])
	}

  // =================================== 陀螺儀設計 ===================================
	var x = window.innerWidth / window.innerHeight;
	let ControlTex = loader.load('https://i.imgur.com/QnO94NW.png');

  for (var i = 0; i < 2; i++) {
      controlRange[i] = new THREE.Group();
  }
  // 左側陀螺儀
	leftControlRange = new THREE.Mesh( new THREE.CircleGeometry(4,30),
                                 new THREE.MeshBasicMaterial({ color: 0xe428fc, 
                                                               map:ControlTex, 
                                                               transparent: true,}));
	leftControlRange.position.set(x * 10 * -3 / 4, 8 * -50 / 100, 0);

	var leftInside1 = new THREE.Mesh( new THREE.RingGeometry(3, 3.3,30),
                                new THREE.MeshBasicMaterial({ color: 0x0000ff, 
                                                              transparent: true,
                                                              opacity :0.4 }));	
	leftInside1.position.set(x * 10 * -3 / 4, 8 * -50 / 100,0);

	var leftInside2 = new THREE.Mesh( new THREE.RingGeometry(2.7, 3.1,30),
                                new THREE.MeshBasicMaterial({ color: 0x0000ff, 
                                                              transparent: true,
                                                              opacity :0.18 }));	
	leftInside2.position.set(x * 10 * -3 / 4, 8 * -50 / 100,0);
  controlRange[0].add(leftControlRange, leftInside1, leftInside2);
  
  // 右側陀螺儀
	rightControlRange = new THREE.Mesh( new THREE.CircleGeometry(4,30),
                                      new THREE.MeshBasicMaterial({ color: 0x40ebf7, 
                                                                    map:ControlTex, 
                                                                    transparent: true }));
	rightControlRange.position.set(x * 10 * 3 / 4, 8 * -50 / 100,0);
	rightInside1 = new THREE.Mesh( new THREE.RingGeometry(3, 3.3,30),
                                 new THREE.MeshBasicMaterial({ color: 0x28f4f7,  
                                                               transparent: true,
                                                               opacity :0.4 }));
	rightInside1.position.set(x * 10 * 3 / 4, 8 * -50 / 100,0);
	rightInside2 = new THREE.Mesh( new THREE.RingGeometry(2.7, 3.1,30),
                                 new THREE.MeshBasicMaterial({ color: 0x28f4f7, 
                                                               transparent: true,
                                                               opacity :0.18 }));	
	rightInside2.position.set(x * 10 * 3 / 4, 8 * -50 / 100,0);
  controlRange[1].add(rightControlRange, rightInside1, rightInside2);
	
  // =================================== 左陀螺儀圖示 (上升下降、旋轉) ===================================
	arrowTex_UP  = loader.load('https://i.imgur.com/RvBtr5N.png');
	arrowTex_RIGHT = loader.load('https://i.imgur.com/MwcQCwh.png');
	arrowTex_LEFT = loader.load('https://i.imgur.com/a4dqORu.png');

	upArrow = new THREE.Mesh( new THREE.PlaneGeometry(2, 2),
                            new THREE.MeshBasicMaterial({ color: 0x28f477, 
                                                          map : arrowTex_UP,
                                                          opacity : 0.8,
                                                          transparent: true }));
  upArrow.position.set(x * 10 * -3 / 4 , 8 * -50 / 100 + 2,0);
  upArrow.rotation.z = Math.PI / 2

	downArrow = upArrow.clone();	
  downArrow.position.set(x * 10 * -3 / 4 , 8 * -50 / 100 - 2,0);
	downArrow.rotation.z = -Math.PI / 2
	
  turnRightArrow = new THREE.Mesh( new THREE.PlaneGeometry(1, 1),
                                   new THREE.MeshBasicMaterial({ color: 0x28f477, 
                                                                 map : arrowTex_RIGHT,
                                                                 opacity : 0.8,
                                                                 transparent: true }));	
	turnRightArrow.position.set(x * 10 * -3 / 4 + 2, 8 * -50 / 100,0);

	turnLeftArrow = new THREE.Mesh( new THREE.PlaneGeometry(1, 1),
                                  new THREE.MeshBasicMaterial({ color: 0x28f477, 
                                                                map : arrowTex_LEFT,
                                                                opacity : 0.8,
                                                                transparent: true }));	
	turnLeftArrow.position.set(x * 10 * -3 / 4 - 2, 8 * -50 / 100,0);
	turnLeftArrow.rotation.z = Math.PI;
  controlRange[0].add(upArrow, downArrow, turnRightArrow, turnLeftArrow);

  // =================================== 右陀螺儀圖示 (前後左右移動) ===================================
  arrowTex_MOVE = loader.load('https://i.imgur.com/gVXZl0q.png');

	goLeft = new THREE.Mesh( new THREE.PlaneGeometry(1, 1),
                           new THREE.MeshBasicMaterial({ color: 0x555555, 
                                                         map : arrowTex_MOVE,
                                                         opacity : 0.8,
                                                         transparent: true }));	
	goLeft.position.set(x * 10 * 3 / 4 - 2, 8 * -50 / 100,0);
	goRight = goLeft.clone();
	goRight.position.set(x * 10 * 3 / 4 + 2, 8 * -50 / 100,0);
	goRight.rotation.z = Math.PI;
	goForward = goLeft.clone();
	goForward.position.set(x * 10 * 3 / 4, 8 * -50 / 100 + 2,0);
	goForward.rotation.z = -Math.PI / 2;
	goBack = goLeft.clone();
	goBack.position.set(x * 10 * 3 / 4, 8 * -50 / 100 - 2,0);
	goBack.rotation.z = Math.PI / 2;
  controlRange[1].add(goLeft, goRight, goBack, goForward);

	sceneHUD.add(controlRange[0], controlRange[1]);

}


function buildDrone() {

  // =================================== 無人機本體設計 ===================================
  quadcopter = new THREE.Object3D();
  
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  texture = loader.load('https://i.imgur.com/qr8kAad.png');
  ttuTexture = loader.load('https://i.imgur.com/gHlWEnT.png');
  cameraTexture = loader.load('https://i.imgur.com/opw7n3t.png');
  
  var centerBox = new THREE.Mesh( new THREE.BoxGeometry(0.3, 0.2, 0.6), 
                                  new THREE.MeshPhongMaterial({ color: 0x262b28, 
                                                                map: texture }));
  centerBox.castShadow = true;
  centerBox.receiveShadow = true;

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

  sphere = new THREE.Mesh( new THREE.SphereGeometry(0.05, 32, 32 ), 
                           new THREE.MeshPhongMaterial({ color: 0xFF3030 }));
  sphere.position.set(0,-0.1,0);

  centerBox.add(logo, droneCamera, sphere);
  quadcopter.add(centerBox);
  
  // =================================== 無人機螺旋槳設計 ===================================
  // 連接 centerBody 的軸
  let boxLinks = []
  for (i = 0; i < 4; i++) {
    boxLinks[i] = new THREE.Mesh( new THREE.BoxGeometry(0.3, 0.1, 0.02), 
                                  new THREE.MeshPhongMaterial({ color: 0x333333,
                                                                map: texture }));
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
  material = new THREE.MeshPhongMaterial({ color: 0x333333,
                                           side: THREE.DoubleSide,
                                           map: texture })
  motorSides[0] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50, 2, true, 4, 2.5), material)
  motorSides[0].name="detail";
  motorSides[0].position.set(-.40, .10, .40)
  motorSides[1] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50, 2, true, 2.8, 2.5), material)
  motorSides[1].position.set(-.40, .10, -.40)
  motorSides[1].name="detail";
  motorSides[2] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50,2, true, 1, 2.5), material)
  motorSides[2].position.set(.40, .10, -.40)
  motorSides[2].name="detail";
  motorSides[3] = new THREE.Mesh(new THREE.CylinderGeometry(.40, .40, .05, 50,2, true, -0.5, 2.5), material)
  motorSides[3].position.set(.40, .10, .40)
  motorSides[3].name="detail";
  pickables = [motorSides[0], motorSides[1], motorSides[2], motorSides[3]];

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
  motorTexture = loader.load('https://i.imgur.com/yCho2gY.png');
  let motors=[];
  for(i=0;i<4;i++){
      motors[i] = new THREE.Mesh( new THREE.PlaneGeometry(.75, .10), 
                                  new THREE.MeshPhongMaterial({ map:motorTexture,
                                                                transparent: true, 
                                                                side:THREE.DoubleSide }));
      motors[i].rotation.x = -Math.PI / 2;
      motors[i].castShadow = true;
      motors[i].receiveShadow = true; 
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

  Head = new THREE.Mesh(head, new THREE.MeshPhongMaterial({ color: 0x262b28, 
                                                            map : texture }));
  Head2 = Head.clone()
  bodyBox.add(Head, Head2)
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

  Top = new THREE.Mesh(top, new THREE.MeshPhongMaterial({ color: 0xffffff }));
  bodyBox.add(Top)
  bodyBox.scale.set(0.01,0.01,0.01);

  quadcopter.add(new THREE.AxesHelper (2));
  return quadcopter;
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
  showplane1 = new THREE.Object3D();
  var plane2 = new THREE.Mesh( new THREE.PlaneGeometry(8,8), 
                               new THREE.MeshBasicMaterial({ color:0xff0000,
                                                             side:THREE.DoubleSide,  
                                                             transparent: true,
                                                             opacity: 0.2,
                                                             visible: true }));
  plane2.rotation.x=Math.PI/2;
  showplane1.position.y=5;
  showplane1.add (plane2);
  showplane1.visible = false
  // scene.add(showplane1)
  
  showplane2 = new THREE.Object3D();
  var plane3 = new THREE.Mesh( new THREE.PlaneGeometry(10,6), 
                               new THREE.MeshBasicMaterial({ color:0xff0000, 
                                                             side:THREE.DoubleSide,  
                                                             transparent: true,
                                                             opacity: 0.2,
                                                             visible: true }));
  plane3.rotation.x=Math.PI/2;
  showplane2.position.y=5;
  showplane2.add (plane3);
  showplane2.visible = false
  

  showplane3 = new THREE.Object3D();
  var plane4 = new THREE.Mesh(new THREE.PlaneGeometry(12,6), 
               new THREE.MeshBasicMaterial({ color:0xff0000,
                                             side:THREE.DoubleSide,  
                                             transparent: true,
                                             opacity: 0.2,
                                             visible: true }));
  plane4.rotation.x=Math.PI/2;
  showplane3.add (plane4);
  showplane3.position.y=5;
  showplane3.visible = false

  scene.add(showplane1, showplane2, showplane3);

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


createCatmullRomCurve3 = function (cpList, steps,closes,angle,plane) {

  var N = Math.round(steps)+1 || 20;
  var geometry = new THREE.Geometry();
  curveCcw = new THREE.CatmullRomCurve3();
  var cp = cpList[0];
  curveCcw.points[0] = new THREE.Vector3(cp[0], cp[1], cp[2]);
  cp = cpList[1];
  curveCcw.points[1]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
  cp = cpList[2];
  curveCcw.points[2]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
  
  var rotatePoint  =  new THREE.Vector3(0, 0,1);
  rotatePoint=rotatePoint.clone().normalize();

  cp = cpList[3];
  curveCcw.points[3]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
  cp = cpList[4];
  curveCcw.points[4]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
  cp = cpList[5];
  curveCcw.points[5]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[6];
  curveCcw.points[6]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[7];
  curveCcw.points[7]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
  curveCcw.points[0].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[1].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[2].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[3].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[4].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[5].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[6].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[7].applyAxisAngle(rotatePoint,angle);
  curveCcw.points[0].y+=5
  curveCcw.points[1].y+=5
  curveCcw.points[2].y+=5
  curveCcw.points[3].y+=5
  curveCcw.points[4].y+=5
  curveCcw.points[5].y+=5
  curveCcw.points[6].y+=5
  curveCcw.points[7].y+=5
  curveCcw.closed=closes;
  
  var j, stepSize = 1/(N-1);
  for (j = 0; j < N; j++) {
      geometry.vertices.push( curveCcw.getPoint(j * stepSize) );
  }
  return geometry;
};


createCatmullRomSCurve3 = function (cpList, steps, closes, angle, plane) {

  var N = Math.round(steps)+1 || 20;
  var geometry = new THREE.Geometry();
  Sloopcurve = new THREE.CatmullRomCurve3();
  var cp ;
  var rotatePoint  =  new THREE.Vector3(0, 0,1);
  rotatePoint=rotatePoint.clone().normalize();
  
  for(let i=0;i<16;i++)
  {
  var cp = cpList[i];
  Sloopcurve.points[i] = new THREE.Vector3(cp[0], cp[1], cp[2]);
  Sloopcurve.points[i].applyAxisAngle(rotatePoint,angle);
  Sloopcurve.points[i].y+=5;
   }
  Sloopcurve.closed=closes;
  
  var j, stepSize = 1/(N-1);
  for (j = 0; j < N; j++) {
      geometry.vertices.push( Sloopcurve.getPoint(j * stepSize) );
  }
  return geometry;
};

  
createCatmullRomSlineCurve3 = function (cpList, steps, closes, angle, plane) {

  var N = Math.round(steps)+1 || 20;
  var geometry = new THREE.Geometry();
   SlineCurve = new THREE.CatmullRomCurve3();
  var cp = cpList[0];
  SlineCurve.points[0] = new THREE.Vector3(cp[0], cp[1], cp[2]);
  cp = cpList[1];
  SlineCurve.points[1]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
  cp = cpList[2];
  SlineCurve.points[2]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
  
  var rotatePoint  =  new THREE.Vector3(0, 0,1);
  rotatePoint=rotatePoint.clone().normalize();

  cp = cpList[3];
  SlineCurve.points[3]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[4];
  SlineCurve.points[4]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[5];
  SlineCurve.points[5]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[6];
  SlineCurve.points[6]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[7];
  SlineCurve.points[7]  = new THREE.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[8];
  SlineCurve.points[8]  = new THREE.Vector3(cp[0], cp[1], cp[2]);

  SlineCurve.points[0].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[1].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[2].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[3].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[4].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[5].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[6].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[7].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[8].applyAxisAngle(rotatePoint,angle);
  SlineCurve.points[0].y+=5
  SlineCurve.points[1].y+=5
  SlineCurve.points[2].y+=5
  SlineCurve.points[3].y+=5
  SlineCurve.points[4].y+=5
  SlineCurve.points[5].y+=5
  SlineCurve.points[6].y+=5
  SlineCurve.points[7].y+=5
  SlineCurve.points[8].y+=5
 // plane.rotateX(angle);
  SlineCurve.closed=closes;
  
  var j, stepSize = 1/(N-1);
  for (j = 0; j < N; j++) {
      geometry.vertices.push( SlineCurve.getPoint(j * stepSize) );
  }
  return geometry;
};


function CreateSline(angle){
  // scene.remove(curve3);
  var controlPoints1 = [[params3.P0x, params3.P0y, params3.P0z],
                        [params3.P1x, params3.P1y, params3.P1z],
                        [params3.P2x, params3.P2y, params3.P2z],
                        [params3.P3x, params3.P3y, params3.P3z],
                        [params3.P4x, params3.P4y, params3.P4z],
                        [params3.P5x, params3.P5y, params3.P5z],
                        [params3.P6x, params3.P6y, params3.P6z],
                        [params3.P7x, params3.P7y, params3.P7z],
                        [params3.P8x, params3.P8y, params3.P8z] ];
  var curveGeom1 = createCatmullRomSlineCurve3(controlPoints1, params3.steps,params3.close,angle);
  
  var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 30 } );
  curve3 = new THREE.Line( curveGeom1, mat );
  //scene.add(curve3);
};


function CreateCurve(angle){
  //scene.remove(curve1);
  var controlPoints1 = [[params1.P0x, params1.P0y, params1.P0z],
                        [params1.P1x, params1.P1y, params1.P1z],
                        [params1.P2x, params1.P2y, params1.P2z],
                        [params1.P3x, params1.P3y, params1.P3z],
                        [params1.P4x, params1.P4y, params1.P4z],
                        [params1.P5x, params1.P5y, params1.P5z],
                        [params1.P6x, params1.P6y, params1.P6z],
                        [params1.P7x, params1.P7y, params1.P7z]];
  var curveGeom1 = createCatmullRomCurve3(controlPoints1, params1.steps,params1.close,angle); 
  var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 30 } );
  curve1 = new THREE.Line( curveGeom1, mat );
  // scene.add(curve1);
};

function CreateSCurve(angle){
  scene.remove(curve);
  var params2 = {
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
                steps: 50,close:true};        
  var controlPoints1 = [
                [params2.P0x, params2.P0y, params2.P0z],
                [params2.P1x, params2.P1y, params2.P1z],
                [params2.P2x, params2.P2y, params2.P2z],
                [params2.P3x, params2.P3y, params2.P3z],
                [params2.P4x, params2.P4y, params2.P4z],
                [params2.P5x, params2.P5y, params2.P5z],
                [params2.P6x, params2.P6y, params2.P6z],
                [params2.P7x, params2.P7y, params2.P7z],
                [params2.P8x, params2.P8y, params2.P8z],
                [params2.P9x, params2.P9y, params2.P9z],
                [params2.P10x, params2.P10y, params2.P10z],
                [params2.P11x, params2.P11y, params2.P11z],
                [params2.P12x, params2.P12y, params2.P12z],
                [params2.P13x, params2.P13y, params2.P13z],
                [params2.P14x, params2.P14y, params2.P14z],
                [params2.P15x, params2.P15y, params2.P15z]
      ];
  var curveGeom1 = createCatmullRomSCurve3(controlPoints1, params1.steps,params1.close,angle);
  
  var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 30 } );
  curve = new THREE.Line( curveGeom1, mat );
  scene.add(curve);
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


function builddroneCannon(){
  var boxShape = new CANNON.Box(new CANNON.Vec3(SIZE*0.3, SIZE*0.2, SIZE*0.7));
  dronebody = new CANNON.Body({ mass: 5 });
  dronebody.addShape(boxShape);
  dronebody.position.set(0,1,0);

  var cylinderShape = new CANNON.Cylinder(SIZE*0.4, SIZE*0.4, SIZE*0.05,50);

  dronebody.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1,0.4*SIZE));
  dronebody.addShape(cylinderShape, new CANNON.Vec3( -0.4*SIZE, 0.1, -0.4*SIZE));
  dronebody.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1,-0.4*SIZE));
  dronebody.addShape(cylinderShape, new CANNON.Vec3(  0.4*SIZE, 0.1, 0.4*SIZE));

  return dronebody;
}


function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0,-10,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
  var groundMaterial = new CANNON.Material("groundMaterial");

  // create airplane body
  body =builddroneCannon();
  world.addBody(body);
  
  let groundShape = new CANNON.Plane()
  let groundCM = new CANNON.Material()
  let groundBody = new CANNON.Body({
  mass: 0,
  shape: groundShape,
  material: groundCM
  })
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


  upCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  upCamera.position.z =2;
  upCamera.position.y =5;

  spherelight = new THREE.PointLight (0xFF3030,1, 1);
  scene.add (spherelight)
  var ambientLight = new THREE.AmbientLight(0xdddddd);
  ambientLight.intensity=0.5;
  scene.add(ambientLight);
  
  var light2 = new THREE.SpotLight(0xffffff, 0.5);
  light2.position.set(-10, 40, -10);
  light2.angle = Math.PI/12;
  light2.penumbra = 1
  light2.castShadow = true;
  light2.shadow.mapSize.width = 1024;
  light2.shadow.mapSize.height = 1024;
  light2.shadow.camera.near = 10;
  light2.shadow.camera.far = 200;
  light2.shadow.camera.fov = light2.angle / Math.PI * 180 * 2;
  scene.add(light2);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x888888);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  //let controls = new THREE.OrbitControls(camera, renderer.domElement); 
  //controls.enableKeys = false;
  
  buildScene();
  // buildObstacle();
  scene.add(buildDrone());
  light2.target=quadcopter;
}
