// index.js
import * as THREE from 'three';
import { RubiksCube } from './js/RubiksCube.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initKeyboard } from './js/controls.js';

const scene = new THREE.Scene();
const cube = new RubiksCube(scene);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

cube.create();

cube.scramble(30);

initKeyboard(cube);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  cube.update();
  // cube.rotateY(0.01);
  renderer.render(scene, camera);
}

animate();

//----------------------------------------------------------------
