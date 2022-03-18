// Global variables
// height and width of the browser window
var ww = window.innerWidth;
var wh = window.innerHeight;

// Frame number for animation
var frame = 0;

// Define an array of spheres
var n = 4;
var spheres = [];

// Each sphere will have its out speed, and direction
var directions = []; // booleans
var speeds = []; // scalars

// cube speed
var cube_speed = 4;

function startGame() {
    let startDiv = document.getElementById("start");
    let gameCanvas = document.getElementById("scene");
    let gameOver = document.getElementById("game-over");
    let winStatus = document.getElementById("win");
    startDiv.style.display = "none";
    gameCanvas.style.display = "block";
    gameOver.style.display = "none";
    winStatus.style.display = "none";
    init();
}

function gameOver() {
    let startDiv = document.getElementById("start");
    let gameCanvas = document.getElementById("scene");
    let gameOver = document.getElementById("game-over");
    let winStatus = document.getElementById("win");

    startDiv.style.display = "none";
    gameCanvas.style.display = "none";
    gameOver.style.display = "block";
    winStatus.style.display = "none";
}

function youWin() {
    let startDiv = document.getElementById("start");
    let gameCanvas = document.getElementById("scene");
    let gameOver = document.getElementById("game-over");
    let winStatus = document.getElementById("win");

    startDiv.style.display = "none";
    gameCanvas.style.display = "none";
    gameOver.style.display = "none";
    winStatus.style.display = "block";
}

function init() {
  /*Initilization function
    Calls render, camera, light, makeBox, and makes scene
  */

  // Make a renderer
  createRenderer();
  document.body.appendChild(renderer.domElement);

  // Make a camera
  createCamera();
  // Make a light
  createLight();


  // Build a scene to glue everything together
  // Need to add in the camera, light, and objects
  scene = new THREE.Scene();
  scene.add(camera);
  scene.add(light);


  // get caerma to look at origin
  camera.lookAt(scene.position);


  // Create an array of spheres
  for (let i = 1; i <= n; i++) {
    let sphere = createSphere();
    sphere.position.x = 60 - i * 100/n;
    spheres.push(sphere);
    scene.add(sphere);
    directions.push(true);
    speeds.push(getRandomInt(1, 5));
  }

  // Create sphere and add to scene
  createCube();
  scene.add(cube);

  // Create ground
  // Add ground to scene
  createGround();
  scene.add(ground);


  // get the renderer to render our scene
  // leave the rendering to last
  renderer.render(scene, camera);

  // If the user scrolls up or down
  window.addEventListener("mousewheel", zoom);

  // If the user presses an arrow key
  window.addEventListener("keydown", move);

  // animate at the end of the setup
  animate();


}

function getRandomInt(min_num, max_num) {
  min_num = Math.ceil(min_num);
  max_num = Math.floor(max_num);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max_num - min_num) + min_num);
}

function createRenderer() {
  /* Creates the renderer*/
  // Call rendering engine WebGL
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene")
  });
  // set the background colour of our scene
  renderer.setClearColor(0x000000);

  // render the full screen
  renderer.setSize(ww, wh);

  // Activate shadow rendering
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMapType.type = THREE.PCFSoftShadowMap;
  renderer.physicallyBasedShading = true;

}

function createCamera() {
  /* Creates the camera*/
  camera = new THREE.PerspectiveCamera(75, ww / wh, 1, 10000);

  // set position of camera
  // x = 0, y = 0, z = 500
  camera.position.set(0, 100, 100);

}

function createLight() {
  /* Creates the light*/

  // colour = white, intensity = 1
  // Directional light is like the sun at a direction
  light = new THREE.SpotLight(0xffffff);

  // We the position of our light
  // x = 50, y = 250, z = 500
  light.position.set(0, 80, 0);

  // Let light cast shadow
  light.castShadow = true;
}

function createSphere() {

	/*
  Return a sphere object.
  - give it random size
  - make sure it can cast shadow and receive shadow
  */

  // 1. geometry
  // wdith = 200, hiegh = 200, length = 200
  let geometry = new THREE.SphereGeometry(getRandomInt(3, 5), 32, 16);

  // 2. texture
  let texture = new THREE.MeshLambertMaterial({
    color: 0x00ff00
  });

  // 3. Mesh
  // give it a geometry and texture
  let sphere = new THREE.Mesh(geometry, texture);

  // Add some position
  sphere.position.y = getRandomInt(2, 10);
  sphere.position.z = getRandomInt(-60, 60);

  // shadows
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  return sphere;

}

function createCube() {
  /* Creates the cube*/

  // 1. geometry
  // wdith = 200, hiegh = 200, length = 200
  geometry = new THREE.BoxGeometry(8, 8, 8);

  // 2. texture
  texture = new THREE.MeshLambertMaterial({
    color: 0x00ff00
  });

  // 3. Mesh
  // give it a geometry and texture
  cube = new THREE.Mesh(geometry, texture);

  // Add some position
  cube.position.set(65, 5, 0);

  // Rotate it a bit to see more of the cube
  // Angle is in units of radians

  // shadows
  cube.castShadow = true;
  cube.receiveShadow = true;

}

function createGround() {
  ground = new THREE.Mesh(
    new THREE.BoxGeometry(160, 1, 160),
    new THREE.MeshLambertMaterial({
      color: 0x979A9A,
      //	opacity: 0.3,
      //	transparent: true
    }));
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
}

var animate = function() {
  // Request another frame of the animation
  // call itself
  requestAnimationFrame(animate);

  // Make sphere bob
  //sphere.position.y += 0.8*Math.sin(frame*Math.PI/100);
  for (let i = 0; i < n; i++) {

    // check if hit
    if ((Math.abs(spheres[i].position.z - cube.position.z) < 8) && (Math.abs(spheres[i].position.x - cube.position.x) < 8)) {
      gameOver();
    }

    // check if you reach the other side of the ground
    if (cube.position.x < -60) {
    	youWin();
    }

    spheres[i].position.y += 0.5 * Math.sin(frame * 2 * Math.PI / 30);

    if (directions[i] == true) {
      spheres[i].position.z += 0.1 * speeds[i];
    } else {
      spheres[i].position.z -= 0.1 * speeds[i];
    }

    if (spheres[i].position.z > 75) {
      directions[i] = false;
    } else if (spheres[i].position.z < -75) {
      directions[i] = true;
    }

  }

  // move one frame beyond
  frame += 1;

  //Re-render everytime we make change
  renderer.render(scene, camera);
}

var zoom = function(e) {
  //Move our camera up or down
  camera.position.z += e.deltaY;
  camera.position.x += e.deltaY;
}

var move = function(e) {
  // Figure out which ints the 4 arrow correspond to

  let key_int = e.which;

  if (key_int == 37) {
    cube.position.x -= cube_speed;
  } else if (key_int == 39) {
    cube.position.x += cube_speed;
  } else if (key_int == 38) {
    cube.position.z -= cube_speed;
  } else if (key_int == 40) {
    cube.position.z += cube_speed;
  }
}
