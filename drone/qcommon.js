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
function createDashboard(){
  ////////////////////////////////////////////////////////
  renderer.autoClear = false;
  sceneHUD = new THREE.Scene();

  whRatio = window.innerWidth / window.innerHeight;
  halfH = 10;
  halfW = whRatio * halfH;

  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  let omegaTurn = loader.load('https://i.imgur.com/TNNXgJr.png');
  omegaTurn.wrapS = THREE.RepeatWrapping


  var circle = [], circle2 = [], circle3 = [],dash=[];

	for (i = 0; i < 4; i++) {
		dash[i]=new THREE.Mesh(new THREE.RingGeometry( 2, 2.2, 32, 8, -0.9, 4.9), new THREE.MeshPhongMaterial( { color:0xF8F8ff} )); 
		circle[i] = new THREE.Mesh(new THREE.CircleGeometry(2, 80, -0.9, 4.9), new THREE.MeshPhongMaterial({
			color:0xD0e9ff,
			side: THREE.DoubleSide
		}));
		circle2[i] = new THREE.Mesh(new THREE.RingGeometry( 1.5, 2, 32, 8, -0.9, 4.9), new THREE.MeshPhongMaterial( { color: 0x1742ab, side: THREE.DoubleSide,map:omegaTurn } ));
		circle3[i] = new THREE.Mesh(new THREE.RingGeometry( 1.5, 2, 32, 8, -0.9, 0.7), new THREE.MeshPhongMaterial( { color: 0xab1d17, side: THREE.DoubleSide } )); ////////红色末标
		if(i == 0 || i == 2)circle2[i].material.color.setHex( 0xcfc754 );
	}

	var pointerer = [], dashBoard = [],point=[];

	for (i = 0; i < 4; i++) {
		pointer[i] = new THREE.Group();
		dashBoard[i] = new THREE.Group();
		pointerer[i] = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.1), new THREE.MeshPhongMaterial({
			color: 0xff0000
		}))
		point[i]=new THREE.Mesh(new THREE.CircleGeometry( 0.2, 32 ), new THREE.MeshPhongMaterial({
			color: 0x000000
		}))
		pointerer[i].add(point[i]);
		point[i].position.set(1,0,0);
		pointer[i].add(pointerer[i])
		dashBoard[i].add(circle[i], circle2[i], pointer[i],dash[i],circle3[i])
	}
  

	var lighthud = new THREE.DirectionalLight( 0xffffff, 1 ); // soft white light
	lighthud.position.set(10,10,50);


	sceneHUD.add(dashBoard[0], dashBoard[1], dashBoard[2], dashBoard[3],lighthud)

	dashBoard[0].position.set(-halfW / 2.5, -(halfH - halfW / 10), 0)
	dashBoard[1].position.set(-halfW / 8, -(halfH - halfW / 10), 0)
	dashBoard[2].position.set(halfW / 8, -(halfH - halfW / 10), 0)
	dashBoard[3].position.set(halfW / 2.5, -(halfH - halfW / 10), 0)
	for (i = 0; i < 4; i++) {
		pointer[i].position.z = 0.3
		//pointerer[i].position.y=0.2;
		circle2[i].position.z = 0.1
		circle3[i].position.z = 0.2
		pointerer[i].position.x = -1
	}
	////////////////////////////////////////////////////////////////////
	var Text2D = THREE_Text.MeshText2D;
	var SpriteText2D = THREE_Text.SpriteText2D;
	var textAlign = THREE_Text.textAlign;
	var sprites=[],motornumber=[];
  

	for (i = 0; i < 4; i++) {
		motornumber[i] = new SpriteText2D("Motor"+(i+1), {
			align: textAlign.center,
			font: '60px Monospace',
			fillStyle: '0x3d59ab',
			antialias: true
		});
		motornumber[i].scale.set(0.005, 0.005, 0.005);
		motornumber[i].position.set(-0.75,0.15,0);

		sprite[i] = new SpriteText2D("0", {
			align: textAlign.center,
			font: '80px Monospace',
			fillStyle: '0x3d59ab',
			antialias: true
		});
		sprite[i].scale.set(0.005, 0.005, 0.005);

		sprites[i] = new SpriteText2D("RPM", {
			align: textAlign.center,
			font: '80px Monospace',
			fillStyle: '0x3d59ab',
			antialias: true
		});
		sprites[i].scale.set(0.005, 0.005, 0.005);

		dashBoard[i].add(sprite[i],sprites[i],motornumber[i])
		sprite[i].position.y = 1;
		sprites[i].position.y=0.55;
	}
	var x = window.innerWidth / window.innerHeight;
	let ControlTex = loader.load('https://i.imgur.com/QnO94NW.png');
	ControlRange = new THREE.Mesh(new THREE.CircleGeometry(4,30),new THREE.MeshBasicMaterial({
		color: 0xe428fc, 
		map:ControlTex, 
		transparent: true,
	}));
	ControlRange.position.set(x * 10 * -3 / 4, 8 * -50 / 100,0);
	inside1 = new THREE.Mesh(new THREE.RingGeometry(3, 3.3,30),new THREE.MeshBasicMaterial({
		color: 0x0000ff, 
		transparent: true,
		opacity :0.4
	}));	
	inside1.position.set(x * 10 * -3 / 4, 8 * -50 / 100,0);
	inside2 = new THREE.Mesh(new THREE.RingGeometry(2.7, 3.1,30),new THREE.MeshBasicMaterial({
		color: 0x0000ff, 
		transparent: true,
		opacity :0.18
	}));	
	inside2.position.set(x * 10 * -3 / 4, 8 * -50 / 100,0);
	ControlRange2 = new THREE.Mesh(new THREE.CircleGeometry(4,30),new THREE.MeshBasicMaterial({
		color: 0x40ebf7, 
		map:ControlTex, 
		transparent: true,
	}));
	ControlRange2.position.set(x * 10 * 3 / 4, 8 * -50 / 100,0);
	insideR1 = new THREE.Mesh(new THREE.RingGeometry(3, 3.3,30),new THREE.MeshBasicMaterial({
		color: 0x28f4f7,  
		transparent: true,
		opacity :0.4
	}));
	insideR1.position.set(x * 10 * 3 / 4, 8 * -50 / 100,0);
	insideR2 = new THREE.Mesh(new THREE.RingGeometry(2.7, 3.1,30),new THREE.MeshBasicMaterial({
		color: 0x28f4f7, 
		transparent: true,
		opacity :0.18
	}));	
	insideR2.position.set(x * 10 * 3 / 4, 8 * -50 / 100,0);
	ControlPick1 = new THREE.Object3D;
	pickOutside1 = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.8,30),new THREE.MeshBasicMaterial({
		color: 0x0000ff, 
		opacity : 0.7
	}));	
	pickInside1 = new THREE.Mesh(new THREE.CircleGeometry(0.7,30),new THREE.MeshBasicMaterial({
		color: 0x0000ff, 
		opacity : 0.1
	}));
	pickInside2 = new THREE.Mesh(new THREE.CircleGeometry(0.5,8),new THREE.MeshBasicMaterial({
		color: 0x000088, 
		opacity : 0.4
	}));
	
	ControlPick1.position.set(x * 10 * -3 / 4, 8 * -50 / 100,0);
	ControlPick1.add(pickOutside1, pickInside1, pickInside2)
	
	ControlPick2 = new THREE.Object3D;
	pickOutside2 = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.8,30),new THREE.MeshBasicMaterial({
		color: 0x28f4f7
	}));
	pickInside3 = new THREE.Mesh(new THREE.CircleGeometry(0.7,30),new THREE.MeshBasicMaterial({
		color: 0x28f4f7, 
		opacity : 0.1
	}));
	pickInside4 = new THREE.Mesh(new THREE.CircleGeometry(0.5,8),new THREE.MeshBasicMaterial({
		color: 0x28f477, 
		opacity : 0.4
	}));	
	ControlPick2.position.set(x * 10 * 3 / 4, 8 * -50 / 100,0);
	ControlPick2.add(pickOutside2, pickInside3, pickInside4)
	arrowTex = loader.load('https://i.imgur.com/RvBtr5N.png');
	arrowTex2 = loader.load('https://i.imgur.com/MwcQCwh.png');
	arrowTex3 = loader.load('https://i.imgur.com/a4dqORu.png');
	arrowTex4 = loader.load('https://i.imgur.com/gVXZl0q.png');
	upArrow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),new THREE.MeshBasicMaterial({
		color: 0x28f477, 
		map : arrowTex,
		opacity : 0.8,
		transparent: true,
	}));	
	downArrow = upArrow.clone();	
	upArrow.position.set(x * 10 * -3 / 4 , 8 * -50 / 100 + 2,0);
	upArrow.rotation.z = Math.PI / 2
	downArrow.position.set(x * 10 * -3 / 4 , 8 * -50 / 100 - 2,0);
	downArrow.rotation.z = -Math.PI / 2
	turnRightArrow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),new THREE.MeshBasicMaterial({
		color: 0x28f477, 
		map : arrowTex2,
		opacity : 0.8,
		transparent: true,
	}));	
	turnRightArrow.position.set(x * 10 * -3 / 4 + 2, 8 * -50 / 100,0);
	turnLeftArrow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),new THREE.MeshBasicMaterial({
		color: 0x28f477, 
		map : arrowTex3,
		opacity : 0.8,
		transparent: true,
	}));	
	turnLeftArrow.position.set(x * 10 * -3 / 4 - 2, 8 * -50 / 100,0);
	turnLeftArrow.rotation.z = Math.PI;
	goLeft = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),new THREE.MeshBasicMaterial({
		color: 0x555555, 
		map : arrowTex4,
		opacity : 0.8,
		transparent: true,
	}));	
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
	sceneHUD.add(upArrow, downArrow, turnRightArrow, turnLeftArrow, goLeft, goRight, goBack, goForward, ControlRange, inside1, inside2, ControlRange2, insideR1, insideR2, /*ControlPick1, ControlPick2*/);


}

var pickables = [];



function builddrone(){
  airplane = new THREE.Object3D();
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  texture = loader.load('https://i.imgur.com/qr8kAad.png');
  baby=loader.load('https://i.imgur.com/gHlWEnT.png');
  cameratexture=loader.load('https://i.imgur.com/opw7n3t.png');
  var box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.6), new THREE.MeshPhongMaterial({
    color: 0x262b28, 
    map: texture
  }));
  box.castShadow = true;
  box.receiveShadow = true; 
  var logo= new THREE.Mesh(new THREE.CircleGeometry( 0.1, 32 ), new THREE.MeshBasicMaterial({
  color:0xffffff,
  map: baby,
  side: THREE.DoubleSide
  }));
  var dronecamera= new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshBasicMaterial({
  color:0xffffff,
  map: cameratexture,
  side: THREE.DoubleSide
  }));
  airplane.add(box);
  box.add(logo,dronecamera);
  dronecamera.position.z=0.405
  logo.position.y=.152;
  logo.position.z=0.1
  logo.rotation.x=-Math.PI/2;
  sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.015, 32, 32 ), new THREE.MeshPhongMaterial( {color: 0xFF3030} ) );
  box.add(sphere);
  sphere.position.set(0,-0.1,0);

  spherelight = new THREE.PointLight (0xFF3030,1, 1);
  scene.add (spherelight)
  var ambientLight = new THREE.AmbientLight(0xfffffff);
  ambientLight.intensity=0.5;
  scene.add(ambientLight);

  //////////////////////////////////////////boxLinks
  let boxLinks = []
  for (i = 0; i < 4; i++) {
    boxLinks[i] = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.02), new THREE.MeshPhongMaterial({
      color: 0x333333,
      map: texture
    }));
    airplane.add(boxLinks[i])
  }
  boxLinks[0].position.set(-.25, 0, .3)
  boxLinks[0].rotation.y = Math.PI / 4
  boxLinks[1].position.set(-.25, 0, -.3)
  boxLinks[1].rotation.y = -Math.PI / 4
  boxLinks[2].position.set(.25, 0, -.30)
  boxLinks[2].rotation.y = Math.PI / 4
  boxLinks[3].position.set(.25, 0, .30)
  boxLinks[3].rotation.y = -Math.PI / 4
for (i=0;i<4;i++){
  boxLinks[i].castShadow = true;
  boxLinks[i].receiveShadow = true; 
}
  //////////////////////////////////////////motorSides
  let motorSides = []
  material = new THREE.MeshPhongMaterial({
    color: 0x333333,
    side: THREE.DoubleSide,
    map: texture
  })
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
  pickables= [motorSides[0],motorSides[1],motorSides[2],motorSides[3]];

  for (i = 0; i < 4; i++) {
    airplane.add(motorSides[i])
  }
  for (i=0;i<4;i++){
  motorSides[i].castShadow = true;
  motorSides[i].receiveShadow = true; 
}
  //////////////////////////////////////////motorCenters
  let motorCenters = [], motorCenters2 = []
  for (i = 0; i < 4; i++) {
    motorCenters[i] = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .35, .50), new THREE.MeshPhongMaterial({
      color: 0xCCCCCC, 
      map: texture
    }));
    airplane.add(motorCenters[i])
  }
  motorCenters[0].position.set(-.40, 0, .40)
  motorCenters[1].position.set(-.40, 0, -.40)
  motorCenters[2].position.set(.40, 0, -.40)
  motorCenters[3].position.set(.40, 0, .40)

    for (i=0;i<4;i++){
  motorCenters[i].castShadow = true;
  motorCenters[i].receiveShadow = true; 
}
  for (i = 0; i < 4; i++) {
    motorCenters2[i] = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .30, 50, 2, true), new THREE.MeshPhongMaterial({
      color: 0x333333, 
      map: texture
    }));
    airplane.add(motorCenters2[i])
  }
  motorCenters2[0].position.set(-.40, -.05, .40)
  motorCenters2[1].position.set(-.40, -.05, -.40)
  motorCenters2[2].position.set(.40, -.05, -.40)
  motorCenters2[3].position.set(.40, -.05, .40)
  let  motorshud = [];

 for (i=0;i<4;i++){
  motorCenters2[i].castShadow = true;
  motorCenters2[i].receiveShadow = true; 
  var Text2D = THREE_Text.MeshText2D;
  var SpriteText2D = THREE_Text.SpriteText2D;
  var textAlign = THREE_Text.textAlign;

  motorshud[i] = new SpriteText2D("Motor"+(i+1), {
  align: textAlign.center,
  font: '40px Monospace',
  fillStyle: '0x3d59ab',
  antialias: true
  });
  motorshud[i].scale.set(0.005, 0.005, 0.005);
  motorCenters2[i].add(motorshud[i]);
  motorshud[i].position.y+=0.5;
  motorshud[i].visible=false;

  }
  motorshud[0].position.z+=0.3;
  motorshud[1].position.z-=0.3;
  motorshud[2].position.z-=0.3;
  motorshud[3].position.z+=0.3;
  motorshud[0].position.x-=0.3;
  motorshud[1].position.x-=0.3;
  motorshud[2].position.x+=0.3;
  motorshud[3].position.x+=0.3;
//////////////////////////////////////////motorLinks
  let motorLinks = [],point=[],SpeedCylinder=[];
  for (i = 0; i < 8; i++) {
    motorLinks[i] = new THREE.Mesh(new THREE.BoxGeometry(.45, .04, .02), new THREE.MeshPhongMaterial({
      color: 0x333333,
      map: texture
    }));
    airplane.add(motorLinks[i])
  }
  motorLinks[0].position.set(-.60, 0, .40)
  motorLinks[1].position.set(-.60, 0, -.40)
  motorLinks[2].position.set(.60, 0, -.40)
  motorLinks[3].position.set(.60, 0, .40)
  motorLinks[0].rotation.z = -Math.PI / 6
  motorLinks[1].rotation.z = -Math.PI / 6
  motorLinks[2].rotation.z = Math.PI / 6
  motorLinks[3].rotation.z = Math.PI / 6
  motorLinks[4].position.set(-.40, 0, .60)
  motorLinks[4].rotation.y = -Math.PI / 2
  motorLinks[4].rotation.x = -Math.PI / 6
  motorLinks[5].position.set(-.40, 0, -.60)
  motorLinks[5].rotation.y = -Math.PI / 2
  motorLinks[5].rotation.x = Math.PI / 6
  motorLinks[6].position.set(.40, 0, -.60)
  motorLinks[6].rotation.y = -Math.PI / 2
  motorLinks[6].rotation.x = Math.PI / 6
  motorLinks[7].position.set(.40, 0, .60)
  motorLinks[7].rotation.y = -Math.PI / 2
  motorLinks[7].rotation.x = -Math.PI / 6
  //////////////////////////////////////////motors
for (i=0;i<8;i++){
  motorLinks[i].castShadow = true;
  motorLinks[i].receiveShadow = true; 
}

  motorTexture = loader.load('https://i.imgur.com/yCho2gY.png');
  let motors=[];
  for(i=0;i<4;i++){
  motors[i] = new THREE.Mesh(new THREE.PlaneGeometry(.75, .10), new THREE.MeshPhongMaterial({map:motorTexture,transparent: true, side:THREE.DoubleSide}));
  motors[i].rotation.x = -Math.PI / 2;
  airplane.add(motors[i]);
  motors[i].castShadow = true;
  motors[i].receiveShadow = true; 
  }
  motors[0].position.set(-.40, .10, .40)
  motors[1].position.set(-.40, .10, -.40)
  motors[2].position.set(.40, .10, -.40)
  motors[3].position.set(.40, .10, .40)
 motors[1].rotation.y = Math.PI
motors[3].rotation.y = Math.PI
  
   for(i=0;i<4;i++){
  point[i] =new THREE.Mesh(new THREE.CylinderGeometry(0, 0.04, 0.05, 30), new THREE.MeshPhongMaterial({color:0xff0000}));
  SpeedCylinder[i] = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 30), new THREE.MeshPhongMaterial({color:0xff0000}));
  SpeedCylinder[i].add(point[i]);
  SpeedCylinder[i].rotation.x=Math.PI/2;
  point[i].position.y=0.025+0.5/2;
  motors[i].add(SpeedCylinder[i]);
  SpeedCylinder[i].position+=2;
  }
var bodybox=new THREE.Object3D();
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
  Head = new THREE.Mesh(head, new THREE.MeshPhongMaterial({
    color: 0x262b28, 
    map : texture
  }));
  
  Head2 = Head.clone()
  bodybox.add(Head,Head2)
  airplane.add(bodybox)
  
  Head.position.set(-15, 10, 30)
  Head2.position.set(15, 10, -30)
  Head2.rotation.y = Math.PI 
  ///////////////////////////////////////////top
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
  Top = new THREE.Mesh(top, new THREE.MeshPhongMaterial({
    color: 0xffffff, 
    //map : texture
  }));
  bodybox.add(Top)
  bodybox.scale.set(0.01,0.01,0.01);





  airplane.add(new THREE.AxesHelper (2));
  return airplane;
}




var showplane1,showplane2,showplane3;
function buildScene() {

  //scene.add (new THREE.GridHelper (100,100, 'white', 'white'));
  //scene.add (new THREE.AxesHelper (5));  
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  var  texture = loader.load('https://img.freepik.com/free-vector/wood-planks-texture-background-parquet-flooring_1048-2145.jpg?size=338&ext=jpg');
  texture.repeat.set(20, 20);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  let tree = new THREE.Mesh(new THREE.CylinderGeometry(5, 4, 10, 30), new THREE.MeshNormalMaterial() );
  let atree;
  atree = tree.clone();
  atree.position.set(15, 5, 30);
  let plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshPhongMaterial({map:texture}));
  scene.add (plane);
  plane.receiveShadow = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  plane.rotation.x=-Math.PI/2;
  plane.position.y=-0.1

  atree = tree.clone();
  atree.position.set(-20, 5, 10);
  //  scene.add (atree);
  atree = tree.clone();
  atree.position.set(35, 5, -10);
  //scene.add (atree);
  atree = tree.clone();
  atree.position.set(-10, 5, -40);
  //scene.add (atree);
 // scene.background = cubeMap;

   showplane1 =new THREE.Object3D();
  var plane2= new THREE.Mesh(new THREE.PlaneGeometry(8,8), new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide,  transparent: true,
  opacity: 0.2,
  visible: true}));
  showplane1.add (plane2);
  plane2.rotation.x=Math.PI/2;
  scene.add(showplane1);
  showplane1.visible=false;
  showplane1.position.y=5;


   showplane2 =new THREE.Object3D();
  var plane3= new THREE.Mesh(new THREE.PlaneGeometry(10,6), new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide,  transparent: true,
  opacity: 0.2,
  visible: true}));
  showplane2.add (plane3);
  plane3.rotation.x=Math.PI/2;
  scene.add(showplane2);
  showplane2.visible=false;
  showplane2.position.y=5;

  showplane3 =new THREE.Object3D();
  var plane4= new THREE.Mesh(new THREE.PlaneGeometry(12,6), new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide,  transparent: true,
  opacity: 0.2,
  visible: true}));
  showplane3.add (plane4);
  plane4.rotation.x=Math.PI/2;
  scene.add(showplane3);
  showplane3.visible=false;
  showplane3.position.y=5;


}

var circles=[],curveCcw,Sloopcurve,SlineCurve;
var light2,sphere,spherelight;

function buildObstacle(){
   var geometry = new THREE.TorusGeometry( 1.5, 0.04, 16, 100 );
   var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
   var circle = new THREE.Mesh( geometry, material );
   circles[0]=circle.clone();
   circles[1]=circle.clone();
   circles[2]=circle.clone();
//   scene.add( circles[0],circles[1],circles[2]);
   circles[0].position.set(5,5,-5);
   circles[1].position.set(8,5,-10);
   circles[2].position.set(-10,5,5);
   //circles[2].rotation.y=Math.PI/2;

}



var angle1 = angle2 = angle3=0;
var Raidus=2,Pi=2.5;
var  point1, curve2,curve3,curveObjectt, geometryCurve, materialCurve;


   var params1 = {P0x: 0-Raidus, P0y: 0 ,P0z:0,
            P1x: -0.5*Raidus*Math.sqrt(2)+Raidus-Raidus, P1y: 0 ,P1z:Raidus*0.5*Math.sqrt(2),
            P2x: Raidus-Raidus, P2y: 0,P2z:Raidus,
            P3x: 0.5*Raidus*Math.sqrt(2)+Raidus-Raidus, P3y: 0,P3z:Raidus*0.5*Math.sqrt(2),
            P4x: 2*Raidus-Raidus, P4y: 0,P4z:0,
            P5x: 0.5*Raidus*Math.sqrt(2)+Raidus-Raidus, P5y: 0 ,P5z:-Raidus*0.5*Math.sqrt(2),
            P6x: Raidus-Raidus, P6y: 0,P6z:-Raidus,
            P7x: -0.5*Raidus*Math.sqrt(2)+Raidus-Raidus, P7y: 0,P7z:-Raidus*0.5*Math.sqrt(2),      
            steps: 50,close:true};
            
   var params2 = {
   P0x: -2*Raidus, P0y:0 ,P0z:0,
   P1x:-0.5*Raidus*Math.sqrt(2)-Raidus, P1y: 0,P1z: 0.5*Raidus*Math.sqrt(2),
   P2x:  -Raidus, P2y: 0,P2z: Raidus,
   P3x:  0.5*Raidus*Math.sqrt(2)-Raidus, P3y: 0,P3z:0.5*Raidus*Math.sqrt(2),
   P4x: 0, P4y: 0 ,P4z:0,
   P5x: -0.5*Raidus*Math.sqrt(2)+Raidus, P5y: 0,P5z:-0.5*Raidus*Math.sqrt(2),
   P6x: Raidus, P6y: 0,P6z: -Raidus,   
   P7x: 0.5*Raidus*Math.sqrt(2)+Raidus, P7y: 0,P7z: -0.5*Raidus*Math.sqrt(2),      
   P8x: 2*Raidus , P8y:0 ,P8z:0,
   P9x: 0.5*Raidus*Math.sqrt(2)+Raidus, P9y: 0,P9z: 0.5*Raidus*Math.sqrt(2),
   P10x: Raidus, P10y: 0,P10z:Raidus,
   P11x: -0.5*Raidus*Math.sqrt(2)+Raidus, P11y: 0,P11z:0.5*Raidus*Math.sqrt(2),
   P12x: 0, P12y: 0 ,P12z:0,
   P13x: 0.5*Raidus*Math.sqrt(2)-Raidus, P13y: 0,P13z:-0.5*Raidus*Math.sqrt(2),
   P14x: -Raidus, P14y: 0,P14z:-Raidus,  
   P15x: -0.5*Raidus*Math.sqrt(2)-Raidus, P15y: 0,P15z:-0.5*Raidus*Math.sqrt(2)  ,   
                 steps: 50,close:true};

/*   var params3 = {
   P0x: -3*Pi, P0y:0 ,P0z:-Pi,
   P1x:-0.5*Pi, P1y: 0,P1z: Pi,
   P2x: 0.5*Pi, P2y: 0,P2z: -Pi,
   P3x: 3*Pi, P3y: 0,P3z:Pi,
                 steps: 50,close:false};*/

  var params3 = {
   P0x: -2*Pi, P0y:0 ,P0z:0,
   P1x: -1.5*Pi, P1y: 0,P1z: -2.5*Math.sin((-1.5*Pi)*Math.PI/5),
   P2x: -Pi, P2y: 0,P2z: Pi,
   P3x: -0.5*Pi, P3y: 0,P3z:-2.5*Math.sin(0.2*Math.PI*(-0.5*Pi)),
   P4x: 0, P4y: 0,P4z:0,
   P5x: .5*Pi, P5y: 0,P5z: -2.5*Math.sin((.5*Pi)*Math.PI/5),
   P6x: Pi, P6y: 0,P6z: -Pi,
   P7x: 1.5*Pi, P7y: 0,P7z:-2.5*Math.sin(0.2*Math.PI*(1.5*Pi)),
   P8x: 2*Pi, P8y: 0,P8z:0,


                 steps: 50,close:false};


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

  createCatmullRomSCurve3 = function (cpList, steps,closes,angle,plane) {

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

  
  
createCatmullRomSlineCurve3 = function (cpList, steps,closes,angle,plane) {

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
    var controlPoints1 = [
      [params3.P0x, params3.P0y, params3.P0z],
      [params3.P1x, params3.P1y, params3.P1z],
      [params3.P2x, params3.P2y, params3.P2z],
      [params3.P3x, params3.P3y, params3.P3z],
      [params3.P4x, params3.P4y, params3.P4z],
      [params3.P5x, params3.P5y, params3.P5z],
      [params3.P6x, params3.P6y, params3.P6z],
      [params3.P7x, params3.P7y, params3.P7z],
      [params3.P8x, params3.P8y, params3.P8z]



      ];
  var curveGeom1 = createCatmullRomSlineCurve3(controlPoints1, params3.steps,params3.close,angle);
  
  var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 30 } );
  curve3 = new THREE.Line( curveGeom1, mat );
  //scene.add(curve3);
};


 function CreateCurve(angle){
    //scene.remove(curve1);
    var controlPoints1 = [
      [params1.P0x, params1.P0y, params1.P0z],
      [params1.P1x, params1.P1y, params1.P1z],
      [params1.P2x, params1.P2y, params1.P2z],
      [params1.P3x, params1.P3y, params1.P3z],
      [params1.P4x, params1.P4y, params1.P4z],
      [params1.P5x, params1.P5y, params1.P5z],
      [params1.P6x, params1.P6y, params1.P6z],
      [params1.P7x, params1.P7y, params1.P7z]
      ];
 var curveGeom1 = createCatmullRomCurve3(controlPoints1, params1.steps,params1.close,angle);
  
  var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 30 } );
  curve1 = new THREE.Line( curveGeom1, mat );
  //scene.add(curve1);
};

  function CreateSCurve(angle){
     scene.remove(curve2);
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
  curve2 = new THREE.Line( curveGeom1, mat );
  scene.add(curve2);
};


function CreateCylinder(SpeedChange,SpeedCylinder,bools){
 
if(bools){
  scene.remove(SpeedCylinder)
  var point =new THREE.Mesh(new THREE.CylinderGeometry(0, 0.02, 0.05, 30), new THREE.MeshPhongMaterial({color:0xff0000}));
  SpeedCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, SpeedChange, 30), new THREE.MeshPhongMaterial({color:0xff0000}));
  SpeedCylinder.add(point);
  point.position.y=0.025+SpeedChange/2;
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
  groundBody.position.y=-0.15;
  world.add(groundBody) 
}

function initThree() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z =5;
  camera.position.y =6;


  upcamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  upcamera.position.z =2;
  upcamera.position.y =5;

  light2 = new THREE.SpotLight(0xffffff, 0.5);
  light2.position.set(-10, 40, -10);
  light2.angle = Math.PI/12;
  light2.penumbra = 1
   scene.add(light2);
  light2.castShadow = true;
  light2.shadow.mapSize.width = 1024;
  light2.shadow.mapSize.height = 1024;
  light2.shadow.camera.near = 10;
  light2.shadow.camera.far = 200;
  light2.shadow.camera.fov = light2.angle / Math.PI * 180 * 2;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x888888);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  //let controls = new THREE.OrbitControls(camera, renderer.domElement); 
  //controls.enableKeys = false;
  
  buildScene();
  buildObstacle();
  /////////////////////////////////////////////////////
  scene.add(builddrone());
}
