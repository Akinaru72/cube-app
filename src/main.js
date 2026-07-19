// main.js

import * as THREE from 'three';
import { RubiksCube } from './js/cube/RubiksCube.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initKeyboard } from './js/controls/keyboardControls.js';
import { CubeState } from './js/solver/CubeState.js';
import { createTables } from './js/createTables';
import { solveCube } from './js/solver/solveCube.js';

// import { scramble } from './js/cube/scrambler.js';

const cubeState = new CubeState();

const scene = new THREE.Scene();
const cube = new RubiksCube(scene);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
// renderer.setSize(window.innerWidth, window.innerHeight);
const cubeContainer = document.querySelector('#cube-container');

cubeContainer.appendChild(renderer.domElement);

renderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);

window.addEventListener('resize', () => {
  camera.aspect = cubeContainer.clientWidth / cubeContainer.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);
});
// document.body.appendChild(renderer.domElement);

import { initMouseControls } from './js/controls/mouseControls.js';

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

scene.background = new THREE.Color(0x444444);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

camera.position.set(4, 4, 6);
camera.lookAt(0, 0, 0);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

// initMouseControls({
//   renderer,
//   camera,
//   scene,
//   controls,
//   cube,
// });

cube.create();
// ----------------------------------------
// startDemo;
cube.startDemo();
// ---------------------------------
// const scramble = cube.scramble();
// console.log(scramble);

// console.log(alg.join(' '));

// ---------------------------------------------------

// const scrambleText = scramble(20).join(' ');

// console.log(scrambleText);

// ----------------------Solve-----------------------------
// const result = await solveCube(cubeState);

// console.log(result.solution);
// -------------------------test--------
initKeyboard(cube);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  cube.update();
  cube.rotateY(0.01);
  cube.rotateX(0.01);
  renderer.render(scene, camera);
}

animate();

//----------------------------------------------------------------
