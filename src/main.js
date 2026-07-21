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

window.addEventListener('mousemove', onUserActivity);
window.addEventListener('mousedown', onUserActivity);
window.addEventListener('keydown', onUserActivity);
const headerEls = document.querySelector('.header');
const navEls = document.querySelector('.cube-controls');
const scrambleBtn = document.querySelector('#scramble-btn');
const solveBtn = document.querySelector('#solve-btn');
const undoBtn = document.querySelector('#undo-btn');
const redoBtn = document.querySelector('#redo-btn');

scrambleBtn.disabled = true;
solveBtn.disabled = true;
undoBtn.disabled = true;
redoBtn.disabled = true;

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

initMouseControls({
  renderer,
  camera,
  scene,
  controls,
  cube,
});
let screenSaverTimer;
cube.create();
resetScreenSaverTimer();
// ---------------------Вход в приложение-------------------

const resetBtn = document.querySelector('#reset-btn');

function startScramble() {
  cube.scramble();
}

function startApplication() {
  // console.log('Helloooo');
  cube.reset();

  resetBtn.textContent = 'RESET';
}
cube.startDemo();

resetBtn.addEventListener('click', startApplication);

scrambleBtn.addEventListener('click', startScramble);

// --------------------Заставка-------------------------,

function onUserActivity() {
  if (cube.screenSaver) {
    cube.stopScreenSaver();
  }

  resetScreenSaverTimer();
}

function resetScreenSaverTimer() {
  clearTimeout(screenSaverTimer);

  screenSaverTimer = setTimeout(
    () => {
      console.log('WOW');
      cube.startScreenSaver();
      // navEl.classList.add('is-hidden');
      // cube - controls;
    },
    // 10000
    10 * 60 * 1000
  ); // 10 минут
}

console.log('SOLVED_MAIN', cubeState.isSolved());

// ---------------------------------
// const scramble = cube.scramble();
// console.log(scramble);

// console.log(alg.join(' '));

// ---------------------------------------------------

// const scrambleText = scramble(20).join(' ');

// console.log(scrambleText);
// ----проверка-----------------

// const state = new CubeState();

// console.log('START');
// console.log(state.isSolved());

// state.move('R');
// console.log('AFTER R');
// console.log({
//   CO: state.encodeCO(),
//   EO: state.encodeEO(),
//   UDS: state.encodeUDSlice(),
//   CP: state.encodeCP(),
//   EP: state.encodeEP(),
//   EPerm: state.encodeEPerm(),
//   solved: state.isSolved(),
// });

// state.move("R'");
// console.log("AFTER R'");
// console.log({
//   CO: state.encodeCO(),
//   EO: state.encodeEO(),
//   UDS: state.encodeUDSlice(),
//   CP: state.encodeCP(),
//   EP: state.encodeEP(),
//   EPerm: state.encodeEPerm(),
//   solved: state.isSolved(),
// });
// // CP: 36177;
// // EP: 21024;
// ----------------------Solve-----------------------------
// const result = await solveCube(cubeState);

// console.log(result);
// console.log(result.phase1);
// console.log(result.phase2);
// console.log(result.length);
// -------------------------test--------
initKeyboard(cube);

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  cube.update();

  if (cube.screenSaver) {
    cube.rotateY(0.01);

    cube.rotateX(0.01);
    navEls.classList.add('is-hidden');
    headerEls.classList.add('is-hidden');
  } else {
    navEls.classList.remove('is-hidden');
    headerEls.classList.remove('is-hidden');
  }

  if (cube.demo) {
    cube.rotateY(0.01);
    cube.rotateX(0.01);
  }

  renderer.render(scene, camera);
}

animate();

//----------------------------------------------------------------
