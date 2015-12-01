//Author: Vincent Heredia
//Date: 11/9/2015

//three.js variables
var scene;
var controls;
var renderer = new THREE.WebGLRenderer();
var camera;
var clock = new THREE.Clock();

//model view matrix
var MV;
var mvStack = [];
//var cubeMV;

//track ball variables
var trackingMouse = false;
var trackballMove = false;
var lastPos = [0, 0, 0];
var curx, cury;
var startX, startY;
var rotationMatrix;
var angle = 0.0;
var axis = new THREE.Vector3( 0, 0, 1 );

//rotation variables
var bRotation = 0;
var newB = 0;
var dRotation = 0;
var newD = 0;
var eExtend = 0;
var newEE = 0;
var eRotation = 0;
var newER = 0;
var fingerAngle = 0;
var newF = 0;


//Robot Parts
var cylinderA;
var cylinderB;
var cylinderC;
var cylinderD;
var cylinderE;
var cylinderF;
var cylinderG;
var cylinderH;
var rotateM = new THREE.Matrix4();
var translateM = new THREE.Matrix4();
var gBoundingBox;
var hBoundingBox;


//cube variables
var cubeX = 3;
var cubeY = 0;
var cubeZ = 0;
var cubeGrabbed = false;
var collidableObjects = [];//list of collidable objects

window.onload = init;
//init();
//animate();

function init()
{
	
	scene = new THREE.Scene();
	
	// add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0f0f0f);
    scene.add(ambientLight);

    var spotLight = new THREE.PointLight(0Xffffff);
    spotLight.position.set(-10, 60, 20);
    scene.add(spotLight);
	
	
    //use lookat
    renderer.setClearColor(0XEEEEEE);
    
	camera = new THREE.PerspectiveCamera( 75, screenSize()/screenSize(), 0.1, 100 );
	camera.position.z = 10; camera.position.y = 2;

    document.body.appendChild( renderer.domElement );
	
	//controls = new THREE.TrackballControls( camera );
    controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.target.set(0, 0, 0);
	controls.rotateSpeed = 4.0;
	controls.zoomSpeed = 0.2;
	controls.panSpeed = 0.2;
	controls.noRotate = false;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.1;
	//controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );


    createRobot();


	document.getElementById("sliderB").onmousemove = function(){
		newB = event.srcElement.value;
		animateRobot();
		bRotation = event.srcElement.value;
	};
	document.getElementById("sliderC").onmousemove = function(){
		newD = event.srcElement.value;
		animateRobot();
		dRotation = event.srcElement.value;
	};
	document.getElementById("sliderEe").onmousemove = function(){
		newEE = event.srcElement.value;
		animateRobot();
		eExtend = event.srcElement.value;
	};
	document.getElementById("sliderEr").onmousemove = function(){
		newER = event.srcElement.value;
		animateRobot();
		eRotation = event.srcElement.value;
	};
	document.getElementById("sliderFinger").onmousemove = function(){
		newF = event.srcElement.value;
		animateRobot();
		fingerAngle = event.srcElement.value;
	};
	
	window.addEventListener( 'resize', screenSize, false );
	
	render();
	animate();
}



function animate()
{	
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
}
function render(){
    renderer.render(scene, camera);
}



function screenSize() {
	var min;
	if(window.innerHeight < window.innerWidth){ min = window.innerHeight; }
	else{ min = window.innerWidth; }
	renderer.setSize( min, min );
	return min;
}



//-------------------------------------------Robot Creation and Animation-----------------------------------------------

//Purpose: This function animates the robot
//Algorithm: each object is moved back to the origin then to it's new location
function animateRobot(){

	mvStack.clear;
	
	//need a new model view matrix
	MV = new THREE.Matrix4;

	//negMV is the inversed matrix
	var negMV = new THREE.Matrix4;;

	//----------------------------part B-------------------------------------
	//animate part B
	MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.0, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationY( newB*(3.14/180) ) 
    );
    
	negMV.multiplyMatrices( 
		translateM.makeTranslation( 0.0, -1.0, 0.0 ),
    	negMV
    );
    negMV.multiplyMatrices(
    	rotateM.makeRotationY( -bRotation*(3.14/180) ),
    	negMV
    );

    var negTemp = new THREE.Matrix4();
	mvStack.push(negTemp.copy(MV));
	MV.multiplyMatrices( 
    	MV, 
    	negMV
    );
    cylinderB.applyMatrix(MV);
    MV.copy(mvStack.pop());
	//----------------------------part B-------------------------------------
	

	//----------------------------part C-------------------------------------
	var temp = new THREE.Matrix4();
	mvStack.push(temp.copy(MV));
	//animate part C
	MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.5, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationX( 90*(3.14/180) ) 
    );
	
	var negTemp = new THREE.Matrix4();
	mvStack.push(negTemp.copy(negMV));
	negMV.multiplyMatrices( 
    	translateM.makeTranslation( 0.0, -1.5, 0.0 ),
    	negMV
    );
    negMV.multiplyMatrices( 
    	rotateM.makeRotationX( -90*(3.14/180) ),
    	negMV
    );

	MV.multiplyMatrices( 
    	MV, 
    	negMV
    );
    cylinderC.applyMatrix(MV);
    negMV.copy(mvStack.pop());
	MV.copy(mvStack.pop());
	//----------------------------part C-------------------------------------
	
	
	//----------------------------part D-------------------------------------
	//animate part D
   	MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.5, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( newD*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.0, 0.0 )
    );
	
	negMV.multiplyMatrices(
		translateM.makeTranslation( 0.0, -1.5, 0.0 ),
    	negMV
    );
    negMV.multiplyMatrices(
    	rotateM.makeRotationZ( -dRotation*(3.14/180) ),
    	negMV
    );
	negMV.multiplyMatrices(
		translateM.makeTranslation( 0.0, -1.0, 0.0 ),
    	negMV
    );
   	
    var negTemp = new THREE.Matrix4();
	mvStack.push(negTemp.copy(MV));
	MV.multiplyMatrices( 
    	MV, 
    	negMV
    );
    cylinderD.applyMatrix(MV);
    MV.copy(mvStack.pop());
    //----------------------------part D-------------------------------------
	

	//----------------------------part E-------------------------------------
    //animate part E
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationY( newER*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, newEE, 0.0 )
    );
    
    negMV.multiplyMatrices( 
		rotateM.makeRotationY( -eRotation*(3.14/180) ),
    	negMV
    );
	negMV.multiplyMatrices(
		translateM.makeTranslation( 0.0, -eExtend, 0.0 ),
    	negMV
    );

	var negTemp = new THREE.Matrix4();
	mvStack.push(negTemp.copy(MV));
	MV.multiplyMatrices( 
    	MV, 
    	negMV
    );
    cylinderE.applyMatrix(MV);
    MV.copy(mvStack.pop());
	//----------------------------part E-------------------------------------
	
	
	//----------------------------part F-------------------------------------
	//animate part F
	MV.multiplyMatrices( 
    	MV, 
   		translateM.makeTranslation( 0.0, 1.0, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( 90*(3.14/180) ) 
    );

   	negMV.multiplyMatrices(
   		translateM.makeTranslation( 0.0, -1.0, 0.0 ),
    	negMV
    );
    negMV.multiplyMatrices( 
    	rotateM.makeRotationZ( -90*(3.14/180) ),
    	negMV
    );

	var negTemp = new THREE.Matrix4();
	mvStack.push(negTemp.copy(MV));
	MV.multiplyMatrices( 
    	MV, 
    	negMV
    );
    cylinderF.applyMatrix(MV);
    MV.copy(mvStack.pop());
	//----------------------------part F-------------------------------------

	
	//----------------------------part G-------------------------------------
    //animate part G
    var temp = new THREE.Matrix4();
	mvStack.push(temp.copy(MV));
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 0.7, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( 90*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( -newF*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, -0.6, 0.0 )
    );
	
	var negTemp = new THREE.Matrix4();
	mvStack.push(negTemp.copy(negMV));
	negMV.multiplyMatrices(
		translateM.makeTranslation( 0.0, -0.7, 0.0 ),
    	negMV
    );
    negMV.multiplyMatrices( 
    	rotateM.makeRotationZ( -90*(3.14/180) ),
    	negMV 
    );
    negMV.multiplyMatrices( 
    	rotateM.makeRotationZ( fingerAngle*(3.14/180) ),
    	negMV
    );
    negMV.multiplyMatrices(
    	translateM.makeTranslation( 0.0, 0.6, 0.0 ),
    	negMV
    );
	
	MV.multiplyMatrices( 
    	MV, 
    	negMV
    );
	cylinderG.applyMatrix(MV);
	negMV.copy(mvStack.pop());
	MV.copy(mvStack.pop());
	//----------------------------part G-------------------------------------

	
	//----------------------------part H-------------------------------------
    //animate part H
    var temp = new THREE.Matrix4();
	mvStack.push(temp.copy(MV));
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, -0.7, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( 90*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( newF*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, -0.6, 0.0 )
    );
	

	var negTemp = new THREE.Matrix4();
	mvStack.push(negTemp.copy(negMV));
	negMV.multiplyMatrices(
		translateM.makeTranslation( 0.0, 0.7, 0.0 ),
    	negMV
    );
    negMV.multiplyMatrices( 
    	rotateM.makeRotationZ( -90*(3.14/180) ),
    	negMV
    );
    negMV.multiplyMatrices( 
    	rotateM.makeRotationZ( -fingerAngle*(3.14/180) ),
    	negMV
    );
    negMV.multiplyMatrices( 
    	translateM.makeTranslation( 0.0, 0.6, 0.0 ),
    	negMV
    );
	
	MV.multiplyMatrices( 
    	MV, 
    	negMV
    );
	cylinderH.applyMatrix(MV);
	negMV.copy(mvStack.pop());
	MV.copy(mvStack.pop());
	//----------------------------part H-------------------------------------
	


	//This section checks for collisions with the cube
	var collision = false;
	var hCollision = false;
	var gCollision = false;
	var originPoint = cube.position.clone();
	
	for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
	{		
		var localVertex = cube.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( cube.matrix );
		var directionVector = globalVertex.sub( cube.position );


		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

		//check for H collision
		var collisionResults = ray.intersectObject( cylinderH );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
			hCollision = true;
		}
		//check for G collision
		var collisionResults = ray.intersectObject( cylinderG );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
			gCollision = true;
		}
	}

	//if both H and G are collided
	if(hCollision == true && gCollision == true){
		collision = true;
	}

	//if cube is picked up
	if (collision == true){//if cube surface collides with both fingers
		if(cubeGrabbed == true){
			//translate front location between fingers to origin, then translate to location between fingers
			MV.multiplyMatrices( 
				MV, 
				translateM.makeTranslation( 0.0, 0.0, 0.9 )
    		);
			negMV.multiplyMatrices( 
				translateM.makeTranslation( 0.0, 0.0, -0.9 ),
				negMV
    		);
    		MV.multiplyMatrices( 
    			MV, 
    			negMV
    		);
			cube.applyMatrix(MV);
		}
		else {
			//translate from original location to origin
			cube.applyMatrix(translateM.makeTranslation( -cubeX, -cubeY, -cubeZ ));

			//then translate to location between fingers
			MV.multiplyMatrices( 
				MV, 
				translateM.makeTranslation( 0.9, 0.0, 0.0 )
    		);
			cube.applyMatrix(MV);

			cubeGrabbed = true;
		}
		
	}
	else if ((cubeGrabbed == true) && (collision == false)){//fingers are not colliding, and grabbed == true, drop the cube
		//move the cube to x = x, z = z, y = 0
		
		MV.multiplyMatrices( 
			MV, 
			translateM.makeTranslation( 0.0, 0.0, 0.9 )
    	);
		negMV.multiplyMatrices( 
			translateM.makeTranslation( 0.0, 0.0, -0.9 ),
			negMV
    	);
		//set cube's previous position
		cubeX = cube.position.x;
		cubeY = 0.0;
		cubeZ = cube.position.z;

		cube.applyMatrix(negMV);		
		
		cube.position.set(cubeX, cubeY, cubeZ);
		cubeGrabbed = false;
	}
}



//Purpose: Creates the robot model
function createRobot(){
	
	MV = new THREE.Matrix4;
	var geometry;
	var material;
	//var cylinder;
	var rotateM = new THREE.Matrix4();
    var translateM = new THREE.Matrix4();
	

	//part a
    geometry = new THREE.CylinderGeometry( 2, 2, 1, 32 );
	material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    cylinderA = new THREE.Mesh( geometry, material );
    scene.add( cylinderA );
    
	
    //part B
    geometry = new THREE.CylinderGeometry( 0.9, 0.9, 1.7, 32 );
    material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    cylinderB = new THREE.Mesh( geometry, material );
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.0, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationY( bRotation*(3.14/180) ) 
    );
    cylinderB.applyMatrix(MV);
    scene.add( cylinderB );


    //piece c
    var temp = new THREE.Matrix4();
	mvStack.push(temp.copy(MV));
    geometry = new THREE.CylinderGeometry( 0.67, 0.67, 1.3, 32 );
    material = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
    cylinderC = new THREE.Mesh( geometry, material );
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.5, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationX( 90*(3.14/180) ) 
    );
    cylinderC.applyMatrix(MV);
    scene.add( cylinderC );
    

	//piece d
	MV.copy(mvStack.pop());
    geometry = new THREE.CylinderGeometry( 0.4, 0.4, 2.0, 32 );
    material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    cylinderD = new THREE.Mesh( geometry, material );
    rotateM = new THREE.Matrix4();
    translateM = new THREE.Matrix4();
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.5, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( dRotation*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.0, 0.0 )
    );
    cylinderD.applyMatrix(MV);
    scene.add( cylinderD );


	//piece E
    geometry = new THREE.CylinderGeometry( 0.2, 0.2, 2.0, 32 );
    material = new THREE.MeshLambertMaterial( { color: 0x0055ff } );
    cylinderE = new THREE.Mesh( geometry, material );
    rotateM = new THREE.Matrix4();
    translateM = new THREE.Matrix4();
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, eExtend, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationY( eRotation*(3.14/180) ) 
    );
    cylinderE.applyMatrix(MV);
    scene.add( cylinderE );

	
	//piece F
    geometry = new THREE.CylinderGeometry( 0.15, 0.15, 1.5, 32 );
    material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    cylinderF = new THREE.Mesh( geometry, material );
    rotateM = new THREE.Matrix4();
    translateM = new THREE.Matrix4();
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 1.0, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( 90*(3.14/180) ) 
    );
    cylinderF.applyMatrix(MV);
    scene.add( cylinderF );
	

	//piece g
	var temp = new THREE.Matrix4();
	mvStack.push(temp.copy(MV));
    geometry = new THREE.CylinderGeometry( 0.15, 0.15, 1.2, 32 );
    material = new THREE.MeshLambertMaterial( { color: 0x5500ff } );
    cylinderG = new THREE.Mesh( geometry, material );
    rotateM = new THREE.Matrix4();
    translateM = new THREE.Matrix4();
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, 0.7, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( 90*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( -fingerAngle*(3.14/180) ) 
    );
     MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, -0.6, 0.0 )
    );
    cylinderG.applyMatrix(MV);
    scene.add( cylinderG );
    //this object will be checked for collisions with the cube
    collidableObjects.push(cylinderG);


	//piece h
	MV.copy(mvStack.pop());
    geometry = new THREE.CylinderGeometry( 0.15, 0.15, 1.2, 32 );
    material = new THREE.MeshLambertMaterial( { color: 0x5500ff } );
    cylinderH = new THREE.Mesh( geometry, material );
    rotateM = new THREE.Matrix4();
    translateM = new THREE.Matrix4();
    MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, -0.7, 0.0 )
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( 90*(3.14/180) ) 
    );
    MV.multiplyMatrices( 
    	MV, 
    	rotateM.makeRotationZ( fingerAngle*(3.14/180) ) 
    );
     MV.multiplyMatrices( 
    	MV, 
    	translateM.makeTranslation( 0.0, -0.6, 0.0 )
    );
    cylinderH.applyMatrix(MV);
    scene.add( cylinderH );
    //this object will be checked for collisions with the cube
	collidableObjects.push(cylinderH);

	

	//create cube
	cubeMV = new THREE.Matrix4;
	
	geometry = new THREE.BoxGeometry( 0.8, 0.8, 0.8, 2, 2, 2);
    material = new THREE.MeshLambertMaterial( { color: 0x5500ff } );
	cube = new THREE.Mesh( geometry, material );
	
	cubeMV.multiplyMatrices( 
    	cubeMV, 
    	translateM.makeTranslation( cubeX, cubeY, cubeZ )
    );
	cube.applyMatrix(cubeMV);
	scene.add( cube );


}

