// RubiksCube.js

import * as THREE from 'three';
import turnMp3 from '/turn.mp3';

import {
  solveCross1,
  solveCross2,
  solveCross3,
  solveCross4,
  solveCross5,
  solveCross6,
  solveCross7,
  solveCross8,
  solveCross9,
  solveCross10,
} from '../solver/solveCross.js';

import {
  solve1Corners1,
  solve1Corners2,
  solve1Corners3,
  solve1Corners4,
} from '../solver/solve1Corners.js';

import {
  solveMiddle1,
  solveMiddle2,
  solveMiddle3,
  solveMiddle4,
  solveMiddle5,
  solveMiddle6,
  solveMiddle7,
  solveMiddle8,
} from '../solver/solverMiddle.js';
import { solve3Cross1, solve3Cross2 } from '../solver/solve3Cross.js';

import { solve3Corners1, solve3Corners2 } from '../solver/solve3Corners.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import {
  COLORS,
  MOVES,
  CUBE_SIZE,
  ROTATION_SPEED,
  reverseMove,
} from './constantsCube.js';
import { AlgorithmParser } from './AlgorithmParser.js';
import { CubeState, NEIGHBORS } from '../solver/CubeState.js';
import { solveCube } from '../solver/solveCube.js';
import { createRubikLoader } from '../solver/loader.js';

const resetBtn = document.querySelector('#reset-btn');
const scrambleBtn = document.querySelector('#scramble-btn');
const solveBtn = document.querySelector('#solve-btn');
const prevBtn = document.querySelector('#undo-btn');
const nextBtn = document.querySelector('#redo-btn');
const modalOverlayEl = document.querySelector('.modal-overlay');
const loaderEl = document.querySelector('#cube-loader-vis');
const solve1CrossEl = document.querySelector('#solve-first-cross');
const solve1CornersEl = document.querySelector('#solve-first-corners');
const solveMiddleEl = document.querySelector('#solve-middle');
const solve3Cross1El = document.querySelector('#solve-third-cross-1');
const solve3Cross2El = document.querySelector('#solve-third-cross-2');
const solve3Corners1El = document.querySelector('#solve-third-corners-1');
const solve3Corners2El = document.querySelector('#solve-third-corners-2');

export class RubiksCube {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.cubies = [];
    this.colors = COLORS;
    this.geometry = new RoundedBoxGeometry(
      CUBE_SIZE,
      CUBE_SIZE,
      CUBE_SIZE,
      6, // сегменты
      0.05 // радиус
    );
    this.currentRotation = null;
    this.moveQueue = [];
    this.moves = MOVES;
    this.parser = new AlgorithmParser();
    this.cubeState = new CubeState();
    this.screenSaver = false;
    this.isBusyScramble = false;
    this.isScrambling = false;
    this.rotationSpeed = 0.1;
    this.scrambleLength = 20;
    this.soundEnabled = true;
    this.turnSound = new Audio(turnMp3);
    this.turnSound.volume = 0.3;
    this.history = [];
    this.isAnimation = false;
    this.counter = 1;
    this.isSolving = false;
    this.solution = false;
    this.worker = new Worker(
      new URL('../solver/solver.wolker.js', import.meta.url),
      {
        type: 'module',
      }
    );
    this.worker.onmessage = this.onSolveFinished.bind(this);
    this.worker.onerror = this.onSolveError.bind(this);
    this.targetRotation = null;
    this.rotateSpeed = 0.15;
    this.solCross1 = false;
    this.solCorner1 = false;
    this.solMiddle = false;
    this.sol3Cross1 = false;
    this.sol3Cross2 = false;
    this.sol3Corners1 = false;
    this.sol3Corners2 = false;
  }

  updateResetButtons() {
    if (this.solution) {
      scrambleBtn.disabled = true;
      resetBtn.disabled = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;

      solveBtn.disabled = false;
      solve1CrossEl.disabled = false;
      solve1CornersEl.disabled = false;
      solveMiddleEl.disabled = false;
      solve3Cross1El.disabled = false;
      solve3Cross2El.disabled = false;
      solve3Corners1El.disabled = false;
      solve3Corners2El.disabled = false;

      return;
    }
    if (this.isSolving) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      scrambleBtn.disabled = true;
      solveBtn.disabled = true;
      solve1CrossEl.disabled = true;
      solve1CornersEl.disabled = true;
      solveMiddleEl.disabled = true;
      solve3Cross1El.disabled = true;
      solve3Cross2El.disabled = true;
      solve3Corners1El.disabled = true;
      solve3Corners2El.disabled = true;

      resetBtn.disabled = true;
      return;
    }
    resetBtn.disabled = false;

    if (
      this.cubeState.getCell('U', 0, 1) === 'WB' &&
      this.cubeState.getCell('U', 1, 0) === 'WO' &&
      this.cubeState.getCell('U', 1, 2) === 'WR' &&
      this.cubeState.getCell('U', 2, 1) === 'WG'
    ) {
      this.solCross1 = true;
      solve1CrossEl.disabled = true;
    } else {
      this.solCross1 = false;
      solve1CrossEl.disabled = false;
    }

    if (
      this.cubeState.getCell('U', 0, 0) === 'WOB' &&
      this.cubeState.getCell('U', 0, 2) === 'WBR' &&
      this.cubeState.getCell('U', 2, 0) === 'WGO' &&
      this.cubeState.getCell('U', 2, 2) === 'WRG' &&
      this.solCross1
    ) {
      this.solCorner1 = true;
      solve1CornersEl.disabled = true;
    } else {
      this.solCorner1 = false;
      solve1CornersEl.disabled = false;
    }

    if (
      this.cubeState.getCell('F', 1, 0) === 'GO' &&
      this.cubeState.getCell('F', 1, 2) === 'GR' &&
      this.cubeState.getCell('B', 1, 0) === 'BR' &&
      this.cubeState.getCell('B', 1, 2) === 'BO' &&
      this.solCorner1
    ) {
      this.solMiddle = true;
      solveMiddleEl.disabled = true;
    } else {
      this.solMiddle = false;
      solveMiddleEl.disabled = false;
    }

    if (
      this.cubeState.getCell('D', 0, 1).slice(0, 1) === 'Y' &&
      this.cubeState.getCell('D', 1, 0).slice(0, 1) === 'Y' &&
      this.cubeState.getCell('D', 1, 2).slice(0, 1) === 'Y' &&
      this.cubeState.getCell('D', 2, 1).slice(0, 1) === 'Y' &&
      this.solMiddle
    ) {
      this.sol3Cross1 = true;
      solve3Cross1El.disabled = true;
    } else {
      this.sol3Cross1 = false;
      solve3Cross1El.disabled = false;
    }

    if (
      this.cubeState.getCell('D', 0, 1) === 'YG' &&
      this.cubeState.getCell('D', 1, 0) === 'YO' &&
      this.cubeState.getCell('D', 1, 2) === 'YR' &&
      this.cubeState.getCell('D', 2, 1) === 'YB' &&
      this.sol3Cross1
    ) {
      this.sol3Cross2 = true;
      solve3Cross2El.disabled = true;
    } else {
      this.sol3Cross2 = false;
      solve3Cross2El.disabled = false;
    }

    if (
      this.cubeState.getCell('D', 0, 0).includes('O') &&
      this.cubeState.getCell('D', 0, 0).includes('G') &&
      this.cubeState.getCell('D', 0, 2).includes('G') &&
      this.cubeState.getCell('D', 0, 2).includes('R') &&
      this.cubeState.getCell('D', 2, 0).includes('B') &&
      this.cubeState.getCell('D', 2, 0).includes('O') &&
      this.cubeState.getCell('D', 2, 2).includes('R') &&
      this.cubeState.getCell('D', 2, 2).includes('B') &&
      this.sol3Cross2
    ) {
      this.sol3Corners1 = true;
      solve3Corners1El.disabled = true;
    } else {
      this.sol3Corners1 = false;
      solve3Corners1El.disabled = false;
    }

    if (
      this.cubeState.getCell('D', 0, 0) === 'YOG' &&
      this.cubeState.getCell('D', 0, 2) === 'YGR' &&
      this.cubeState.getCell('D', 2, 0) === 'YBO' &&
      this.cubeState.getCell('D', 2, 2) === 'YRB' &&
      this.sol3Corners1
    ) {
      this.sol3Corners2 = true;
      solve3Corners2El.disabled = true;
    } else {
      this.sol3Corners2 = false;
      solve3Corners2El.disabled = false;
    }

    const solved = this.cubeState.isSolved();
    scrambleBtn.disabled = this.isScrambling || !solved;

    if (
      !this.history.length ||
      this.isScrambling ||
      this.history.length + 1 === this.counter
    ) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }

    if (!this.history.length || this.isScrambling || this.counter === 1) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    if (!this.history.length || solved) {
      solveBtn.disabled = true;
    } else {
      solveBtn.disabled = false;
    }

    this.isAnimation = false;
  }

  createCubie(x, y, z) {
    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        roughness: 0.15,
        metalness: 0,

        clearcoat: 0.9,
        clearcoatRoughness: 0.08,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,

        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,

        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
    ];

    const cubie = new THREE.Mesh(this.geometry, materials);
    const spacing = 0.98;
    cubie.position.set(x * spacing, y * spacing, z * spacing);
    cubie.userData = {
      isCubie: true,
      coord: {
        x,
        y,
        z,
      },
    };

    this.addStickers(cubie, x, y, z);
    const edges = new THREE.EdgesGeometry(this.geometry);

    const outline = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0,
        depthTest: false,
      })
    );

    cubie.add(outline);
    cubie.userData.outline = outline;
    return cubie;
  }

  createSticker(color) {
    const geometry = new THREE.BoxGeometry(0.78, 0.78, 0.02);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.18,
      metalness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    return new THREE.Mesh(geometry, material);
  }

  addStickers(cubie, x, y, z) {
    const offset = 0.486;

    if (x === 1) {
      const sticker = this.createSticker(this.colors.right);
      sticker.position.x = offset;
      sticker.rotation.y = Math.PI / 2;
      cubie.add(sticker);
    }

    if (x === -1) {
      const sticker = this.createSticker(this.colors.left);
      sticker.position.x = -offset;
      sticker.rotation.y = -Math.PI / 2;
      cubie.add(sticker);
    }

    if (y === 1) {
      const sticker = this.createSticker(this.colors.top);
      sticker.position.y = offset;
      sticker.rotation.x = -Math.PI / 2;
      cubie.add(sticker);
    }

    if (y === -1) {
      const sticker = this.createSticker(this.colors.bottom);
      sticker.position.y = -offset;
      sticker.rotation.x = Math.PI / 2;
      cubie.add(sticker);
    }

    if (z === 1) {
      const sticker = this.createSticker(this.colors.front);
      sticker.position.z = offset;
      cubie.add(sticker);
    }

    if (z === -1) {
      const sticker = this.createSticker(this.colors.back);
      sticker.position.z = -offset;
      sticker.rotation.y = Math.PI;
      cubie.add(sticker);
    }
  }

  create() {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = this.createCubie(x, y, z);
          this.group.add(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  rotateX(angle) {
    this.group.rotation.x += angle;
  }

  rotateY(angle) {
    this.group.rotation.y += angle;
  }

  getFace(axis, value) {
    return this.cubies.filter(cubie => cubie.userData.coord[axis] === value);
  }

  rotateLayer(axis, value, angle) {
    const face = this.getFace(axis, value);
    const faceGroup = new THREE.Group();
    this.group.add(faceGroup);

    face.forEach(cubie => {
      faceGroup.attach(cubie);
    });

    faceGroup.rotation[axis] = angle;

    face.forEach(cubie => {
      this.group.attach(cubie);
      console.log(cubie.userData.coord, cubie.position);
      this.updateCubieCoords(cubie);
    });
    this.group.remove(faceGroup);
  }

  updateCubieCoords(cubie) {
    cubie.userData.coord.x = Math.round(cubie.position.x);
    cubie.userData.coord.y = Math.round(cubie.position.y);
    cubie.userData.coord.z = Math.round(cubie.position.z);
  }

  startRotation(move) {
    if (this.currentRotation) return;
    this.playTurnSound();
    const face = this.getFace(move.axis, move.value);
    const faceGroup = new THREE.Group();
    this.group.add(faceGroup);
    face.forEach(cubie => {
      faceGroup.attach(cubie);
    });
    this.currentRotation = {
      ...move,
      currentAngle: 0,
      face,
      faceGroup,
    };
  }

  update() {
    if (!this.currentRotation && this.moveQueue.length > 0) {
      const move = this.moveQueue.shift();
      this.startRotation(move);
    }

    // ---------------Simply Algoritm------------------------------
    if (this.targetRotation) {
      this.group.rotation.x +=
        (this.targetRotation.x - this.group.rotation.x) * 0.1;
      this.group.rotation.y +=
        (this.targetRotation.y - this.group.rotation.y) * 0.1;
      this.group.rotation.z +=
        (this.targetRotation.z - this.group.rotation.z) * 0.1;

      if (
        Math.abs(this.group.rotation.x - this.targetRotation.x) < 0.01 &&
        Math.abs(this.group.rotation.y - this.targetRotation.y) < 0.01 &&
        Math.abs(this.group.rotation.z - this.targetRotation.z) < 0.01
      ) {
        this.group.rotation.set(
          this.targetRotation.x,
          this.targetRotation.y,
          this.targetRotation.z
        );
        this.targetRotation = null;

        if (this.afterRotate) {
          const fn = this.afterRotate;
          this.afterRotate = null;
          fn();
        }

        if (this.afterRotateEnd) {
          const fn = this.afterRotateEnd;
          this.afterRotateEnd = null;
          fn();
        }
      }
    }
    // ---------------------------------------------
    if (!this.currentRotation) return;
    let speed;
    if (!this.demo) {
      speed = this.rotationSpeed;
    } else {
      speed = 0.01;
    }
    const rotation = this.currentRotation;
    const direction = Math.sign(rotation.angle);
    const remaining =
      Math.abs(rotation.angle) - Math.abs(rotation.currentAngle);
    const step = Math.min(speed, remaining) * direction;

    rotation.faceGroup.rotation[rotation.axis] += step;
    rotation.currentAngle += step;

    if (Math.abs(rotation.currentAngle) >= Math.abs(rotation.angle)) {
      rotation.face.forEach(cubie => {
        this.group.attach(cubie);
        cubie.position.set(
          Math.round(cubie.position.x),
          Math.round(cubie.position.y),
          Math.round(cubie.position.z)
        );
        const q = Math.PI / 2;

        cubie.rotation.set(
          Math.round(cubie.rotation.x / q) * q,
          Math.round(cubie.rotation.y / q) * q,
          Math.round(cubie.rotation.z / q) * q
        );

        cubie.updateMatrix();
        cubie.updateMatrixWorld(true);
        this.updateCubieCoords(cubie);
      });

      this.group.remove(rotation.faceGroup);
      const reverse = rotation.name.endsWith('Prime');
      const moveName = reverse
        ? rotation.name.replace('Prime', '')
        : rotation.name;

      let newMoveName = moveName;
      !reverse ? newMoveName : (newMoveName = newMoveName + "'");

      if (!this.demo) {
        this.cubeState.move(newMoveName, false);
        let array = this.history.slice(
          0,
          this.history.length + 1 - this.counter
        );
        if (!this.isAnimation) {
          this.counter = 1;
          array.push(newMoveName);
          this.history = array;
        }
      }

      this.currentRotation = null;
      if (this.moveQueue.length === 0) {
        if (this.onFinish) {
          const fn = this.onFinish;
          this.onFinish = null;
          fn();
        }

        if (!this.demo) {
          this.isScrambling = false;
          this.updateResetButtons();
          if (this.cubeState.isSolved()) {
            console.log('🎉 Cube solved!');
          }
        }
      }
    }
  }

  enqueueMove(name) {
    const reverse = name.endsWith('Prime');
    const moveName = reverse ? name.replace('Prime', '') : name;
    this.moveQueue.push({
      name,
      ...this.moves[name],
    });
  }

  R() {
    this.enqueueMove('R');
  }

  RPrime() {
    this.enqueueMove('RPrime');
  }

  L() {
    this.enqueueMove('L');
  }

  LPrime() {
    this.enqueueMove('LPrime');
  }

  U() {
    this.enqueueMove('U');
  }

  UPrime() {
    this.enqueueMove('UPrime');
  }

  D() {
    this.enqueueMove('D');
  }

  DPrime() {
    this.enqueueMove('DPrime');
  }

  F() {
    this.enqueueMove('F');
  }

  FPrime() {
    this.enqueueMove('FPrime');
  }

  B() {
    this.enqueueMove('B');
  }

  BPrime() {
    this.enqueueMove('BPrime');
  }

  R2() {
    this.enqueueMove('R2');
  }

  L2() {
    this.enqueueMove('L2');
  }

  U2() {
    this.enqueueMove('U2');
  }

  D2() {
    this.enqueueMove('D2');
  }

  F2() {
    this.enqueueMove('F2');
  }

  B2() {
    this.enqueueMove('B2');
  }

  execute(sequence) {
    return new Promise(resolve => {
      this.onFinish = resolve;

      if (!sequence.trim()) {
        resolve();
        return;
      }

      const moves = this.parser.parse(sequence);

      moves.forEach(move => {
        this.enqueueMove(move);
      });
    });
  }

  startDemo() {
    this.demo = true;
    const faces = [
      'R',
      'L',
      'U',
      'D',
      'F',
      'B',
      'RPrime',
      'LPrime',
      'UPrime',
      'DPrime',
      'FPrime',
      'BPrime',
    ];

    const demoLoop = () => {
      if (!this.demo) return;

      if (!this.currentRotation && this.moveQueue.length === 0) {
        const randomMove = faces[Math.floor(Math.random() * faces.length)];
        this.enqueueMove(randomMove);
      }
      requestAnimationFrame(demoLoop);
    };

    demoLoop();
  }

  scramble(count = this.scrambleLength) {
    this.isScrambling = true;
    const faces = ['R', 'L', 'U', 'D', 'F', 'B'];
    const suffixes = ['', 'Prime', '2'];

    let lastFace = null;
    let lastAxis = null;

    const axisMap = {
      R: 'x',
      L: 'x',
      U: 'y',
      D: 'y',
      F: 'z',
      B: 'z',
    };

    const sequence = [];

    for (let i = 0; i < count; i++) {
      let face;
      let axis;

      do {
        face = faces[Math.floor(Math.random() * faces.length)];
        axis = axisMap[face];

        if (face === lastFace) continue;
        if (axis === lastAxis && i >= 2) continue;

        break;
      } while (true);

      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

      if (suffix === '2') {
        this.enqueueMove(face);
        this.enqueueMove(face);

        sequence.push(face + '2'); // записываем как один ход
      } else {
        this.enqueueMove(face + suffix);

        sequence.push(suffix === 'Prime' ? `${face}'` : face);
      }

      lastFace = face;
      lastAxis = axis;
    }
    this.updateResetButtons();
    return sequence.join(' ');
  }

  isBusy() {
    return this.currentRotation !== null || this.moveQueue.length > 0;
  }

  highlightFace(axis, value) {
    this.clearHighlight();
    const face = this.getFace(axis, value);
    face.forEach(cubie => {
      cubie.material.forEach(mat => {
        mat.emissive.setHex(0x888888);
      });
    });
  }

  clearHighlight() {
    this.cubies.forEach(cubie => {
      cubie.material.forEach(mat => {
        mat.emissive.setHex(0x000000);
      });
    });
  }

  stopDemo() {
    console.log('stopDemo');
    this.demo = false;
    this.group.rotation.set(0, 0, 0);
  }

  reset() {
    this.stopDemo();
    this.moveQueue = [];
    this.history = [];
    this.counter = 1;
    this.isAnimation = false;
    this.isScrambling = false;

    if (this.currentRotation) {
      this.currentRotation = null;
    }

    this.group.clear();
    this.cubies = [];
    this.cubeState = new CubeState();
    this.create();
    this.updateResetButtons();
  }

  startScreenSaver() {
    this.screenSaver = true;
    console.log('startScreenSaver');
  }

  stopScreenSaver() {
    console.log('EndWoW');
    this.screenSaver = false;
    this.group.rotation.set(0, 0, 0);
  }

  executeMove(face, direction) {
    const map = {
      F: {
        RIGHT: () => this.F(),
        LEFT: () => this.FPrime(),
      },
      B: {
        RIGHT: () => this.BPrime(),
        LEFT: () => this.B(),
      },
      R: {
        RIGHT: () => this.RPrime(),
        LEFT: () => this.R(),
      },
      L: {
        RIGHT: () => this.L(),
        LEFT: () => this.LPrime(),
      },
      U: {
        RIGHT: () => this.UPrime(),
        LEFT: () => this.U(),
      },
      D: {
        RIGHT: () => this.D(),
        LEFT: () => this.DPrime(),
      },
    };

    map[face]?.[direction]?.();
  }

  unlockCubeScramble() {
    this.isBusyScramble = false;

    console.log('UNLock');
  }

  playTurnSound() {
    if (!this.soundEnabled) return;
    const sound = this.turnSound.cloneNode();
    sound.volume = this.turnSound.volume;
    sound.play().catch(() => {});
  }

  onPrevBtn() {
    this.isAnimation = true;
    console.log('LENGTH', this.history.length);
    console.log('PREVBTN');
    console.log('MOVE', this.history[this.history.length - this.counter]);
    console.log('COUNTER', this.counter);
    let nameReverseMove = reverseMove(
      this.history[this.history.length - this.counter]
    );
    console.log('ReverseMove', nameReverseMove);
    this.execute(nameReverseMove);
    this.counter = this.counter + 1;
    console.log('PREVBTN-History', this.history);
  }

  onNextBtn() {
    this.isAnimation = true;
    this.counter = this.counter - 1;
    this.execute(this.history[this.history.length - this.counter]);
    console.log('MOVENext', this.history[this.history.length - this.counter]);
    console.log('NextBTN-History', this.history);
  }

  async onSolveBtn() {
    if (this.solution) {
      this.execute(this.solution.join(' '));
      this.solution = null;
      solveBtn.textContent = 'FIND SOLUTION KOCIEMBA';
      this.updateResetButtons();
      this.isSolving = false;
      return;
    }
    this.isSolving = true;
    this.updateResetButtons();
    modalOverlayEl.classList.add('is-open');
    loaderEl.classList.remove('is-hidden');
    this.destroyLoader = createRubikLoader(loaderEl);
    this.worker.postMessage({
      corners: this.cubeState.corners,
      edges: this.cubeState.edges,
    });
  }

  onSolveFinished(e) {
    this.solution = e.data;
    console.log('onSolveFinished', this.solution);
    this.destroyLoader?.();
    modalOverlayEl.classList.remove('is-open');
    loaderEl.classList.add('is-hidden');
    solveBtn.textContent = 'SOLVE KOCIEMBA';
    this.updateResetButtons();
  }
  onSolveError(err) {
    console.error(err);
    this.isSolving = false;
    this.updateResetButtons();
    this.destroyLoader?.();
    modalOverlayEl.classList.remove('is-open');
    loaderEl.classList.remove('is-hidden');
  }
  // ----------------------Simply algoritm---------------------------
  rotateToUp(color) {
    const rotations = {
      W: { x: 0, y: 0, z: 0 },
      Y: { x: Math.PI, y: 0, z: 0 },
      G: { x: -Math.PI / 2, y: 0, z: 0 },
      B: { x: -Math.PI / 2, y: 0, z: 0 },
      R: { x: -Math.PI / 2, y: -Math.PI / 2, z: 0 },
      O: { x: -Math.PI / 2, y: Math.PI / 2, z: 0 },
    };

    this.targetRotation = rotations[color];
  }

  rotateToOrientation(upColor, frontColor) {
    this.rotateToUp(upColor);
    const indFrontColor = NEIGHBORS[upColor].indexOf(frontColor);
    this.afterRotate = () => {
      this.targetRotation = {
        x: this.group.rotation.x,
        y: this.group.rotation.y - (Math.PI / 2) * indFrontColor,
        z: this.group.rotation.z,
      };
    };
  }

  rotateTo(arrow, count = 1) {
    return new Promise(resolve => {
      let step = 0;
      let stepX = 0;
      let stepY = 0;
      let stepZ = 0;

      if (arrow === 'right' || arrow === 'up' || arrow === 'rightUp') {
        step = -(Math.PI / 2) * count;
      } else {
        step = (Math.PI / 2) * count;
      }

      if (arrow === 'right' || arrow === 'left') {
        stepY = step;
      }

      if (arrow === 'up' || arrow === 'down') {
        stepX = step;
      }

      if (arrow === 'rightUp' || arrow === 'rightDown') {
        stepZ = step;
      }

      this.afterRotate = () => {
        this.targetRotation = {
          x: this.group.rotation.x + stepX,
          y: this.group.rotation.y + stepY,
          z: this.group.rotation.z + stepZ,
        };
        this.afterRotate = resolve;
      };
      this.afterRotate();
    });
  }

  async onSolve1thCross() {
    this.isSolving = true;
    this.updateResetButtons();

    let solutionCross = solveCross1(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    solutionCross = solveCross2(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    solutionCross = solveCross3(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    solutionCross = solveCross4(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    solutionCross = solveCross5(this.cubeState);
    await this.execute(solutionCross.join(' '));

    await this.rotateTo('up');
    solutionCross = solveCross6(this.cubeState);
    await this.execute(solutionCross.join(' '));

    solutionCross = solveCross7(this.cubeState);
    await this.execute(solutionCross.join(' '));

    await this.rotateTo('right');
    solutionCross = solveCross8(this.cubeState);
    await this.execute(solutionCross.join(' '));

    await this.rotateTo('right');
    solutionCross = solveCross9(this.cubeState);
    await this.execute(solutionCross.join(' '));

    await this.rotateTo('right');
    solutionCross = solveCross10(this.cubeState);
    await this.execute(solutionCross.join(' '));

    this.isSolving = false;
    await this.rotateTo('right');
    await this.rotateTo('down');
    await this.rotateTo('right');
    await this.rotateTo('right');
    await this.rotateTo('right');
    await this.rotateTo('right');
    this.updateResetButtons();
  }

  async onSolve1thCorners() {
    if (!this.solCross1) {
      await this.onSolve1thCross();
    }
    this.isSolving = true;
    this.updateResetButtons();

    let solutionCross = solve1Corners1(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    solutionCross = solve1Corners2(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    solutionCross = solve1Corners3(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    solutionCross = solve1Corners4(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('right');

    this.isSolving = false;
    this.updateResetButtons();
  }

  async onsolveMiddle() {
    if (!this.solCorner1) {
      await this.onSolve1thCorners();
    }
    this.isSolving = true;
    this.updateResetButtons();

    await this.rotateTo('up', 2);
    let solutionCross = solveMiddle1(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');

    solutionCross = solveMiddle2(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');

    solutionCross = solveMiddle3(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');

    solutionCross = solveMiddle4(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');

    solutionCross = solveMiddle5(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');

    solutionCross = solveMiddle6(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');

    solutionCross = solveMiddle7(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');

    solutionCross = solveMiddle8(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');
    await this.rotateTo('up', 2);

    this.isSolving = false;
    this.updateResetButtons();
  }

  async onsolve3Cross1() {
    if (!this.solMiddle) {
      await this.onsolveMiddle();
    }
    this.isSolving = true;
    this.updateResetButtons();

    await this.rotateTo('up', 2);
    let solutionCross = solve3Cross1(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('up', 2);

    this.isSolving = false;
    this.updateResetButtons();
  }

  async onsolve3Cross2() {
    if (!this.sol3Cross1) {
      await this.onsolve3Cross1();
    }
    this.isSolving = true;
    this.updateResetButtons();

    await this.rotateTo('up', 2);
    let solutionCross = solve3Cross2(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');
    await this.rotateTo('left');
    await this.rotateTo('left');
    await this.rotateTo('left');
    await this.rotateTo('up', 2);

    this.isSolving = false;
    this.updateResetButtons();
  }

  async onsolve3Corners1() {
    if (!this.sol3Cross2) {
      await this.onsolve3Cross2();
    }
    this.isSolving = true;
    this.updateResetButtons();

    await this.rotateTo('up', 2);
    let solutionCross = solve3Corners1(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('up', 2);

    this.isSolving = false;
    this.updateResetButtons();
  }

  async onsolve3Corners2() {
    if (!this.sol3Corners1) {
      await this.onsolve3Corners1();
    }
    this.isSolving = true;
    this.updateResetButtons();

    await this.rotateTo('up', 2);
    let solutionCross = solve3Corners2(this.cubeState);
    await this.execute(solutionCross.join(' '));
    await this.rotateTo('left');
    await this.rotateTo('left');
    await this.rotateTo('left');
    await this.rotateTo('left');
    await this.rotateTo('up', 2);

    this.isSolving = false;
    this.updateResetButtons();
  }
}
