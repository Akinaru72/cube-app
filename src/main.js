// main.js

import * as THREE from 'three';
import { RubiksCube } from './js/cube/RubiksCube.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initKeyboard } from './js/controls/keyboardControls.js';
import { CubeState } from './js/solver/CubeState.js';
import { createTables } from './js/createTables';
import { solveCube } from './js/solver/solveCube.js';
import { initMouseControls } from './js/controls/mouseControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PMREMGenerator } from 'three';
import { guidePagesEN } from './js/docs/guidePagesEN.js';
import { guidePagesUA } from './js/docs/guidePagesUA.js';
import { cubePages } from './js/docs/cubePages.js';
import { createRubikLoader } from './js/solver/loader.js';

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
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const cubeContainer = document.querySelector('#cube-container');

cubeContainer.appendChild(renderer.domElement);
renderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);
window.addEventListener('resize', () => {
  camera.aspect = cubeContainer.clientWidth / cubeContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);
});

// -----------------------Light-----------------------
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1.2);
scene.add(hemiLight);
const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(5, 8, 7);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(-6, 4, -6);
scene.add(rimLight);
scene.background = new THREE.Color(0x444444);
// ------------------------End Light-----------------------

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.set(4, 4, 6);
camera.lookAt(0, 0, 0);

// ------------------------------------------
window.addEventListener('mousemove', onUserActivity);
window.addEventListener('mousedown', onUserActivity);
window.addEventListener('keydown', onUserActivity);
const headerEls = document.querySelector('.header');
const navEls = document.querySelector('.cube-controls');
const scrambleBtn = document.querySelector('#scramble-btn');
const solveBtn = document.querySelector('#solve-btn');
export const prevBtn = document.querySelector('#undo-btn');
const nextBtn = document.querySelector('#redo-btn');
const helpBtn = document.querySelector('#help-btn');
const descriptionBtn = document.querySelector('#description-btn');
const settingsBtn = document.querySelector('#settings-btn');
const guideBtn = document.querySelector('#guide-btn');
const modalOverlayEl = document.querySelector('.modal-overlay');
const modalHelpEl = document.querySelector('.modal-help');
const modalDescriptionEl = document.querySelector('.modal-description');
const modalSettingsEl = document.querySelector('.modal-settings');
const modalGuideEl = document.querySelector('.modal-guide');
const modalHelpBtnClose = document.querySelector('#modal-help-close');
const modalDescriptionBtnClose = document.querySelector(
  '#modal-description-close'
);
const modalSettingsBtnClose = document.querySelector('#modal-settings-close');
const modalGuideBtnClose = document.querySelector('#modal-guide-close');
const loaderEl = document.querySelector('#cube-loader-vis');
const openHeaderBtnEl = document.querySelector('#openHeaderBtn');
const modalMenuNavEl = document.querySelector('.modal-menu-nav');
const closeHeaderBtnEl = document.querySelector('#closeHeaderBtn');
const desMenuBtnEl = document.querySelector('#des-menu-btn');
const htsMenuBtnEl = document.querySelector('#hts-menu-btn');
const setMenuBtnEl = document.querySelector('#set-menu-btn');
const helpMenuBtnEl = document.querySelector('#help-menu-btn');

desMenuBtnEl.addEventListener('click', () => {
  modalMenuNavEl.classList.add('is-hidden');
  modalDescriptionEl.classList.remove('is-hidden');
});

htsMenuBtnEl.addEventListener('click', () => {
  modalMenuNavEl.classList.add('is-hidden');
  modalGuideEl.classList.remove('is-hidden');
});

setMenuBtnEl.addEventListener('click', () => {
  modalMenuNavEl.classList.add('is-hidden');
  modalSettingsEl.classList.remove('is-hidden');
});

helpMenuBtnEl.addEventListener('click', () => {
  modalMenuNavEl.classList.add('is-hidden');
  modalHelpEl.classList.remove('is-hidden');
});

openHeaderBtnEl.addEventListener('click', () => {
  modalOverlayEl.classList.add('is-open');
  modalMenuNavEl.classList.remove('is-hidden');
});

closeHeaderBtnEl.addEventListener('click', () => {
  modalOverlayEl.classList.remove('is-open');
  modalMenuNavEl.classList.add('is-hidden');
});

helpBtn.addEventListener('click', () => {
  modalOverlayEl.classList.add('is-open');
  modalHelpEl.classList.remove('is-hidden');
});

modalHelpBtnClose.addEventListener('click', () => {
  modalOverlayEl.classList.remove('is-open');
  modalHelpEl.classList.add('is-hidden');
});

descriptionBtn.addEventListener('click', () => {
  modalOverlayEl.classList.add('is-open');
  modalDescriptionEl.classList.remove('is-hidden');
});

modalDescriptionBtnClose.addEventListener('click', () => {
  modalOverlayEl.classList.remove('is-open');
  modalDescriptionEl.classList.add('is-hidden');
});

settingsBtn.addEventListener('click', () => {
  modalOverlayEl.classList.add('is-open');
  modalSettingsEl.classList.remove('is-hidden');
});

modalSettingsBtnClose.addEventListener('click', () => {
  modalOverlayEl.classList.remove('is-open');
  modalSettingsEl.classList.add('is-hidden');
});

guideBtn.addEventListener('click', () => {
  modalOverlayEl.classList.add('is-open');
  modalGuideEl.classList.remove('is-hidden');
});

modalGuideBtnClose.addEventListener('click', () => {
  modalOverlayEl.classList.remove('is-open');
  modalGuideEl.classList.add('is-hidden');
  console.log(modalGuideEl);
});

modalOverlayEl.addEventListener('click', event => {
  // console.log(event.currentTarget);
  // console.log(event.target);
  if (event.target === modalOverlayEl) {
    modalOverlayEl.classList.remove('is-open');

    modalHelpEl.classList.add('is-hidden');
    modalDescriptionEl.classList.add('is-hidden');
    modalSettingsEl.classList.add('is-hidden');
    modalGuideEl.classList.add('is-hidden');
  }
});

const solveList = document.querySelector('.solve-list');
const solve1Cross = document.querySelector('#solve-first-cross');
const solve1Corners = document.querySelector('#solve-first-corners');
const solveMiddle = document.querySelector('#solve-middle');
const solve3Cross1 = document.querySelector('#solve-third-cross-1');
const solve3Cross2 = document.querySelector('#solve-third-cross-2');
const solve3Corners1 = document.querySelector('#solve-third-corners-1');
const solve3Corners2 = document.querySelector('#solve-third-corners-2');

solve1Cross.disabled = true;
solve1Corners.disabled = true;
solveMiddle.disabled = true;
solve3Cross1.disabled = true;
solve3Cross2.disabled = true;
solve3Corners1.disabled = true;
solve3Corners2.disabled = true;

scrambleBtn.disabled = true;
solveBtn.disabled = true;

prevBtn.disabled = true;
nextBtn.disabled = true;

initMouseControls({
  renderer,
  camera,
  scene,
  controls,
  cube,
});
let screenSaverTimer;

let idleAnimation = 10;
const settingsForm = document.querySelector('.settings-form');
let formData = {
  speed: '',
  scramble: '',
  idle: '',
  sound: '',
};

onOutputSettingsFromLs();
applySettingsToForm();
cube.create();
// ---------------------Вход в приложение-------------------
resetScreenSaverTimer();
const resetBtn = document.querySelector('#reset-btn');

function startApplication() {
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
      cube.startScreenSaver();
    },
    idleAnimation * 60 * 1000
  );
}

// ---------------------Scramble------------

function startScramble() {
  cube.scramble();
}

function lockCubeScramble() {
  console.log('Lock');
}

function unlockCubeScramble() {
  isBusy = false;
  scrambleBtn.disabled = false;
  solveBtn.disabled = false;
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}
// -------------------------Settings & LocalStorage-------------------------

settingsForm.addEventListener('change', e => {
  if (e.target.name === 'speed') {
    console.log('speed', Number(e.target.value) / 50);
    cube.rotationSpeed = Number(e.target.value) / 50;
  }

  if (e.target.name === 'scramble') {
    console.log('scramble', Number(e.target.value));
    cube.scrambleLength = Number(e.target.value);
  }

  if (e.target.name === 'sound') {
    console.log('sound', e.target.checked);
    cube.soundEnabled = e.target.checked;
  }

  if (e.target.name === 'idle') {
    console.log('idle', Number(e.target.value));
    idleAnimation = Number(e.target.value);
  }
  onInputSettingsToLS();
});

function onOutputSettingsFromLs() {
  try {
    const forDataFromLS = JSON.parse(localStorage.getItem('dataSetting'));
    if (forDataFromLS === null) {
      console.log('NULL');
      formData.speed = cube.rotationSpeed;
      formData.scramble = cube.scrambleLength;
      formData.idle = idleAnimation;
      formData.sound = cube.soundEnabled;
      console.log('formDataNUll', formData);
    } else {
      formData = forDataFromLS;
    }

    cube.rotationSpeed = formData.speed;
    cube.scrambleLength = formData.scramble;
    cube.soundEnabled = formData.sound;
    idleAnimation = formData.idle;
  } catch (error) {
    console.log(error);
  }
}

function applySettingsToForm() {
  // speed
  document.querySelector(
    `input[name="speed"][value="${formData.speed * 50}"]`
  ).checked = true;

  // scramble
  document.querySelector(
    `input[name="scramble"][value="${formData.scramble}"]`
  ).checked = true;

  // idle
  document.querySelector(
    `input[name="idle"][value="${formData.idle}"]`
  ).checked = true;

  // sound
  document.querySelector(`input[name="sound"]`).checked = formData.sound;
}

function onInputSettingsToLS() {
  formData.speed = cube.rotationSpeed;
  formData.scramble = cube.scrambleLength;
  formData.idle = idleAnimation;
  formData.sound = cube.soundEnabled;
  localStorage.setItem('dataSetting', JSON.stringify(formData));
}

// -----------------How to solve------------------------?
let currentPage = 0;
let guidePages = guidePagesEN;
const prevGuidElBtn = document.querySelector('#guide-prev');
const nextGuidElBtn = document.querySelector('#guide-next');
const guideContent = document.querySelector('.guide-content');
const guideCounter = document.querySelector('#guide-counter');

async function renderGuide() {
  try {
    const response = await fetch(guidePages[currentPage]);
    if (!response.ok) {
      throw new Error(`Cannot load ${guidePages[currentPage]}`);
    }
    guideContent.innerHTML = await response.text();
    const page = cubePages[currentPage];
    Object.entries(page).forEach(([name, cubes]) => {
      guideContent.querySelectorAll(`[data-cube="${name}"]`).forEach(el => {
        el.innerHTML = cubes.join('');
      });
    });
    guideCounter.textContent = `${currentPage + 1} / ${guidePages.length}`;
    prevGuidElBtn.disabled = currentPage === 0;
    nextGuidElBtn.disabled = currentPage === guidePages.length - 1;
  } catch (err) {
    guideContent.innerHTML = `<p>Guide page not found.</p>`;
    console.error(err);
  }
}

renderGuide();
function nextPage() {
  if (currentPage >= guidePages.length - 1) return;
  currentPage++;
  renderGuide();
}

function prevPage() {
  if (currentPage <= 0) return;
  currentPage--;
  renderGuide();
}

const langBtn = document.querySelector('#lang-btn');

langBtn.addEventListener('click', () => {
  if (guidePages === guidePagesEN) {
    guidePages = guidePagesUA;
    langBtn.textContent = '🇬🇧';
  } else {
    guidePages = guidePagesEN;
    langBtn.textContent = '🇺🇦';
  }
  renderGuide();
});

nextGuidElBtn.addEventListener('click', nextPage);
prevGuidElBtn.addEventListener('click', prevPage);
// -----------------Prev & Next--------------------
prevBtn.addEventListener('click', () => cube.onPrevBtn());
nextBtn.addEventListener('click', () => cube.onNextBtn());

// ----------------------Solve-----------------------------

solveBtn.addEventListener('click', async () => {
  await cube.onSolveBtn();
});

// ------------------------simply algoritms--------------------------

solve1Cross.addEventListener('click', async () => {
  await cube.onSolve1thCross();
});

solve1Corners.addEventListener('click', async () => {
  await cube.onSolve1thCorners();
});

solveMiddle.addEventListener('click', async () => {
  await cube.onsolveMiddle();
});

solve3Cross1.addEventListener('click', async () => {
  await cube.onsolve3Cross1();
});

solve3Cross2.addEventListener('click', async () => {
  await cube.onsolve3Cross2();
});

solve3Corners1.addEventListener('click', async () => {
  await cube.onsolve3Corners1();
});

solve3Corners2.addEventListener('click', async () => {
  await cube.onsolve3Corners2();
});
// ----------------------Adapt----------------------
const buttons = document.querySelectorAll('.solve-btn');

// function updateButtons() {
//   buttons.forEach(button => {
//     button.textContent =
//       window.innerWidth < 768 ? button.dataset.short : button.dataset.full;
//   });
// }

function updateButtons() {
  const width = window.innerWidth;

  buttons.forEach(button => {
    if (width < 768) {
      button.textContent = button.dataset.short;
    } else if (width < 1024) {
      button.textContent = button.dataset.medium;
    } else {
      button.textContent = button.dataset.full;
    }
  });
}

updateButtons();
window.addEventListener('resize', updateButtons);
// -------------------------test--------
initKeyboard(cube);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  cube.update();

  if (cube.screenSaver) {
    cube.rotateY(0.001);
    cube.rotateX(0.001);
    navEls.classList.add('is-hidden');
    headerEls.classList.add('is-hidden');
    solveList.classList.add('is-hidden');
  } else {
    navEls.classList.remove('is-hidden');
    headerEls.classList.remove('is-hidden');
    solveList.classList.remove('is-hidden');
  }

  if (cube.demo) {
    cube.rotateY(0.01);
    cube.rotateX(0.01);
  }

  renderer.render(scene, camera);
}

animate();
